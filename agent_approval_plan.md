# Agent Approval System Implementation Plan

## Phase 1 - Codebase Analysis Results

### Backend Technology
- **Framework**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Custom JWT-based authentication with session management

### Frontend Technology  
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Library**: shadcn/ui with Tailwind CSS

### Database and Model
- **Database**: PostgreSQL with Drizzle ORM
- **Schema File**: `shared/schema.ts`
- **Agent Model**: `realEstateAgents` table with comprehensive fields
- **Current Fields**: firstName, lastName, email, phone, company, licenseNumber, licenseState, city, state, zipCode, country, website, linkedIn, bio, specializations, yearsExperience, languagesSpoken, profileImage, referralLink, seoBacklinkUrl, isApproved (boolean), isActive (boolean), approvedBy, approvedAt, rejectionReason

### Authentication
- **Admin Protection**: Custom middleware checks `isAdmin: true` field in user object
- **Auth File**: `server/simple-auth.ts` contains authentication logic
- **Admin User**: admin@homekrypto.com with isAdmin flag

### Email Service
- **Service**: Nodemailer with Hostinger SMTP configuration
- **Email File**: `server/hostinger-email.ts`
- **Function**: `sendHostingerEmail()` for sending emails
- **Domain**: support@homekrypto.com

## Phase 2 - Implementation Plan

### 1. Database Modification

**File to Modify**: `shared/schema.ts`

**Action**: The current schema already has `isApproved` boolean field, but we need to update it to use a proper status enum system for better state management.

**Code to Add/Update**:
```typescript
// Update the realEstateAgents table status field
export const realEstateAgents = pgTable("real_estate_agents", {
  // ... existing fields ...
  status: varchar("status", { length: 20 }).notNull().default('pending'), // Add this line
  isApproved: boolean("is_approved").default(false), // Keep for backward compatibility
  // ... rest of existing fields ...
});

// Add new type for agent status
export type AgentStatus = 'pending' | 'approved' | 'denied';
```

**Registration Logic**: The agent registration endpoint is already implemented in `server/index.ts` at line ~180. New agents are automatically saved with `isApproved: false`, which corresponds to 'pending' status.

### 2. Backend API Endpoints

**File to Create**: `server/agent-admin-routes.ts`

**Action**: Create comprehensive admin-only API endpoints for agent management.

**Full Code**:
```typescript
import { Router } from 'express';
import { db } from './db';
import { realEstateAgents } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { sendHostingerEmail } from './hostinger-email';

const router = Router();

// Middleware to check admin permissions
async function requireAdmin(req: any, res: any, next: any) {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// GET /api/admin/pending-agents - Get all pending agents
router.get('/pending-agents', requireAdmin, async (req, res) => {
  try {
    const pendingAgents = await db
      .select()
      .from(realEstateAgents)
      .where(eq(realEstateAgents.isApproved, false));
    
    res.json(pendingAgents);
  } catch (error) {
    console.error('Error fetching pending agents:', error);
    res.status(500).json({ message: 'Failed to fetch pending agents' });
  }
});

// PATCH /api/admin/agents/:id/approve - Approve an agent
router.patch('/agents/:id/approve', requireAdmin, async (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    const { welcomeMessage } = req.body;

    // Get agent details first
    const [agent] = await db
      .select()
      .from(realEstateAgents)
      .where(eq(realEstateAgents.id, agentId));

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Update agent status
    const [updatedAgent] = await db
      .update(realEstateAgents)
      .set({
        isApproved: true,
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();

    // Send approval email
    const approvalEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">🎉 Welcome to HomeKrypto!</h1>
        <h2 style="color: #1e40af;">Your Agent Application Has Been Approved</h2>
        
        <p>Dear ${agent.firstName},</p>
        
        <p>Congratulations! Your application to become a HomeKrypto partner agent has been approved. You're now part of our exclusive network of real estate professionals.</p>
        
        ${welcomeMessage ? `
        <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <p><strong>Personal message from our team:</strong></p>
          <p>${welcomeMessage}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">What's Next:</h3>
          <ul style="line-height: 1.8;">
            <li>Your profile is now live at: <a href="https://homekrypto.com/agents/${agent.referralLink}" style="color: #2563eb;">homekrypto.com/agents/${agent.referralLink}</a></li>
            <li>Access your agent dashboard: <a href="https://homekrypto.com/dashboard" style="color: #2563eb;">Agent Dashboard</a></li>
            <li>Start referring clients and earning commissions</li>
            <li>Join our agent community and training sessions</li>
          </ul>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">Your Referral Link:</h3>
          <p style="font-family: monospace; background-color: #d1fae5; padding: 10px; border-radius: 4px;">
            ${agent.referralLink || `https://homekrypto.com/ref/${agent.id}`}
          </p>
          <p>Share this link to track your referrals and earn commissions!</p>
        </div>
        
        <p>Welcome to the future of real estate investment!</p>
        
        <p>Best regards,<br>
        The HomeKrypto Team<br>
        <a href="mailto:support@homekrypto.com">support@homekrypto.com</a></p>
      </div>
    `;

    const approvalEmailText = `
      Welcome to HomeKrypto!
      
      Your Agent Application Has Been Approved
      
      Dear ${agent.firstName},
      
      Congratulations! Your application to become a HomeKrypto partner agent has been approved.
      
      ${welcomeMessage ? `Personal message: ${welcomeMessage}` : ''}
      
      What's Next:
      • Your profile is now live at: homekrypto.com/agents/${agent.referralLink}
      • Access your agent dashboard at: homekrypto.com/dashboard
      • Start referring clients and earning commissions
      
      Your Referral Link: ${agent.referralLink || `https://homekrypto.com/ref/${agent.id}`}
      
      Best regards,
      The HomeKrypto Team
      support@homekrypto.com
    `;

    await sendHostingerEmail({
      to: agent.email,
      subject: '🎉 Welcome to HomeKrypto - Agent Application Approved!',
      html: approvalEmailHtml,
      text: approvalEmailText
    });

    res.json({ 
      message: 'Agent approved successfully', 
      agent: updatedAgent 
    });

  } catch (error) {
    console.error('Error approving agent:', error);
    res.status(500).json({ message: 'Failed to approve agent' });
  }
});

// PATCH /api/admin/agents/:id/deny - Deny an agent
router.patch('/agents/:id/deny', requireAdmin, async (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    const { reason } = req.body;

    // Get agent details first
    const [agent] = await db
      .select()
      .from(realEstateAgents)
      .where(eq(realEstateAgents.id, agentId));

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Update agent status
    const [updatedAgent] = await db
      .update(realEstateAgents)
      .set({
        isApproved: false,
        status: 'denied',
        rejectionReason: reason || null,
        approvedBy: req.user.id,
        approvedAt: new Date()
      })
      .where(eq(realEstateAgents.id, agentId))
      .returning();

    // Send rejection email
    const rejectionEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #dc2626; text-align: center;">HomeKrypto Agent Application</h1>
        <h2 style="color: #991b1b;">Application Update</h2>
        
        <p>Dear ${agent.firstName},</p>
        
        <p>Thank you for your interest in becoming a HomeKrypto partner agent. After careful review of your application, we have decided not to move forward at this time.</p>
        
        ${reason ? `
        <div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <h3 style="color: #991b1b; margin-top: 0;">Feedback:</h3>
          <p>${reason}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">What's Next:</h3>
          <ul style="line-height: 1.6;">
            <li>You may reapply in the future as our requirements may change</li>
            <li>Consider enhancing your qualifications based on the feedback above</li>
            <li>Contact our support team for guidance: <a href="mailto:support@homekrypto.com">support@homekrypto.com</a></li>
          </ul>
        </div>
        
        <p>We encourage you to apply again in the future as our requirements and capacity may change.</p>
        
        <p>Best regards,<br>
        The HomeKrypto Team<br>
        <a href="mailto:support@homekrypto.com">support@homekrypto.com</a></p>
      </div>
    `;

    const rejectionEmailText = `
      HomeKrypto Agent Application Update
      
      Dear ${agent.firstName},
      
      Thank you for your interest in becoming a HomeKrypto partner agent. After careful review, we have decided not to move forward at this time.
      
      ${reason ? `Feedback: ${reason}` : ''}
      
      We encourage you to apply again in the future as our requirements may change.
      
      For questions, contact us at: support@homekrypto.com
      
      Best regards,
      The HomeKrypto Team
    `;

    await sendHostingerEmail({
      to: agent.email,
      subject: 'HomeKrypto Agent Application Update',
      html: rejectionEmailHtml,
      text: rejectionEmailText
    });

    res.json({ 
      message: 'Agent application denied', 
      agent: updatedAgent 
    });

  } catch (error) {
    console.error('Error denying agent:', error);
    res.status(500).json({ message: 'Failed to deny agent' });
  }
});

export default router;
```

### 3. Frontend Admin Dashboard UI

**File to Modify**: `client/src/pages/AdminPanel.tsx`

**Action**: Add agent management tab to the existing admin panel with comprehensive UI.

**Code to Add** (Add this new tab to the existing Tabs component around line 600):

```typescript
// Add this interface at the top with other interfaces
interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  licenseNumber: string;
  licenseState: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  linkedIn?: string;
  bio?: string;
  specializations?: string[];
  yearsExperience?: number;
  languagesSpoken?: string[];
  profileImage?: string;
  referralLink?: string;
  seoBacklinkUrl?: string;
  isApproved: boolean;
  status?: string;
  isActive: boolean;
  createdAt?: Date;
}

// Add these query and mutation hooks after other hooks in the component
const { data: pendingAgents = [], isLoading: agentsLoading } = useQuery({
  queryKey: ['/api/admin/pending-agents'],
});

const approveMutation = useMutation({
  mutationFn: async ({ id, welcomeMessage }: { id: number; welcomeMessage?: string }) => {
    const response = await fetch(`/api/admin/agents/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ welcomeMessage }),
    });
    if (!response.ok) throw new Error('Failed to approve agent');
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-agents'] });
    toast({ title: 'Success', description: 'Agent approved successfully' });
  },
  onError: () => {
    toast({ title: 'Error', description: 'Failed to approve agent', variant: 'destructive' });
  },
});

const denyMutation = useMutation({
  mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
    const response = await fetch(`/api/admin/agents/${id}/deny`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error('Failed to deny agent');
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-agents'] });
    toast({ title: 'Success', description: 'Agent application processed' });
  },
  onError: () => {
    toast({ title: 'Error', description: 'Failed to process agent application', variant: 'destructive' });
  },
});

// Add this new TabsTrigger to the TabsList
<TabsTrigger value="agents" className="flex items-center gap-2">
  <Users className="h-4 w-4" />
  Agent Management
</TabsTrigger>

// Add this new TabsContent after the existing ones
<TabsContent value="agents" className="space-y-6">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold">Agent Management</h2>
      <p className="text-muted-foreground">Review and manage agent applications</p>
    </div>
    <Badge variant="secondary">
      {pendingAgents.length} Pending Applications
    </Badge>
  </div>

  {agentsLoading ? (
    <div className="text-center py-8">Loading agent applications...</div>
  ) : pendingAgents.length === 0 ? (
    <Card>
      <CardContent className="py-8 text-center">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No Pending Applications</h3>
        <p className="text-muted-foreground">All agent applications have been processed.</p>
      </CardContent>
    </Card>
  ) : (
    <div className="space-y-4">
      {pendingAgents.map((agent: Agent) => (
        <Card key={agent.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {agent.firstName} {agent.lastName}
                  <Badge variant="outline">Pending Review</Badge>
                </CardTitle>
                <CardDescription>
                  {agent.email} • {agent.phone}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    const welcomeMessage = prompt('Optional welcome message:');
                    approveMutation.mutate({ id: agent.id, welcomeMessage: welcomeMessage || undefined });
                  }}
                  disabled={approveMutation.isPending}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    const reason = prompt('Optional rejection reason:');
                    denyMutation.mutate({ id: agent.id, reason: reason || undefined });
                  }}
                  disabled={denyMutation.isPending}
                >
                  Deny
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Company:</strong> {agent.company || 'N/A'}</p>
                <p><strong>License:</strong> {agent.licenseNumber} ({agent.licenseState})</p>
                <p><strong>Location:</strong> {agent.city}, {agent.state} {agent.zipCode}</p>
                <p><strong>Experience:</strong> {agent.yearsExperience || 0} years</p>
              </div>
              <div>
                <p><strong>Website:</strong> {agent.website ? (
                  <a href={agent.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Website
                  </a>
                ) : 'N/A'}</p>
                <p><strong>LinkedIn:</strong> {agent.linkedIn ? (
                  <a href={agent.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Profile
                  </a>
                ) : 'N/A'}</p>
                <p><strong>Languages:</strong> {agent.languagesSpoken?.join(', ') || 'English'}</p>
                <p><strong>Specializations:</strong> {agent.specializations?.join(', ') || 'N/A'}</p>
              </div>
            </div>
            {agent.bio && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <strong>Bio:</strong>
                <p className="mt-1 text-sm">{agent.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )}
</TabsContent>
```

### 4. Dynamic Agent Profile Page & SEO

**File to Create**: `client/src/pages/AgentProfile.tsx`

**Action**: Create dynamic agent profile pages with SEO optimization.

**Full Code**:
```typescript
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe, Linkedin, Calendar, Languages, Award } from 'lucide-react';

interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  licenseNumber: string;
  licenseState: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  linkedIn?: string;
  bio?: string;
  specializations?: string[];
  yearsExperience?: number;
  languagesSpoken?: string[];
  profileImage?: string;
  referralLink?: string;
  isApproved: boolean;
  isActive: boolean;
}

export default function AgentProfile() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: agent, isLoading, error } = useQuery({
    queryKey: ['/api/agents/profile', slug],
    queryFn: async () => {
      const response = await fetch(`/api/agents/profile/${slug}`);
      if (!response.ok) throw new Error('Agent not found');
      return response.json();
    },
  });

  // Dynamic SEO meta tags
  useEffect(() => {
    if (agent) {
      document.title = `${agent.firstName} ${agent.lastName} - Real Estate Agent | HomeKrypto`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Meet ${agent.firstName} ${agent.lastName}, licensed real estate agent${agent.company ? ` at ${agent.company}` : ''} in ${agent.city}, ${agent.state}. ${agent.yearsExperience || 0}+ years experience in real estate investment through HomeKrypto platform.`
        );
      }

      // Open Graph tags for social sharing
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${agent.firstName} ${agent.lastName} - HomeKrypto Agent`);
      }
    }
  }, [agent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading agent profile...</div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <h1 className="text-2xl font-bold">Agent Not Found</h1>
              <p className="text-muted-foreground mt-2">The agent profile you're looking for doesn't exist or is not available.</p>
              <Button className="mt-4" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!agent.isApproved || !agent.isActive) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <h1 className="text-2xl font-bold">Agent Profile Unavailable</h1>
              <p className="text-muted-foreground mt-2">This agent profile is currently not available.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header Section */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {agent.profileImage ? (
                    <img 
                      src={agent.profileImage} 
                      alt={`${agent.firstName} ${agent.lastName}`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {agent.firstName[0]}{agent.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <CardTitle className="text-3xl">
                      {agent.firstName} {agent.lastName}
                    </CardTitle>
                    <Badge variant="default">Verified Agent</Badge>
                  </div>
                  
                  {agent.company && (
                    <p className="text-xl text-muted-foreground mb-2">{agent.company}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {agent.city}, {agent.state}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      License #{agent.licenseNumber}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {agent.yearsExperience || 0}+ Years Experience
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Contact & Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href={`mailto:${agent.email}`} className="text-blue-600 hover:underline">
                      {agent.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href={`tel:${agent.phone}`} className="text-blue-600 hover:underline">
                      {agent.phone}
                    </a>
                  </div>
                </div>
                <div className="space-y-3">
                  {agent.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <a href={agent.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                  {agent.linkedIn && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-primary" />
                      <a href={agent.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio & Specializations */}
          {(agent.bio || agent.specializations?.length || agent.languagesSpoken?.length) && (
            <Card>
              <CardHeader>
                <CardTitle>About {agent.firstName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agent.bio && (
                  <div>
                    <p className="text-muted-foreground leading-relaxed">{agent.bio}</p>
                  </div>
                )}
                
                {agent.specializations?.length && (
                  <div>
                    <h4 className="font-semibold mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {agent.languagesSpoken?.length && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.languagesSpoken.map((lang, index) => (
                        <Badge key={index} variant="outline">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <Card>
            <CardContent className="py-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Ready to Invest in Real Estate?</h3>
              <p className="text-muted-foreground mb-4">
                Work with {agent.firstName} to explore HomeKrypto's fractional real estate investment opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild>
                  <a href={`mailto:${agent.email}?subject=HomeKrypto Investment Inquiry`}>
                    Contact {agent.firstName}
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/properties">
                    View Properties
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

**File to Modify**: `client/src/App.tsx`

**Action**: Add the dynamic agent profile route.

**Code to Add** (Add this route around line 89):
```typescript
<Route path="/agents/:slug" component={AgentProfile} />
```

**Additional Backend Route Needed**: Add to `server/routes.ts` or `server/agent-admin-routes.ts`:

```typescript
// GET /api/agents/profile/:slug - Get agent profile by referral link
router.get('/profile/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    
    const [agent] = await db
      .select()
      .from(realEstateAgents)
      .where(
        and(
          eq(realEstateAgents.referralLink, slug),
          eq(realEstateAgents.isApproved, true),
          eq(realEstateAgents.isActive, true)
        )
      );

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent profile:', error);
    res.status(500).json({ message: 'Failed to fetch agent profile' });
  }
});
```

## Summary

This implementation plan provides:

1. **Database Enhancement**: Proper status enum field for better agent state management
2. **Backend API**: Three protected admin endpoints for listing, approving, and denying agents
3. **Frontend UI**: Comprehensive agent management tab in the existing admin panel
4. **Dynamic Profiles**: SEO-optimized agent profile pages with professional layouts
5. **Email Integration**: Professional approval/rejection emails using existing Hostinger SMTP
6. **Security**: Proper admin authentication and error handling throughout

All code is tailored to your existing tech stack and follows your established patterns. The system supports customizable welcome messages, rejection reasons, and comprehensive agent information display.