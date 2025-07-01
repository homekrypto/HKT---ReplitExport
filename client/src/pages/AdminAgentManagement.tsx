import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import SEO from '@/components/SEO';
import { 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Mail, 
  Phone, 
  Building, 
  Award,
  Users,
  Edit,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  licenseNumber: string;
  licenseState: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  linkedIn: string;
  bio: string;
  specializations: string[];
  yearsExperience: number;
  languagesSpoken: string[];
  profileImage: string;
  referralLink: string;
  seoBacklinkUrl: string;
  status: 'pending' | 'approved' | 'denied';
  isApproved: boolean;
  isActive: boolean;
  totalSales?: string;
  totalCommission?: string;
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export default function AdminAgentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['/api/test-agents', filter === 'all' ? undefined : filter],
    queryFn: async () => {
      // Temporarily use test endpoint to verify data access
      const response = await fetch('/api/test-agents', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      let agentData = data.agents || [];
      
      // Apply client-side filtering for testing
      if (filter !== 'all') {
        agentData = agentData.filter((agent: any) => agent.status === filter);
      }
      
      return agentData;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (agentId: number) => {
      const response = await apiRequest('PATCH', `/api/admin/agents/${agentId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/agents'] });
      toast({
        title: 'Agent Approved',
        description: 'The agent has been approved and notified via email.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Approval Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ agentId, reason }: { agentId: number; reason: string }) => {
      const response = await apiRequest('PATCH', `/api/admin/agents/${agentId}/deny`, { reason });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/agents'] });
      setRejectionReason('');
      toast({
        title: 'Agent Rejected',
        description: 'The agent has been rejected and notified via email.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Rejection Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleApprove = (agentId: number) => {
    approveMutation.mutate(agentId);
  };

  const handleReject = (agentId: number) => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive'
      });
      return;
    }
    rejectMutation.mutate({ agentId, reason: rejectionReason });
  };

  const filteredAgents = agents.filter((agent: Agent) => {
    if (filter === 'all') return true;
    if (filter === 'denied') return agent.status === 'denied';
    return agent.status === filter;
  });

  const getStatusBadge = (agent: Agent) => {
    switch (agent.status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'denied':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Denied</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-center mt-4">Loading agents...</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Admin Agent Management - HomeKrypto Administration | HKT"
        description="Administrative dashboard for managing real estate agent registrations, approvals, and profile oversight for HomeKrypto's certified agent network."
        keywords="admin dashboard, agent management, real estate administration, agent approval, HomeKrypto admin, property agent oversight"
        url={`${window.location.origin}/admin/agents`}
      />
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agent Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage real estate agent registrations and approvals</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{agents.length}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {agents.filter((a: Agent) => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {agents.filter((a: Agent) => a.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-500">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {agents.filter((a: Agent) => a.status === 'denied').length}
            </div>
            <div className="text-sm text-gray-500">Denied</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agents List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAgents.map((agent: Agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent.profileImage} alt={`${agent.firstName} ${agent.lastName}`} />
                    <AvatarFallback>
                      {agent.firstName[0]}{agent.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {agent.firstName} {agent.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {agent.city}, {agent.state}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(agent)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{agent.phone}</span>
                </div>
                {agent.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{agent.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span>{agent.licenseNumber} ({agent.licenseState})</span>
                </div>
              </div>

              {agent.specializations && agent.specializations.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Specializations:</div>
                  <div className="flex flex-wrap gap-1">
                    {agent.specializations.slice(0, 3).map(spec => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {agent.specializations.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{agent.specializations.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Performance Metrics for Approved Agents */}
              {agent.status === 'approved' && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Total Sales</div>
                      <div className="text-green-600">${agent.totalSales || '0'}</div>
                    </div>
                    <div>
                      <div className="font-medium">Commission Earned</div>
                      <div className="text-blue-600">${agent.totalCommission || '0'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedAgent(agent)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Agent Details</DialogTitle>
                      <DialogDescription>
                        Complete information for {agent.firstName} {agent.lastName}
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedAgent && (
                      <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Personal Information</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Name:</strong> {selectedAgent.firstName} {selectedAgent.lastName}</div>
                              <div><strong>Email:</strong> {selectedAgent.email}</div>
                              <div><strong>Phone:</strong> {selectedAgent.phone}</div>
                              <div><strong>Location:</strong> {selectedAgent.city}, {selectedAgent.state} {selectedAgent.zipCode}</div>
                              {selectedAgent.company && <div><strong>Company:</strong> {selectedAgent.company}</div>}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">License Information</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>License #:</strong> {selectedAgent.licenseNumber}</div>
                              <div><strong>License State:</strong> {selectedAgent.licenseState}</div>
                              <div><strong>Experience:</strong> {selectedAgent.yearsExperience} years</div>
                              <div><strong>Registered:</strong> {new Date(selectedAgent.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        {selectedAgent.bio && (
                          <div>
                            <h4 className="font-semibold mb-2">Professional Bio</h4>
                            <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">{selectedAgent.bio}</p>
                          </div>
                        )}

                        {/* Online Presence */}
                        <div>
                          <h4 className="font-semibold mb-2">Online Presence</h4>
                          <div className="space-y-2 text-sm">
                            {selectedAgent.website && (
                              <div><strong>Website:</strong> 
                                <a href={selectedAgent.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">
                                  {selectedAgent.website}
                                </a>
                              </div>
                            )}
                            {selectedAgent.linkedIn && (
                              <div><strong>LinkedIn:</strong> 
                                <a href={selectedAgent.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">
                                  {selectedAgent.linkedIn}
                                </a>
                              </div>
                            )}
                            {selectedAgent.seoBacklinkUrl && (
                              <div><strong>SEO Target:</strong> 
                                <a href={selectedAgent.seoBacklinkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">
                                  {selectedAgent.seoBacklinkUrl}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Specializations and Languages */}
                        <div className="grid grid-cols-2 gap-4">
                          {selectedAgent.specializations && selectedAgent.specializations.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Specializations</h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedAgent.specializations.map(spec => (
                                  <Badge key={spec} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {selectedAgent.languagesSpoken && selectedAgent.languagesSpoken.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Languages</h4>
                              <div className="text-sm">
                                {selectedAgent.languagesSpoken.join(', ')}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Rejection Reason */}
                        {selectedAgent.rejectionReason && (
                          <Alert>
                            <AlertDescription>
                              <strong>Rejection Reason:</strong> {selectedAgent.rejectionReason}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Approval/Rejection Actions */}
                {agent.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(agent.id)}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Agent Application</DialogTitle>
                          <DialogDescription>
                            Please provide a reason for rejecting {agent.firstName} {agent.lastName}'s application.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setRejectionReason('')}>
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleReject(agent.id)}
                              disabled={rejectMutation.isPending || !rejectionReason.trim()}
                            >
                              Reject Agent
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No agents found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' ? 'No agents have registered yet.' : `No ${filter} agents found.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
    </>
  );
}