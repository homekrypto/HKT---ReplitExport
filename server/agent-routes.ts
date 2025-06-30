import { Router } from 'express';
import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './db-wrapper';
import { realEstateAgents, agentProperties, properties, users } from '@shared/schema';
import { requireAuth, type AuthenticatedRequest } from './auth';
import { sendHostingerEmail } from './hostinger-email';

const router = Router();

// Generate unique referral link
function generateReferralLink(firstName: string, lastName: string, city: string): string {
  const base = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${city.toLowerCase().replace(/\s+/g, '-')}`;
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `homekrypto.com/agent/${base}-${randomSuffix}`;
}

// Helper function to check if user is admin
async function isAdmin(email: string): boolean {
  return email === 'admin@homekrypto.com';
}

// Agent registration (public endpoint)
router.post('/register', async (req, res) => {
  try {
    const agentData = req.body;
    
    // Only validate email is required - everything else is optional
    if (!agentData.email || !agentData.email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(agentData.email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Check if agent already exists
    const existingAgent = await db.select()
      .from(realEstateAgents)
      .where(eq(realEstateAgents.email, agentData.email))
      .limit(1);

    if (existingAgent.length > 0) {
      return res.status(400).json({ error: 'Agent with this email already exists' });
    }

    // Generate unique referral link (use default values if fields are empty)
    const firstName = agentData.firstName || 'agent';
    const lastName = agentData.lastName || 'partner';
    const city = agentData.city || 'location';
    const referralLink = generateReferralLink(firstName, lastName, city);
    
    // Create agent record
    const [newAgent] = await db.insert(realEstateAgents).values({
      ...agentData,
      referralLink,
      isApproved: false,
      isActive: true
    }).returning();

    // Send notification email to admin
    await sendHostingerEmail({
      to: 'admin@homekrypto.com',
      subject: 'New Real Estate Agent Registration',
      html: `
        <h2>New Agent Registration Pending Approval</h2>
        <p><strong>Name:</strong> ${agentData.firstName} ${agentData.lastName}</p>
        <p><strong>Email:</strong> ${agentData.email}</p>
        <p><strong>Phone:</strong> ${agentData.phone}</p>
        <p><strong>License:</strong> ${agentData.licenseNumber} (${agentData.licenseState})</p>
        <p><strong>Location:</strong> ${agentData.city}, ${agentData.state} ${agentData.zipCode}</p>
        <p><strong>Company:</strong> ${agentData.company || 'Not provided'}</p>
        <p><strong>Website:</strong> ${agentData.website || 'Not provided'}</p>
        <p>Please review and approve this agent registration in the admin dashboard.</p>
      `
    });

    // Send confirmation email to agent with SEO backlink instructions
    const agentName = agentData.firstName || 'Agent';
    await sendHostingerEmail({
      to: agentData.email,
      subject: 'Welcome to HomeKrypto – Your Agent Profile Is Being Reviewed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; font-size: 28px; margin: 0;">HomeKrypto</h1>
            <p style="color: #6b7280; font-size: 16px;">Real Estate Investment Platform</p>
          </div>

          <h2 style="color: #1f2937; font-size: 24px;">Welcome to HomeKrypto!</h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Dear ${agentName},
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for registering as a real estate partner with HomeKrypto. Your profile has been submitted and is now under manual review by our team. You'll receive another email once your profile is approved and visible on the platform.
          </p>

          <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #f59e0b; font-size: 20px; margin: 0 0 15px 0;">🚀 Boost Your Approval Chances</h3>
            <p style="color: #92400e; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
              In the meantime, we <strong>strongly recommend</strong> adding a backlink from your website to ours. This boosts your visibility and helps us approve your profile faster.
            </p>
            
            <p style="color: #92400e; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
              Please copy and paste the following HTML code into your website:
            </p>
            
            <div style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 4px; padding: 15px; font-family: monospace; font-size: 14px; color: #1f2937; overflow-x: auto;">
              &lt;a href="https://homekrypto.com" target="_blank" rel="dofollow"&gt;Proud Partner of HomeKrypto&lt;/a&gt;
            </div>
            
            <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin-top: 15px;">
              <strong>Where to place it:</strong> Add this link to your website footer, About page, Partners section, or anywhere visible to visitors. This helps with faster approval, more traffic, and better search engine rankings.
            </p>
          </div>

          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">What happens next:</h3>
            <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Our team will verify your information and credentials</li>
              <li>You'll receive an approval notification via email</li>
              <li>Once approved, you'll get your custom referral link</li>
              <li>Your profile will go live on our platform</li>
              <li>You'll gain access to high-value crypto-savvy clients</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Questions? Contact us at <a href="mailto:admin@homekrypto.com" style="color: #f59e0b;">admin@homekrypto.com</a>
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              <strong>The HomeKrypto Team</strong>
            </p>
          </div>
        </div>`
    });

    res.json({ 
      success: true, 
      message: 'Registration submitted successfully. You will receive approval notification within 1-2 business days.',
      agentId: newAgent.id,
      referralLink
    });

  } catch (error) {
    console.error('Agent registration error:', error);
    res.status(500).json({ error: 'Failed to register agent' });
  }
});

// Get all agents (admin only)
router.get('/all', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!await isAdmin(req.user?.email || '')) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const agents = await db.select({
      id: realEstateAgents.id,
      firstName: realEstateAgents.firstName,
      lastName: realEstateAgents.lastName,
      email: realEstateAgents.email,
      phone: realEstateAgents.phone,
      company: realEstateAgents.company,
      licenseNumber: realEstateAgents.licenseNumber,
      licenseState: realEstateAgents.licenseState,
      city: realEstateAgents.city,
      state: realEstateAgents.state,
      zipCode: realEstateAgents.zipCode,
      website: realEstateAgents.website,
      isApproved: realEstateAgents.isApproved,
      isActive: realEstateAgents.isActive,
      referralLink: realEstateAgents.referralLink,
      totalSales: realEstateAgents.totalSales,
      totalCommission: realEstateAgents.totalCommission,
      createdAt: realEstateAgents.createdAt,
      approvedAt: realEstateAgents.approvedAt
    })
    .from(realEstateAgents)
    .orderBy(desc(realEstateAgents.createdAt));

    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get approved agents (public)
router.get('/approved', async (req, res) => {
  try {
    const agents = await db.select({
      id: realEstateAgents.id,
      firstName: realEstateAgents.firstName,
      lastName: realEstateAgents.lastName,
      email: realEstateAgents.email,
      company: realEstateAgents.company,
      city: realEstateAgents.city,
      state: realEstateAgents.state,
      bio: realEstateAgents.bio,
      specializations: realEstateAgents.specializations,
      yearsExperience: realEstateAgents.yearsExperience,
      languagesSpoken: realEstateAgents.languagesSpoken,
      profileImage: realEstateAgents.profileImage,
      website: realEstateAgents.website,
      linkedIn: realEstateAgents.linkedIn,
      referralLink: realEstateAgents.referralLink
    })
    .from(realEstateAgents)
    .where(and(
      eq(realEstateAgents.isApproved, true),
      eq(realEstateAgents.isActive, true)
    ))
    .orderBy(realEstateAgents.firstName);

    res.json(agents);
  } catch (error) {
    console.error('Error fetching approved agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Approve agent (admin only)
router.post('/approve/:agentId', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!await isAdmin(req.user?.email || '')) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const agentId = parseInt(req.params.agentId);
    
    const [updatedAgent] = await db.update(realEstateAgents)
      .set({
        isApproved: true,
        approvedBy: req.user?.id,
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();

    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Send approval email to agent
    await sendHostingerEmail({
      to: updatedAgent.email,
      subject: 'Congratulations! Your HomeKrypto Agent Application Approved',
      html: `
        <h2>Welcome to the HomeKrypto Agent Network!</h2>
        <p>Dear ${updatedAgent.firstName},</p>
        <p>Congratulations! Your application to become a HomeKrypto partner agent has been approved.</p>
        
        <h3>Your Agent Details:</h3>
        <p><strong>Referral Link:</strong> ${updatedAgent.referralLink}</p>
        <p><strong>Commission Rate:</strong> ${updatedAgent.commission}%</p>
        
        <h3>What's Next:</h3>
        <ul>
          <li>Start promoting HomeKrypto properties using your referral link</li>
          <li>Earn commissions on successful property investments</li>
          <li>Access your agent dashboard for performance tracking</li>
          <li>Receive SEO benefits from your profile on our platform</li>
        </ul>
        
        <p>Your profile is now live on our platform and potential clients can find you through property listings.</p>
        
        <p>Welcome aboard!</p>
        <p>Best regards,<br>HomeKrypto Team</p>
      `
    });

    res.json({ success: true, agent: updatedAgent });
  } catch (error) {
    console.error('Error approving agent:', error);
    res.status(500).json({ error: 'Failed to approve agent' });
  }
});

// Reject agent (admin only)
router.post('/reject/:agentId', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!await isAdmin(req.user?.email || '')) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const agentId = parseInt(req.params.agentId);
    const { rejectionReason } = req.body;
    
    const [updatedAgent] = await db.update(realEstateAgents)
      .set({
        isApproved: false,
        isActive: false,
        rejectionReason,
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();

    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Send rejection email to agent
    await sendHostingerEmail({
      to: updatedAgent.email,
      subject: 'HomeKrypto Agent Application Update',
      html: `
        <h2>Thank You for Your Interest in HomeKrypto</h2>
        <p>Dear ${updatedAgent.firstName},</p>
        <p>Thank you for your interest in becoming a HomeKrypto partner agent.</p>
        <p>After careful review, we are unable to approve your application at this time.</p>
        ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
        <p>You are welcome to reapply in the future once any concerns have been addressed.</p>
        <p>Thank you for your understanding.</p>
        <p>Best regards,<br>HomeKrypto Team</p>
      `
    });

    res.json({ success: true, agent: updatedAgent });
  } catch (error) {
    console.error('Error rejecting agent:', error);
    res.status(500).json({ error: 'Failed to reject agent' });
  }
});

// Assign agent to property (admin only)
router.post('/assign-property', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!await isAdmin(req.user?.email || '')) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { agentId, propertyId, isPrimaryAgent, commissionRate } = req.body;

    // Check if assignment already exists
    const existing = await db.select()
      .from(agentProperties)
      .where(and(
        eq(agentProperties.agentId, agentId),
        eq(agentProperties.propertyId, propertyId)
      ))
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Agent already assigned to this property' });
    }

    const [assignment] = await db.insert(agentProperties).values({
      agentId,
      propertyId,
      isPrimaryAgent: isPrimaryAgent || false,
      commissionRate: commissionRate || null,
      assignedBy: req.user?.id
    }).returning();

    res.json({ success: true, assignment });
  } catch (error) {
    console.error('Error assigning agent to property:', error);
    res.status(500).json({ error: 'Failed to assign agent' });
  }
});

// Get agents for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    const agents = await db.select({
      id: realEstateAgents.id,
      firstName: realEstateAgents.firstName,
      lastName: realEstateAgents.lastName,
      email: realEstateAgents.email,
      phone: realEstateAgents.phone,
      company: realEstateAgents.company,
      city: realEstateAgents.city,
      state: realEstateAgents.state,
      website: realEstateAgents.website,
      linkedIn: realEstateAgents.linkedIn,
      profileImage: realEstateAgents.profileImage,
      bio: realEstateAgents.bio,
      specializations: realEstateAgents.specializations,
      yearsExperience: realEstateAgents.yearsExperience,
      languagesSpoken: realEstateAgents.languagesSpoken,
      isPrimaryAgent: agentProperties.isPrimaryAgent,
      commissionRate: agentProperties.commissionRate
    })
    .from(realEstateAgents)
    .innerJoin(agentProperties, eq(realEstateAgents.id, agentProperties.agentId))
    .where(and(
      eq(agentProperties.propertyId, propertyId),
      eq(realEstateAgents.isApproved, true),
      eq(realEstateAgents.isActive, true)
    ))
    .orderBy(agentProperties.isPrimaryAgent, realEstateAgents.firstName);

    res.json(agents);
  } catch (error) {
    console.error('Error fetching property agents:', error);
    res.status(500).json({ error: 'Failed to fetch property agents' });
  }
});

// Update agent profile (admin only)
router.put('/:agentId', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!await isAdmin(req.user?.email || '')) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const agentId = parseInt(req.params.agentId);
    const updateData = req.body;

    const [updatedAgent] = await db.update(realEstateAgents)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();

    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({ success: true, agent: updatedAgent });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

export default router;