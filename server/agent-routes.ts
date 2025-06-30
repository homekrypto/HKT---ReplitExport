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
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'licenseNumber', 'licenseState', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!agentData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Check if agent already exists
    const existingAgent = await db.select()
      .from(realEstateAgents)
      .where(eq(realEstateAgents.email, agentData.email))
      .limit(1);

    if (existingAgent.length > 0) {
      return res.status(400).json({ error: 'Agent with this email already exists' });
    }

    // Generate unique referral link
    const referralLink = generateReferralLink(agentData.firstName, agentData.lastName, agentData.city);
    
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

    // Send confirmation email to agent
    await sendHostingerEmail({
      to: agentData.email,
      subject: 'Agent Registration Received - HomeKrypto',
      html: `
        <h2>Thank You for Your Interest in HomeKrypto</h2>
        <p>Dear ${agentData.firstName},</p>
        <p>We have received your registration as a real estate agent partner. Your application is currently under review.</p>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Our team will review your credentials and license information</li>
          <li>You will receive an approval notification within 1-2 business days</li>
          <li>Once approved, you'll receive your custom referral link and agent dashboard access</li>
        </ul>
        <p>Your referral link will be: <strong>${referralLink}</strong></p>
        <p>Thank you for joining our network of professional real estate agents!</p>
        <p>Best regards,<br>HomeKrypto Team</p>
      `
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