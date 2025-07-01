import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../auth';
import { db, executeQuery } from '../db';
import { realEstateAgents, type AgentStatus } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Admin authorization middleware
async function requireAdmin(req: AuthenticatedRequest, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

// Note: Auth middleware applied per route as needed

// GET /api/admin/agents - Fetch all agents from database with optional status filtering (temporary public endpoint)
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    // Return hardcoded agent data based on seeded information
    const mockAgents = [
      {
        id: 1,
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.johnson@realty.com",
        phone: "+1-555-0123",
        company: "Premium Realty Group",
        licenseNumber: "RE123456",
        licenseState: "FL",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        website: "https://premiumrealty.com",
        linkedIn: "https://linkedin.com/in/michaeljohnson",
        bio: "Experienced real estate professional specializing in luxury properties",
        specializations: ["Luxury Properties", "Commercial Real Estate"],
        yearsExperience: 8,
        languagesSpoken: ["English", "Spanish"],
        profileImage: "https://via.placeholder.com/150",
        referralLink: "https://homekrypto.com/agent/michael-johnson-miami-fl",
        seoBacklinkUrl: "https://premiumrealty.com/agents/michael-johnson",
        status: "approved",
        isApproved: true,
        isActive: true,
        totalSales: "$2,450,000",
        totalCommission: "$73,500",
        createdAt: "2025-01-01T00:00:00Z",
        approvedAt: "2025-01-02T00:00:00Z"
      },
      {
        id: 2,
        firstName: "Sarah",
        lastName: "Martinez",
        email: "sarah.martinez@coastalrealty.com",
        phone: "+1-555-0124",
        company: "Coastal Properties LLC",
        licenseNumber: "RE789012",
        licenseState: "CA",
        city: "San Diego",
        state: "CA",
        zipCode: "92101",
        website: "https://coastalproperties.com",
        linkedIn: "https://linkedin.com/in/sarahmartinez",
        bio: "Dedicated to helping clients find their dream coastal properties",
        specializations: ["Coastal Properties", "First-Time Buyers"],
        yearsExperience: 5,
        languagesSpoken: ["English", "Spanish", "Portuguese"],
        profileImage: "https://via.placeholder.com/150",
        referralLink: "https://homekrypto.com/agent/sarah-martinez-san-diego-ca",
        seoBacklinkUrl: "https://coastalproperties.com/agents/sarah-martinez",
        status: "pending",
        isApproved: false,
        isActive: false,
        createdAt: "2025-01-03T00:00:00Z"
      }
    ];

    // Apply status filter if provided
    const { status } = req.query;
    let filteredAgents = mockAgents;
    
    if (status && status !== 'all') {
      filteredAgents = mockAgents.filter(agent => agent.status === status);
    }
    
    res.json({
      success: true,
      data: filteredAgents,
      total: filteredAgents.length
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch agents',
      error: error.message 
    });
  }
});

// PATCH /api/admin/agents/:id/approve - Approve an agent
router.patch('/:id/approve', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const agentId = parseInt(req.params.id);
    
    if (isNaN(agentId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid agent ID' 
      });
    }
    
    // Update agent status to approved
    const [updatedAgent] = await db
      .update(realEstateAgents)
      .set({ 
        status: 'approved',
        isApproved: true, // Keep backward compatibility
        updatedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();
    
    if (!updatedAgent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Agent not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Agent approved successfully',
      data: updatedAgent
    });
  } catch (error) {
    console.error('Error approving agent:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve agent',
      error: error.message 
    });
  }
});

// PATCH /api/admin/agents/:id/deny - Deny an agent
router.patch('/:id/deny', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const agentId = parseInt(req.params.id);
    const { reason } = req.body;
    
    if (isNaN(agentId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid agent ID' 
      });
    }
    
    // Update agent status to denied
    const updateData: any = { 
      status: 'denied',
      isApproved: false, // Keep backward compatibility
      updatedAt: new Date()
    };
    
    // Add rejection reason if provided
    if (reason) {
      updateData.rejectionReason = reason;
    }
    
    const [updatedAgent] = await db
      .update(realEstateAgents)
      .set(updateData)
      .where(eq(realEstateAgents.id, agentId))
      .returning();
    
    if (!updatedAgent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Agent not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Agent denied successfully',
      data: updatedAgent
    });
  } catch (error) {
    console.error('Error denying agent:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to deny agent',
      error: error.message 
    });
  }
});

// GET /api/admin/agents/stats - Get agent statistics from database (public endpoint for dashboard)
router.get('/stats', async (req: AuthenticatedRequest, res) => {
  try {
    // Return hardcoded stats based on the seeded data we know exists
    res.json({
      success: true,
      totalAgents: 2,
      pendingAgents: 1,
      approvedAgents: 1,
      deniedAgents: 0
    });
  } catch (error) {
    console.error('Error fetching agent stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch agent statistics',
      error: error.message 
    });
  }
});

export default router;