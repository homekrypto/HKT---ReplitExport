import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Home, 
  Users, 
  DollarSign, 
  Edit, 
  Save, 
  Calendar,
  BarChart3,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerNightUsd: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  hktPriceOverride: number;
  isActive: boolean;
  stats?: {
    totalBookings: number;
    activeBookings: number;
    totalRevenue: number;
    occupancyRate: number;
  };
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Property>>({});

  // Allow any logged-in user admin access for now
  const isAdmin = !!user;

  // Fetch properties
  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/admin/properties'],
    enabled: isAdmin,
  });

  // Fetch platform stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: isAdmin,
  });

  // Update property mutation
  const updateProperty = useMutation({
    mutationFn: (data: { propertyId: string; updates: Partial<Property> }) =>
      fetch(`/api/admin/properties/${data.propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.updates),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties'] });
      toast({
        title: 'Property Updated',
        description: 'Property settings have been saved successfully.',
      });
      setEditingProperty(null);
      setEditForm({});
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Failed to update property',
      });
    },
  });

  // Update HKT price mutation
  const updateHktPrice = useMutation({
    mutationFn: (priceUsd: number) =>
      fetch('/api/admin/hkt-price', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceUsd }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hkt-stats'] });
      toast({
        title: 'HKT Price Updated',
        description: 'Global HKT price has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Failed to update HKT price',
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

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>Access Denied</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Admin access is restricted to support@homekrypto.com only.
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage properties, pricing, and platform settings
            </p>
          </div>

          <Tabs defaultValue="properties" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="properties" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Properties</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Statistics</span>
              </TabsTrigger>
            </TabsList>

            {/* Properties Management */}
            <TabsContent value="properties">
              <div className="space-y-6">
                {propertiesLoading ? (
                  <Card>
                    <CardContent className="py-8">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  properties.map((property) => (
                    <Card key={property.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <span>{property.name}</span>
                              <Badge variant={property.isActive ? 'default' : 'secondary'}>
                                {property.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </CardTitle>
                            <CardDescription>{property.location}</CardDescription>
                          </div>
                          {editingProperty === property.id ? (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleSave(property.id)}
                                disabled={updateProperty.isPending}
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(property)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {editingProperty === property.id ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="pricePerNight">Price per Night (USD)</Label>
                              <Input
                                id="pricePerNight"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editForm.pricePerNightUsd || ''}
                                onChange={(e) => setEditForm(prev => ({
                                  ...prev,
                                  pricePerNightUsd: parseFloat(e.target.value) || 0
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
                                  maxGuests: parseInt(e.target.value) || 1
                                }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="hktPrice">HKT Price Override (USD)</Label>
                              <Input
                                id="hktPrice"
                                type="number"
                                min="0"
                                step="0.001"
                                value={editForm.hktPriceOverride || ''}
                                onChange={(e) => setEditForm(prev => ({
                                  ...prev,
                                  hktPriceOverride: parseFloat(e.target.value) || 0
                                }))}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Price per Night
                              </div>
                              <div className="text-lg font-semibold">
                                ${property.pricePerNightUsd}/night
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Max Guests
                              </div>
                              <div className="text-lg font-semibold">
                                {property.maxGuests} guests
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                HKT Price
                              </div>
                              <div className="text-lg font-semibold">
                                ${property.hktPriceOverride}/HKT
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Bedrooms/Bathrooms
                              </div>
                              <div className="text-lg font-semibold">
                                {property.bedrooms}BR / {property.bathrooms}BA
                              </div>
                            </div>
                          </div>
                        )}

                        {property.stats && (
                          <>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {property.stats.totalBookings}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Total Bookings
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {property.stats.activeBookings}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Active Bookings
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                  ${property.stats.totalRevenue.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Total Revenue
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                  {property.stats.occupancyRate.toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Occupancy Rate
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Global HKT Price Override</CardTitle>
                  <CardDescription>
                    Set a fixed HKT price until DEX exchange listings are available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Label htmlFor="globalHktPrice" className="min-w-0">
                        HKT Price (USD)
                      </Label>
                      <Input
                        id="globalHktPrice"
                        type="number"
                        min="0"
                        step="0.001"
                        defaultValue="0.10"
                        className="max-w-xs"
                        onBlur={(e) => {
                          const price = parseFloat(e.target.value);
                          if (price > 0) {
                            updateHktPrice.mutate(price);
                          }
                        }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Current setting: $0.10 USD per HKT token. This will be replaced by 
                      real-time DEX pricing once the token is listed on exchanges.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics */}
            <TabsContent value="stats">
              {statsLoading ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats?.activeUsers || 0} verified
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalInvestments || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        ${(stats?.totalInvestedAmount || 0).toLocaleString()} invested
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        Newsletter & waitlist
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Properties</CardTitle>
                      <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats?.platformStats?.totalProperties || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Active listings
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats?.platformStats?.totalBookings || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        All time
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${(stats?.platformStats?.totalRevenue || 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Booking revenue
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}