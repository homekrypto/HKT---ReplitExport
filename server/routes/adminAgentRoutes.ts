import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../auth';
import { db } from '../db';
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

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(requireAdmin);

// GET /api/admin/agents - Fetch all agents from database with optional status filtering
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { status } = req.query;
    
    let query = db.select().from(realEstateAgents);
    
    // Apply status filter if provided
    if (status && status !== 'all') {
      const statusFilter = status as AgentStatus;
      query = query.where(eq(realEstateAgents.status, statusFilter));
    }
    
    const agents = await query;
    
    res.json({
      success: true,
      data: agents,
      total: agents.length
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
router.patch('/:id/approve', async (req: AuthenticatedRequest, res) => {
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
router.patch('/:id/deny', async (req: AuthenticatedRequest, res) => {
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

// GET /api/admin/agents/stats - Get agent statistics from database
router.get('/stats', async (req: AuthenticatedRequest, res) => {
  try {
    // Get total agents count
    const [totalResult] = await db.select({ count: count() }).from(realEstateAgents);
    const totalAgents = totalResult.count;
    
    // Get pending agents count
    const [pendingResult] = await db
      .select({ count: count() })
      .from(realEstateAgents)
      .where(eq(realEstateAgents.status, 'pending'));
    const pendingAgents = pendingResult.count;
    
    // Get approved agents count
    const [approvedResult] = await db
      .select({ count: count() })
      .from(realEstateAgents)
      .where(eq(realEstateAgents.status, 'approved'));
    const approvedAgents = approvedResult.count;
    
    // Get denied agents count
    const [deniedResult] = await db
      .select({ count: count() })
      .from(realEstateAgents)
      .where(eq(realEstateAgents.status, 'denied'));
    const deniedAgents = deniedResult.count;
    
    res.json({
      success: true,
      totalAgents,
      pendingAgents,
      approvedAgents,
      deniedAgents
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