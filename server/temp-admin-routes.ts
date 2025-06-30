import { Router } from 'express';
import { tempProperties, tempStats, tempUser } from './temp-admin-data';

const router = Router();

// Type for agent status
type AgentStatus = 'pending' | 'approved' | 'rejected';

// Temporary agent storage for admin testing
let tempAgents = [
  {
    id: 1,
    firstName: 'Test',
    lastName: 'Agent',
    email: 'test.registration@example.com',
    phone: '+1-555-0123',
    company: 'Real Estate Pros',
    licenseNumber: 'RE12345',
    city: 'Miami',
    country: 'United States',
    website: 'https://realestateproz.com',
    linkedIn: 'https://linkedin.com/in/testagent',
    bio: 'Experienced real estate agent specializing in luxury properties.',
    yearsExperience: 5,
    languagesSpoken: ['English', 'Spanish'],
    seoBacklinkUrl: 'https://realestateproz.com/partners',
    status: 'pending' as AgentStatus,
    submittedAt: new Date('2025-06-30T22:48:24.000Z'),
    approvedAt: null as Date | null,
    rejectedAt: null as Date | null,
    rejectionReason: null as string | null,
    referralLink: null as string | null
  }
];

// Temporary auth bypass for testing
router.use((req, res, next) => {
  // Mock authenticated user for admin testing
  (req as any).user = tempUser;
  next();
});

// Get all properties
router.get('/properties', (req, res) => {
  res.json(tempProperties);
});

// Update property
router.put('/properties/:propertyId', (req, res) => {
  const { propertyId } = req.params;
  const { updates } = req.body;
  
  const propertyIndex = tempProperties.findIndex(p => p.id === propertyId);
  if (propertyIndex === -1) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  // Update the property
  tempProperties[propertyIndex] = { ...tempProperties[propertyIndex], ...updates };
  
  res.json({ message: 'Property updated successfully', property: tempProperties[propertyIndex] });
});

// Get platform stats
router.get('/stats', (req, res) => {
  res.json(tempStats);
});

// Update global HKT price
router.put('/hkt-price', (req, res) => {
  const { price } = req.body;
  
  // Update all properties with new HKT price
  tempProperties.forEach(property => {
    property.hktPriceOverride = price;
  });
  
  res.json({ message: 'HKT price updated successfully', newPrice: price });
});

// Agent management endpoints
router.get('/agents/pending', (req, res) => {
  const pendingAgents = tempAgents.filter(agent => agent.status === 'pending');
  res.json(pendingAgents);
});

router.get('/agents/all', (req, res) => {
  res.json(tempAgents);
});

// Approve agent
router.post('/agents/:agentId/approve', async (req, res) => {
  const { agentId } = req.params;
  const agent = tempAgents.find(a => a.id === parseInt(agentId));
  
  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' });
  }
  
  if (agent.status !== 'pending') {
    return res.status(400).json({ message: 'Agent has already been processed' });
  }
  
  // Generate referral link
  const referralCode = `${agent.firstName.toLowerCase()}${agent.lastName.toLowerCase()}${agent.id}`;
  const referralLink = `https://homekrypto.com/properties?ref=${referralCode}`;
  
  // Update agent status
  agent.status = 'approved';
  agent.approvedAt = new Date();
  agent.referralLink = referralLink;
  
  try {
    // Send approval email
    const { sendHostingerEmail } = await import('./hostinger-email');
    await sendHostingerEmail({
      to: agent.email,
      subject: '🎉 Your HomeKrypto Agent Profile Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981; text-align: center;">Congratulations! You're Now a HomeKrypto Partner</h1>
          
          <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
            <h2 style="color: #047857; margin-top: 0;">Welcome to the Team!</h2>
            <p style="color: #065f46; line-height: 1.6;">
              Dear ${agent.firstName} ${agent.lastName},<br><br>
              
              Great news! Your agent registration application has been approved. You're now an official HomeKrypto partner agent!
            </p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Next Steps:</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li>Once approved, you'll receive commissions for every referral</li>
              <li>Your profile will go live on our platform</li>
              <li>You'll get access to our agent dashboard</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280;">Questions? Contact us at <a href="mailto:admin@homekrypto.com" style="color: #10b981;">admin@homekrypto.com</a></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px;">
              Best regards,<br>
              <strong>The HomeKrypto Team</strong>
            </p>
          </div>
        </div>
      `
    });
    
    res.json({ message: 'Agent approved successfully' });
  } catch (error) {
    console.error('Error sending approval email:', error);
    res.json({ message: 'Agent approved but email notification failed' });
  }
});

// Reject agent
router.post('/agents/:agentId/reject', async (req, res) => {
  const { agentId } = req.params;
  const { reason } = req.body;
  const agent = tempAgents.find(a => a.id === parseInt(agentId));
  
  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' });
  }
  
  if (agent.status !== 'pending') {
    return res.status(400).json({ message: 'Agent has already been processed' });
  }
  
  // Update agent status
  agent.status = 'rejected';
  agent.rejectedAt = new Date();
  agent.rejectionReason = reason || 'Application did not meet our criteria';
  
  try {
    // Send rejection email
    const { sendHostingerEmail } = await import('./hostinger-email');
    await sendHostingerEmail({
      to: agent.email,
      subject: 'HomeKrypto Agent Application Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626; text-align: center;">Agent Application Status Update</h1>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
            <h2 style="color: #991b1b; margin-top: 0;">Application Not Approved</h2>
            <p style="color: #7f1d1d; line-height: 1.6;">
              Dear ${agent.firstName} ${agent.lastName},<br><br>
              
              Thank you for your interest in becoming a HomeKrypto partner agent. After careful review, we regret to inform you that your application was not approved at this time.
            </p>
            ${reason ? `
              <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <strong style="color: #991b1b;">Reason:</strong>
                <p style="color: #7f1d1d; margin: 5px 0 0 0;">${reason}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">What's Next?</h3>
            <p style="color: #4b5563; line-height: 1.6;">
              You may reapply in the future if your qualifications change. We encourage you to continue building your real estate expertise and portfolio.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280;">Questions? Contact us at <a href="mailto:admin@homekrypto.com" style="color: #dc2626;">admin@homekrypto.com</a></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px;">
              Best regards,<br>
              <strong>The HomeKrypto Team</strong>
            </p>
          </div>
        </div>
      `
    });
    
    res.json({ message: 'Agent rejected and notified' });
  } catch (error) {
    console.error('Error sending rejection email:', error);
    res.json({ message: 'Agent rejected but email notification failed' });
  }
});

router.post('/agents/:agentId/approve', async (req, res) => {
  const { agentId } = req.params;
  const agent = tempAgents.find(a => a.id === parseInt(agentId));
  
  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' });
  }
  
  if (agent.status !== 'pending') {
    return res.status(400).json({ message: 'Agent has already been processed' });
  }
  
  // Generate referral link
  const referralCode = `${agent.firstName.toLowerCase()}${agent.lastName.toLowerCase()}${agent.id}`;
  const referralLink = `https://homekrypto.com/properties?ref=${referralCode}`;
  
  // Update agent status
  agent.status = 'approved';
  agent.approvedAt = new Date();
  agent.referralLink = referralLink;
  
  try {
    // Send approval email
    const { sendHostingerEmail } = await import('./hostinger-email');
    await sendHostingerEmail({
      to: agent.email,
      subject: '🎉 Your HomeKrypto Agent Profile Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981; text-align: center;">Congratulations! You're Now a HomeKrypto Partner</h1>
          
          <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
            <h2 style="color: #047857; margin-top: 0;">Welcome to the Team!</h2>
            <p style="color: #065f46;">Your agent profile has been approved and is now live on our platform.</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Your Referral Information</h3>
            <p><strong>Referral Link:</strong></p>
            <div style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 4px; padding: 15px; font-family: monospace; font-size: 14px; color: #1f2937; overflow-x: auto;">
              ${referralLink}
            </div>
            <p style="margin-top: 15px; color: #6b7280; font-size: 14px;">
              Share this link with potential investors. You'll earn commission on all investments made through this link.
            </p>
          </div>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Next Steps</h3>
            <ul style="color: #1e3a8a; line-height: 1.6;">
              <li>Your profile is now visible on our Agents page</li>
              <li>Start promoting your referral link to potential investors</li>
              <li>Access the agent dashboard for tracking and resources</li>
              <li>Reach out to us for marketing materials and support</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">Best regards,<br>The HomeKrypto Team</p>
        </div>
      `,
      text: `
        Congratulations! Your HomeKrypto Agent Profile Has Been Approved!
        
        Your agent profile has been approved and is now live on our platform.
        
        Your Referral Link: ${referralLink}
        
        Share this link with potential investors. You'll earn commission on all investments made through this link.
        
        Next Steps:
        • Your profile is now visible on our Agents page
        • Start promoting your referral link to potential investors
        • Access the agent dashboard for tracking and resources
        • Reach out to us for marketing materials and support
        
        Best regards,
        The HomeKrypto Team
      `
    });
    
    console.log(`Agent approval email sent to ${agent.email}`);
  } catch (emailError) {
    console.error('Failed to send agent approval email:', emailError);
  }
  
  res.json({ 
    message: 'Agent approved successfully', 
    agent: agent,
    referralLink: referralLink
  });
});

router.post('/agents/:agentId/reject', async (req, res) => {
  const { agentId } = req.params;
  const { reason } = req.body;
  const agent = tempAgents.find(a => a.id === parseInt(agentId));
  
  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' });
  }
  
  if (agent.status !== 'pending') {
    return res.status(400).json({ message: 'Agent has already been processed' });
  }
  
  // Update agent status
  agent.status = 'rejected';
  agent.rejectedAt = new Date();
  agent.rejectionReason = reason;
  
  try {
    // Send rejection email
    const { sendHostingerEmail } = await import('./hostinger-email');
    await sendHostingerEmail({
      to: agent.email,
      subject: 'HomeKrypto Agent Application Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937; text-align: center;">Agent Application Update</h1>
          
          <p>Dear ${agent.firstName},</p>
          
          <p>Thank you for your interest in becoming a HomeKrypto partner agent. After reviewing your application, we have decided not to move forward at this time.</p>
          
          ${reason ? `
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">Feedback</h3>
            <p style="color: #92400e;">${reason}</p>
          </div>
          ` : ''}
          
          <p>We encourage you to apply again in the future as our requirements may change.</p>
          
          <p>Best regards,<br>The HomeKrypto Team</p>
        </div>
      `,
      text: `
        Agent Application Update
        
        Dear ${agent.firstName},
        
        Thank you for your interest in becoming a HomeKrypto partner agent. After reviewing your application, we have decided not to move forward at this time.
        
        ${reason ? `Feedback: ${reason}` : ''}
        
        We encourage you to apply again in the future as our requirements may change.
        
        Best regards,
        The HomeKrypto Team
      `
    });
    
    console.log(`Agent rejection email sent to ${agent.email}`);
  } catch (emailError) {
    console.error('Failed to send agent rejection email:', emailError);
  }
  
  res.json({ 
    message: 'Agent rejected', 
    agent: agent
  });
});

export default router;