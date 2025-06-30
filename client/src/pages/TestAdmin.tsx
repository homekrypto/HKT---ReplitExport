import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, User, Mail, Building } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Property {
  id: string;
  name: string;
  location: string;
  pricePerNightUsd: number;
  maxGuests: number;
  hktPriceOverride: number;
  isActive: boolean;
  stats?: {
    totalBookings: number;
    totalRevenue: number;
    occupancyRate: number;
  };
}

interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  licenseNumber: string;
  city: string;
  country: string;
  website?: string;
  linkedIn?: string;
  bio: string;
  yearsExperience: number;
  languagesSpoken: string[];
  seoBacklinkUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  referralLink?: string;
}

export default function TestAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Property>>({});
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Fetch pending agents
  const { data: pendingAgents = [], refetch: refetchAgents } = useQuery<Agent[]>({
    queryKey: ['/admin/agents/pending'],
    select: (data: unknown) => Array.isArray(data) ? data as Agent[] : [],
  });

  // Use local state instead of database to demonstrate admin functionality
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 'cap-cana-villa',
      name: 'Luxury Cap Cana Villa',
      location: 'Punta Cana, Dominican Republic',
      pricePerNightUsd: 450,
      maxGuests: 8,
      hktPriceOverride: 0.10,
      isActive: true,
      stats: {
        totalBookings: 24,
        totalRevenue: 32400,
        occupancyRate: 75
      }
    },
    {
      id: 'miami-condo',
      name: 'Miami Beach Condo',
      location: 'Miami Beach, Florida',
      pricePerNightUsd: 320,
      maxGuests: 4,
      hktPriceOverride: 0.10,
      isActive: false,
      stats: {
        totalBookings: 0,
        totalRevenue: 0,
        occupancyRate: 0
      }
    }
  ]);

  const propertiesLoading = false;

  // Update property using local state
  const updateProperty = useMutation({
    mutationFn: async ({ propertyId, updates }: { propertyId: string; updates: Partial<Property> }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state
      setProperties(prev => prev.map(property => 
        property.id === propertyId 
          ? { ...property, ...updates }
          : property
      ));
      
      return { success: true };
    },
    onSuccess: () => {
      setEditingProperty(null);
      setEditForm({});
      toast({
        title: "Property Updated",
        description: "Property settings have been successfully updated.",
      });
    },
  });

  const approveAgent = useMutation({
    mutationFn: async (agentId: number) => {
      return apiRequest('POST', `/admin/agents/${agentId}/approve`);
    },
    onSuccess: () => {
      refetchAgents();
      toast({
        title: "Agent Approved",
        description: "Agent has been approved and notified via email.",
      });
    },
    onError: (error) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve agent.",
        variant: "destructive",
      });
    },
  });

  const rejectAgent = useMutation({
    mutationFn: async ({ agentId, reason }: { agentId: number; reason: string }) => {
      return apiRequest('POST', `/admin/agents/${agentId}/reject`, { reason });
    },
    onSuccess: () => {
      refetchAgents();
      setRejectionReason('');
      toast({
        title: "Agent Rejected",
        description: "Agent has been rejected and notified via email.",
      });
    },
    onError: (error) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject agent.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (property: Property) => {
    setEditingProperty(property.id);
    setEditForm({
      pricePerNightUsd: property.pricePerNightUsd,
      maxGuests: property.maxGuests,
      hktPriceOverride: property.hktPriceOverride,
      isActive: property.isActive,
    });
  };

  const handleSave = (propertyId: string) => {
    updateProperty.mutate({ propertyId, updates: editForm });
  };

  const handleCancel = () => {
    setEditingProperty(null);
    setEditForm({});
  };

  if (propertiesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Test Admin Panel</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Using temporary data (database bypassed)
        </div>
      </div>

      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="agents">Agent Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{property.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{property.location}</p>
                      </div>
                      <div className="flex gap-2">
                        {editingProperty === property.id ? (
                          <>
                            <Button onClick={() => handleSave(property.id)} size="sm">
                              Save
                            </Button>
                            <Button onClick={handleCancel} variant="outline" size="sm">
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => handleEdit(property)} size="sm">
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>

                    {editingProperty === property.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="pricePerNight">Price per Night (USD)</Label>
                          <Input
                            id="pricePerNight"
                            type="number"
                            value={editForm.pricePerNightUsd || ''}
                            onChange={(e) => setEditForm(prev => ({ 
                              ...prev, 
                              pricePerNightUsd: parseFloat(e.target.value) 
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxGuests">Max Guests</Label>
                          <Input
                            id="maxGuests"
                            type="number"
                            min="1"
                            max="20"
                            value={editForm.maxGuests || ''}
                            onChange={(e) => setEditForm(prev => ({ 
                              ...prev, 
                              maxGuests: parseInt(e.target.value) 
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hktPrice">HKT Price Override</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              id="hktPrice"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.10"
                              className="pl-8"
                              value={editForm.hktPriceOverride || ''}
                              onChange={(e) => setEditForm(prev => ({ 
                                ...prev, 
                                hktPriceOverride: parseFloat(e.target.value) 
                              }))}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Price per HKT token in USD only</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Price per Night:</span>
                          <div>${property.pricePerNightUsd}</div>
                        </div>
                        <div>
                          <span className="font-medium">Max Guests:</span>
                          <div>{property.maxGuests}</div>
                        </div>
                        <div>
                          <span className="font-medium">HKT Price (USD):</span>
                          <div>${property.hktPriceOverride.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <div className={property.isActive ? 'text-green-600' : 'text-red-600'}>
                            {property.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                    )}

                    {property.stats && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <div>
                          <span className="font-medium">Total Bookings:</span>
                          <div>{property.stats.totalBookings}</div>
                        </div>
                        <div>
                          <span className="font-medium">Total Revenue:</span>
                          <div>${property.stats.totalRevenue.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="font-medium">Occupancy Rate:</span>
                          <div>{property.stats.occupancyRate}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Agent Approval Management
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and approve pending agent registration applications
              </p>
            </CardHeader>
            <CardContent>
              {pendingAgents.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Pending Applications</h3>
                  <p className="text-gray-600 dark:text-gray-400">All agent applications have been processed.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingAgents.map((agent: Agent) => (
                    <div key={agent.id} className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {agent.firstName} {agent.lastName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="h-4 w-4" />
                              {agent.email}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                          <p className="text-gray-900 dark:text-gray-100">{agent.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                          <p className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {agent.company}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">License Number</label>
                          <p className="text-gray-900 dark:text-gray-100">{agent.licenseNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                          <p className="text-gray-900 dark:text-gray-100">{agent.city}, {agent.country}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience</label>
                          <p className="text-gray-900 dark:text-gray-100">{agent.yearsExperience} years</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Languages</label>
                          <p className="text-gray-900 dark:text-gray-100">{agent.languagesSpoken.join(', ')}</p>
                        </div>
                      </div>

                      {agent.website && (
                        <div className="mb-4">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                          <p className="text-blue-600 dark:text-blue-400 hover:underline">
                            <a href={agent.website} target="_blank" rel="noopener noreferrer">{agent.website}</a>
                          </p>
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">{agent.bio}</p>
                      </div>

                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submitted</label>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {new Date(agent.submittedAt).toLocaleDateString()} at {new Date(agent.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={() => approveAgent.mutate(agent.id)}
                            disabled={approveAgent.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {approveAgent.isPending ? 'Approving...' : 'Approve Agent'}
                          </Button>
                          
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Optional: Add reason for rejection (will be sent to agent)"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="min-h-[40px]"
                            />
                            <Button
                              onClick={() => rejectAgent.mutate({ agentId: agent.id, reason: rejectionReason })}
                              disabled={rejectAgent.isPending}
                              variant="outline"
                              className="w-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              {rejectAgent.isPending ? 'Rejecting...' : 'Reject Application'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}