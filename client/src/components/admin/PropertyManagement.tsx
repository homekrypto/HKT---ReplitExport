import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  DollarSign, 
  Users, 
  Eye, 
  EyeOff,
  Save,
  Calendar,
  MapPin,
  Home,
  Coins
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  nightlyPriceUSD: number;
  maxGuests: number;
  isActive: boolean;
  images: string[];
  totalBookings: number;
  totalRevenue: number;
  ownerWallets: string[];
}

interface PropertyManagementProps {
  propertyId?: string;
}

export default function PropertyManagement({ propertyId }: PropertyManagementProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hktPriceOverride, setHktPriceOverride] = useState<number>(0.10);

  // Form state for property editing
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    nightlyPriceUSD: 0,
    maxGuests: 8,
    isActive: true,
    images: [] as string[],
    ownerWallets: [] as string[]
  });

  useEffect(() => {
    loadProperties();
    loadHKTPrice();
  }, []);

  useEffect(() => {
    if (propertyId) {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        selectProperty(property);
      }
    }
  }, [propertyId, properties]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/properties');
      const data = await response.json();
      
      if (data.properties) {
        setProperties(data.properties);
      }
    } catch (error) {
      setError('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHKTPrice = async () => {
    try {
      const response = await fetch('/api/hkt-stats');
      const data = await response.json();
      if (data.price) {
        setHktPriceOverride(data.price);
      }
    } catch (error) {
      console.error('Failed to load HKT price:', error);
    }
  };

  const selectProperty = (property: Property) => {
    setSelectedProperty(property);
    setFormData({
      name: property.name,
      location: property.location,
      description: property.description,
      nightlyPriceUSD: property.nightlyPriceUSD,
      maxGuests: property.maxGuests,
      isActive: property.isActive,
      images: property.images,
      ownerWallets: property.ownerWallets
    });
  };

  const updateProperty = async () => {
    if (!selectedProperty) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/properties/${selectedProperty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Property updated successfully');
        await loadProperties();
        
        // Update selected property
        const updatedProperty = { ...selectedProperty, ...formData };
        setSelectedProperty(updatedProperty);
      } else {
        setError(result.error || 'Failed to update property');
      }
    } catch (error) {
      setError('Failed to update property');
    } finally {
      setIsLoading(false);
    }
  };

  const updateHKTPrice = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/hkt-price', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: hktPriceOverride })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('HKT price updated successfully');
      } else {
        setError(result.error || 'Failed to update HKT price');
      }
    } catch (error) {
      setError('Failed to update HKT price');
    } finally {
      setIsLoading(false);
    }
  };

  const addOwnerWallet = () => {
    setFormData(prev => ({
      ...prev,
      ownerWallets: [...prev.ownerWallets, '']
    }));
  };

  const updateOwnerWallet = (index: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      ownerWallets: prev.ownerWallets.map((wallet, i) => 
        i === index ? address : wallet
      )
    }));
  };

  const removeOwnerWallet = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ownerWallets: prev.ownerWallets.filter((_, i) => i !== index)
    }));
  };

  const calculateHKTPrice = (usdPrice: number) => {
    return (usdPrice / hktPriceOverride).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* HKT Price Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Global HKT Price Control
          </CardTitle>
          <CardDescription>
            Override the HKT/USD exchange rate for all booking calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>HKT Price (USD)</Label>
              <Input
                type="number"
                step="0.0001"
                value={hktPriceOverride}
                onChange={(e) => setHktPriceOverride(parseFloat(e.target.value) || 0)}
                placeholder="0.1000"
              />
            </div>
            <Button onClick={updateHKTPrice} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Update Price
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Current rate: 1 HKT = ${hktPriceOverride.toFixed(4)} USD
          </div>
        </CardContent>
      </Card>

      {/* Property List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card 
                key={property.id}
                className={`cursor-pointer transition-colors ${
                  selectedProperty?.id === property.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => selectProperty(property)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{property.name}</h3>
                      <Badge variant={property.isActive ? 'default' : 'secondary'}>
                        {property.isActive ? (
                          <><Eye className="h-3 w-3 mr-1" />Active</>
                        ) : (
                          <><EyeOff className="h-3 w-3 mr-1" />Inactive</>
                        )}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {property.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-3 w-3" />
                      ${property.nightlyPriceUSD}/night
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3" />
                      Up to {property.maxGuests} guests
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {property.totalBookings} bookings • ${property.totalRevenue} revenue
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Editor */}
      {selectedProperty && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Edit Property: {selectedProperty.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Property Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Property name"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Property description"
                rows={3}
              />
            </div>

            {/* Pricing and Capacity */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Nightly Price (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.nightlyPriceUSD}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    nightlyPriceUSD: parseFloat(e.target.value) || 0 
                  }))}
                />
                <div className="text-xs text-muted-foreground">
                  = {calculateHKTPrice(formData.nightlyPriceUSD)} HKT/night
                </div>
              </div>
              <div className="space-y-2">
                <Label>Maximum Guests</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    maxGuests: parseInt(e.target.value) || 1 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Property Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      isActive: checked 
                    }))}
                  />
                  <span className="text-sm">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Wallets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Owner Wallets (Free Week Eligibility)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOwnerWallet}
                >
                  Add Wallet
                </Button>
              </div>
              <div className="space-y-2">
                {formData.ownerWallets.map((wallet, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={wallet}
                      onChange={(e) => updateOwnerWallet(index, e.target.value)}
                      placeholder="0x..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOwnerWallet(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {formData.ownerWallets.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No owner wallets configured. Add wallet addresses to enable free week perks.
                  </div>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <AlertDescription className="text-green-700 dark:text-green-300">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Save Button */}
            <Button 
              onClick={updateProperty} 
              disabled={isLoading}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Property Changes'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}