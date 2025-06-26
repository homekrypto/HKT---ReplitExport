import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function TestAdmin() {
  const queryClient = useQueryClient();
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Property>>({});

  // Fetch properties from temporary route
  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/temp-admin/properties']
  });

  // Update property mutation
  const updateProperty = useMutation({
    mutationFn: async ({ propertyId, updates }: { propertyId: string; updates: Partial<Property> }) => {
      const response = await fetch(`/api/temp-admin/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      if (!response.ok) throw new Error('Failed to update property');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/temp-admin/properties'] });
      setEditingProperty(null);
      setEditForm({});
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
                          <Label htmlFor="hktPrice">HKT Price Override (USD)</Label>
                          <Input
                            id="hktPrice"
                            type="number"
                            step="0.01"
                            value={editForm.hktPriceOverride || ''}
                            onChange={(e) => setEditForm(prev => ({ 
                              ...prev, 
                              hktPriceOverride: parseFloat(e.target.value) 
                            }))}
                          />
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
                          <span className="font-medium">HKT Price:</span>
                          <div>${property.hktPriceOverride}</div>
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
      </Tabs>
    </div>
  );
}