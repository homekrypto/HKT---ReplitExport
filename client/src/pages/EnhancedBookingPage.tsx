import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Bed, Bath, Gift, ArrowLeft, MapPin, Star, Wifi, Car, Utensils, Tv, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PropertyBookingForm from '@/components/booking/PropertyBookingForm';
import BookingSuccess from '@/components/booking/BookingSuccess';

interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  nightlyPrice: number;
  totalShares: number;
  sharePrice: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isActive: boolean;
}

interface UserShares {
  hasShares: boolean;
  totalShares: number;
  hasUsedFreeWeek: boolean;
}

export default function EnhancedBookingPage() {
  const [, params] = useRoute('/booking/:propertyId');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const propertyId = params?.propertyId;
  const [showBookingForm, setShowBookingForm] = useState(true);
  const [completedBooking, setCompletedBooking] = useState<any>(null);

  // Fetch property details
  const { data: property, isLoading: loadingProperty } = useQuery({
    queryKey: [`/api/bookings/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  // Fetch user shares for this property
  const { data: userShares } = useQuery<UserShares>({
    queryKey: [`/api/bookings/user-shares/${propertyId}`],
    enabled: !!propertyId,
  });

  const handleBookingComplete = (booking: any) => {
    setCompletedBooking(booking);
    setShowBookingForm(false);
    toast({
      title: 'Booking Confirmed!',
      description: 'Your reservation has been successfully processed.',
    });
  };

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Kitchen': Utensils,
    'TV': Tv,
    'Coffee': Coffee,
    'Pool': '🏊',
    'Gym': '💪',
    'Beach Access': '🏖️',
    'Air Conditioning': '❄️',
    'Balcony': '🌅'
  };

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Property Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The property you're looking for doesn't exist or is no longer available.
          </p>
          <Button onClick={() => setLocation('/properties')} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  if (!showBookingForm && completedBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto py-8">
          <BookingSuccess 
            booking={completedBooking}
            onClose={() => setLocation('/properties')}
            onViewBookings={() => setLocation('/dashboard')}
          />
        </div>
      </div>
    );
  }

  const nightlyPrice = property.nightlyPrice || property.pricePerNight || 285.71;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation('/properties')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {property.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{property.location}</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                ${nightlyPrice}/night
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Minimum 7 nights
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <Home className="h-16 w-16 mx-auto mb-4" />
                        <p>Property Image Coming Soon</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {property.description || "Experience luxury in this beautiful vacation rental. Perfect for families and groups looking for a memorable stay with modern amenities and stunning views."}
                </p>
                
                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Guests</div>
                    <div className="font-semibold">Up to {property.maxGuests || 8}</div>
                  </div>
                  <div className="text-center">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                    <div className="font-semibold">{property.bedrooms || 4}</div>
                  </div>
                  <div className="text-center">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                    <div className="font-semibold">{property.bathrooms || 3}</div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-semibold mb-3">Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(property.amenities || ['WiFi', 'Parking', 'Kitchen', 'Pool', 'Air Conditioning', 'Beach Access']).map((amenity: string, index: number) => {
                      const IconComponent = amenityIcons[amenity];
                      return (
                        <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border">
                          {typeof IconComponent === 'string' ? (
                            <span className="text-lg">{IconComponent}</span>
                          ) : IconComponent ? (
                            <IconComponent className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Star className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Property Share Owner Benefits */}
                {userShares?.hasShares && (
                  <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <Gift className="h-5 w-5 text-green-600" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      <div className="space-y-2">
                        <div className="font-semibold">🎉 Property Share Owner Benefits</div>
                        <div>You own {userShares.totalShares} share{userShares.totalShares > 1 ? 's' : ''} in this property!</div>
                        {!userShares.hasUsedFreeWeek ? (
                          <div className="text-sm">Enjoy your first 7+ nights <strong>FREE</strong> (you only pay the $90 cleaning fee).</div>
                        ) : (
                          <div className="text-sm">You've already used your free week benefit for this property.</div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PropertyBookingForm
                propertyId={propertyId!}
                propertyName={property.name}
                nightlyPrice={nightlyPrice}
                maxGuests={property.maxGuests || 8}
                onBookingComplete={handleBookingComplete}
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>House Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Minimum 7-night stay required</div>
              <div>• Check-in: 3:00 PM - 11:00 PM</div>
              <div>• Check-out: 11:00 AM</div>
              <div>• No smoking anywhere on the property</div>
              <div>• No parties or events</div>
              <div>• Pets allowed with prior approval</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Cancellations 7+ days before check-in: 50% refund</div>
              <div>• Cancellations less than 7 days: No refund</div>
              <div>• Cleaning fee is non-refundable</div>
              <div>• Property owners can cancel for free up to 24 hours before check-in</div>
              <div>• Force majeure events may allow full refunds</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}