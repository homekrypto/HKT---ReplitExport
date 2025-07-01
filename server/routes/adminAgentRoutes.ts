import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { realEstateAgents, type RealEstateAgent, type AgentStatus } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { sendHostingerEmail } from '../hostinger-email';

const router = Router();

// Import temp data from correct files
import { tempUsers } from '../temp-auth-routes';
import { getTempAgents } from '../temp-agent-storage';

// Get agent statistics for admin dashboard
router.get('/stats', async (req: any, res) => {
  try {
    // Check for session token
    const token = req.cookies?.sessionToken;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Simplified admin check using tempUsers
    const user = Array.from(tempUsers.values()).find(u => u.email === 'admin@homekrypto.com');
    if (!user) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const agents = getTempAgents();
    const totalAgents = agents.length;
    // Using isApproved field since the TempAgent interface doesn't have status field
    const pendingAgents = agents.filter(agent => !agent.isApproved && !agent.rejectionReason).length;
    const approvedAgents = agents.filter(agent => agent.isApproved).length;
    const deniedAgents = agents.filter(agent => !agent.isApproved && agent.rejectionReason).length;

    res.json({
      totalAgents,
      pendingAgents,
      approvedAgents,
      deniedAgents,
    });
  } catch (error) {
    console.error('Error fetching agent stats:', error);
    res.status(500).json({ message: 'Failed to fetch agent statistics' });
  }
});

// Admin authentication middleware function
async function requireAdmin(req: any, res: any, next: any) {
  try {
    // Check for session token from cookie or Authorization header
    const token = req.cookies?.sessionToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if it's the admin email (simplified check for now)
    // In a production system, you'd validate the session properly
    const adminEmail = 'admin@homekrypto.com';
    
    // For this implementation, we'll check against simple auth system
    // This should integrate with your existing session validation
    req.user = { email: adminEmail, isAdmin: true };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

// Validation schema for query parameters
const agentQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'denied']).optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
});

// GET /api/admin/agents - Fetch agents with optional status filtering
router.get('/', requireAdmin, async (req, res) => {
  try {
    const query = agentQuerySchema.parse(req.query);
    
    // Build where conditions
    const conditions = [];
    
    if (query.status) {
      conditions.push(eq(realEstateAgents.status, query.status));
    }
    
    // Combine conditions
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Calculate pagination
    const offset = (query.page - 1) * query.limit;
    
    // Execute query with pagination
    const agents = await db
      .select()
      .from(realEstateAgents)
      .where(whereClause)
      .limit(query.limit)
      .offset(offset)
      .orderBy(realEstateAgents.createdAt);
    
    // Get total count for pagination
    const totalAgents = await db
      .select()
      .from(realEstateAgents)
      .where(whereClause);
    
    const total = totalAgents.length;
    const totalPages = Math.ceil(total / query.limit);
    
    res.json({
      success: true,
      data: agents,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1
      },
      filters: {
        status: query.status
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: error.errors
      });
    }
    
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agents'
    });
  }
});

// PATCH /api/admin/agents/:id/approve - Approve an agent
router.patch('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    
    if (isNaN(agentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }
    
    // Check if agent exists
    const [existingAgent] = await db
      .select()
      .from(realEstateAgents)
      .where(eq(realEstateAgents.id, agentId));
    
    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    // Update agent status to approved
    const [updatedAgent] = await db
      .update(realEstateAgents)
      .set({
        status: 'approved',
        isApproved: true, // Update legacy field for backward compatibility
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();
    
    // Send approval email
    const emailSent = await sendApprovalEmail(updatedAgent);
    
    res.json({
      success: true,
      message: 'Agent approved successfully',
      data: updatedAgent,
      emailSent
    });
  } catch (error) {
    console.error('Error approving agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve agent'
    });
  }
});

// PATCH /api/admin/agents/:id/deny - Deny an agent
router.patch('/:id/deny', requireAdmin, async (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    
    if (isNaN(agentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }
    
    // Parse optional rejection reason from request body
    const { reason } = z.object({
      reason: z.string().optional()
    }).parse(req.body);
    
    // Check if agent exists
    const [existingAgent] = await db
      .select()
      .from(realEstateAgents)
      .where(eq(realEstateAgents.id, agentId));
    
    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    // Update agent status to denied
    const [updatedAgent] = await db
      .update(realEstateAgents)
      .set({
        status: 'denied',
        isApproved: false, // Update legacy field for backward compatibility
        rejectionReason: reason || 'Application does not meet current requirements',
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();
    
    // Send denial email
    const emailSent = await sendDenialEmail(updatedAgent);
    
    res.json({
      success: true,
      message: 'Agent application denied',
      data: updatedAgent,
      emailSent
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: error.errors
      });
    }
    
    console.error('Error denying agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deny agent'
    });
  }
});

// Email template functions
async function sendApprovalEmail(agent: RealEstateAgent): Promise<boolean> {
  const approvalEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Agent Application Approved - Home Krypto</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 20px; }
        .agent-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .referral-section { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .next-steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .btn { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        .highlight { color: #667eea; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to Home Krypto</h1>
        <p>Your agent application has been approved!</p>
      </div>
      
      <div class="content">
        <div class="success-badge">✓ APPROVED</div>
        
        <h2>Congratulations, ${agent.firstName} ${agent.lastName}!</h2>
        
        <p>We're excited to inform you that your real estate agent application with Home Krypto has been <strong>approved</strong>. You are now part of our exclusive network of verified real estate professionals.</p>
        
        <div class="agent-details">
          <h3>Your Agent Profile:</h3>
          <p><strong>Name:</strong> ${agent.firstName} ${agent.lastName}</p>
          <p><strong>Email:</strong> ${agent.email}</p>
          <p><strong>License:</strong> ${agent.licenseNumber} (${agent.licenseState})</p>
          <p><strong>Location:</strong> ${agent.city}, ${agent.state}</p>
          ${agent.company ? `<p><strong>Company:</strong> ${agent.company}</p>` : ''}
        </div>

        ${agent.referralLink ? `
        <div class="referral-section">
          <h3>🔗 Your Personal Referral Link</h3>
          <p>Start earning commissions by sharing your personalized referral link:</p>
          <p><strong><a href="${agent.referralLink}" class="highlight">${agent.referralLink}</a></strong></p>
          <p><em>This link tracks all referrals and ensures you receive proper commission credit.</em></p>
        </div>
        ` : ''}

        ${agent.seoBacklinkUrl ? `
        <div class="referral-section">
          <h3>🚀 SEO Enhancement Opportunity</h3>
          <p>To accelerate your approval process and improve your online presence, add this dofollow backlink to your website:</p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; font-family: monospace;">
            &lt;a href="https://homekrypto.com" rel="dofollow"&gt;Crypto Real Estate Investment Platform&lt;/a&gt;
          </div>
          <p><em>This mutual linking strategy benefits both your SEO rankings and our platform visibility.</em></p>
        </div>
        ` : ''}
        
        <div class="next-steps">
          <h3>Next Steps:</h3>
          <ol>
            <li><strong>Access Your Dashboard:</strong> Log in to our agent portal to manage your profile and track referrals</li>
            <li><strong>Share Your Link:</strong> Start promoting Home Krypto using your personalized referral link</li>
            <li><strong>Earn Commissions:</strong> Receive commission payments for successful investor referrals</li>
            <li><strong>Stay Connected:</strong> Follow our updates for new investment opportunities</li>
          </ol>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <a href="https://homekrypto.com" class="btn">Visit Home Krypto Platform</a>
      </div>
      
      <div class="footer">
        <p>Best regards,<br><strong>Home Krypto Team</strong></p>
        <p>Email: support@homekrypto.com | Web: homekrypto.com</p>
        <p><em>Democratizing real estate investment through blockchain technology</em></p>
      </div>
    </body>
    </html>
  `;

  try {
    return await sendHostingerEmail({
      to: agent.email,
      subject: '🎉 Agent Application Approved - Welcome to Home Krypto',
      html: approvalEmailHtml,
      text: `Congratulations ${agent.firstName}! Your Home Krypto agent application has been approved. You can now start earning commissions by referring investors to our platform.`
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
}

async function sendDenialEmail(agent: RealEstateAgent): Promise<boolean> {
  const denialEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Agent Application Update - Home Krypto</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-badge { background: #ef4444; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 20px; }
        .reason-section { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .next-steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .btn { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Home Krypto Agent Application</h1>
        <p>Application Status Update</p>
      </div>
      
      <div class="content">
        <div class="status-badge">Application Not Approved</div>
        
        <h2>Dear ${agent.firstName} ${agent.lastName},</h2>
        
        <p>Thank you for your interest in joining the Home Krypto real estate agent network. After careful review of your application, we have decided not to approve your application at this time.</p>
        
        ${agent.rejectionReason ? `
        <div class="reason-section">
          <h3>Feedback:</h3>
          <p>${agent.rejectionReason}</p>
        </div>
        ` : ''}
        
        <div class="next-steps">
          <h3>What's Next:</h3>
          <ul>
            <li><strong>Reapply Later:</strong> You may resubmit your application in the future when you meet our requirements</li>
            <li><strong>Stay Updated:</strong> Follow our platform for updates on agent requirements and opportunities</li>
            <li><strong>Alternative Participation:</strong> Consider becoming an investor on our platform instead</li>
          </ul>
        </div>
        
        <p>We appreciate your interest in Home Krypto and encourage you to stay connected with our platform. Our requirements may evolve, and we welcome future applications.</p>
        
        <p>If you have any questions about this decision or our requirements, please feel free to contact our support team.</p>
        
        <a href="https://homekrypto.com" class="btn">Visit Home Krypto Platform</a>
      </div>
      
      <div class="footer">
        <p>Best regards,<br><strong>Home Krypto Team</strong></p>
        <p>Email: support@homekrypto.com | Web: homekrypto.com</p>
        <p><em>Democratizing real estate investment through blockchain technology</em></p>
      </div>
    </body>
    </html>
  `;

  try {
    return await sendHostingerEmail({
      to: agent.email,
      subject: 'Agent Application Update - Home Krypto',
      html: denialEmailHtml,
      text: `Dear ${agent.firstName}, thank you for your interest in Home Krypto. Your agent application was not approved at this time. You may reapply in the future when you meet our requirements.`
    });
  } catch (error) {
    console.error('Error sending denial email:', error);
    return false;
  }
}

export default router;