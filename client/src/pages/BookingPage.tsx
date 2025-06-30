import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Bed, Bath, Gift, ArrowLeft, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PropertyBookingForm from '@/components/booking/PropertyBookingForm';
import BookingSuccess from '@/components/booking/BookingSuccess';

interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerNight: string;
  totalShares: number;
  sharePrice: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isActive: boolean;
}

interface PriceCalculation {
  nights: number;
  pricePerNight: number;
  subtotal: number;
  cleaningFee: number;
  total: number;
  totalHkt: number;
  isFreeWeek: boolean;
  hasShares: boolean;
  currency: string;
}

interface UserShares {
  hasShares: boolean;
  totalShares: number;
}

export default function BookingPage() {
  const [, params] = useRoute('/booking/:propertyId');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const propertyId = params?.propertyId;
  const [showBookingForm, setShowBookingForm] = useState(true);
  const [completedBooking, setCompletedBooking] = useState<any>(null);

  // Fetch property details
  const { data: property, isLoading: loadingProperty } = useQuery({
    queryKey: ['/api/bookings/properties', propertyId],
    enabled: !!propertyId,
  });

  // Fetch user shares for this property
  const { data: userShares } = useQuery<UserShares>({
    queryKey: ['/api/bookings/user-shares', propertyId],
    enabled: !!propertyId,
  });

  // Calculate price when dates change
  const { data: pricing, isLoading: loadingPrice } = useQuery<PriceCalculation>({
    queryKey: ['/api/bookings/calculate-price', propertyId, checkIn, checkOut, currency],
    enabled: !!(propertyId && checkIn && checkOut),
    queryFn: () => apiRequest(`/api/bookings/calculate-price`, {
      method: 'POST',
      body: JSON.stringify({
        propertyId,
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString(),
        currency,
        guests,
      }),
    }),
  });

  // Create Stripe booking mutation
  const createStripeBooking = useMutation({
    mutationFn: (bookingData: any) => apiRequest('/api/bookings/create-stripe-booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
    onSuccess: (data: any) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking',
      });
      setIsProcessing(false);
    },
  });

  // Create HKT booking mutation
  const createHktBooking = useMutation({
    mutationFn: (bookingData: any) => apiRequest('/api/bookings/create-hkt-booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
    onSuccess: () => {
      toast({
        title: 'Booking Confirmed',
        description: 'Your booking has been confirmed with HKT payment!',
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking',
      });
      setIsProcessing(false);
    },
  });

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const isValidBooking = nights >= 7 && checkIn && checkOut && guests <= (property?.maxGuests || 1);

  const handleStripePayment = async () => {
    if (!isValidBooking) return;
    
    setIsProcessing(true);
    createStripeBooking.mutate({
      propertyId,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      currency: 'USD',
      guests,
    });
  };

  const handleHktPayment = async () => {
    if (!isValidBooking) return;
    
    setIsProcessing(true);
    
    try {
      // Connect to MetaMask
      if (!window.ethereum) {
        throw new Error('MetaMask not found. Please install MetaMask to pay with HKT.');
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Mock transaction hash - in production, execute actual HKT transfer
      const mockTransactionHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      createHktBooking.mutate({
        propertyId,
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString(),
        transactionHash: mockTransactionHash,
        guests,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: error.message || 'Failed to process HKT payment',
      });
      setIsProcessing(false);
    }
  };

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Property Not Found</h1>
          <Button onClick={() => setLocation('/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation('/properties')}
            className="mb-4"
          >
            ← Back to Properties
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Book {property.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{property.location}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Details */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      No image available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">{property.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Up to {property.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Owner Benefits */}
                {userShares?.hasShares && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-medium text-green-800 dark:text-green-200">
                        Property Share Owner Benefits
                      </h4>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      You own {userShares.totalShares} shares in this property! 
                      Enjoy your first 7 nights FREE (you only pay the cleaning fee).
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reserve Your Stay</CardTitle>
                <CardDescription>Minimum 7-night stay required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Date</label>
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) => date < new Date() || date < addDays(new Date(), 1)}
                    className="rounded-md border"
                  />
                </div>

                {checkIn && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out Date</label>
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date <= checkIn || date < addDays(checkIn, 7)}
                      className="rounded-md border"
                    />
                  </div>
                )}

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                  >
                    {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <div className="flex space-x-4">
                    <Button
                      variant={currency === 'USD' ? 'default' : 'outline'}
                      onClick={() => setCurrency('USD')}
                      className="flex-1"
                    >
                      Pay with USD
                    </Button>
                    <Button
                      variant={currency === 'HKT' ? 'default' : 'outline'}
                      onClick={() => setCurrency('HKT')}
                      className="flex-1"
                    >
                      Pay with HKT
                    </Button>
                  </div>
                </div>

                {/* Validation Messages */}
                {nights > 0 && nights < 7 && (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    Minimum 7-night stay required. Current selection: {nights} nights.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            {pricing && isValidBooking && (
              <Card>
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>${pricing.pricePerNight} × {pricing.nights} nights</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {pricing.isFreeWeek && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Free week discount (7 nights)</span>
                      <span>-${(pricing.pricePerNight * 7).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>${pricing.cleaningFee.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      {currency === 'USD' 
                        ? `$${pricing.total.toFixed(2)}`
                        : `${pricing.totalHkt.toFixed(8)} HKT`
                      }
                    </span>
                  </div>

                  {pricing.isFreeWeek && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      🎉 Your first 7 nights are FREE as a property share owner!
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment Buttons */}
            {isValidBooking && pricing && (
              <div className="space-y-3">
                {currency === 'USD' ? (
                  <Button
                    onClick={handleStripePayment}
                    disabled={isProcessing || createStripeBooking.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : `Reserve & Pay $${pricing.total.toFixed(2)}`}
                  </Button>
                ) : (
                  <Button
                    onClick={handleHktPayment}
                    disabled={isProcessing || createHktBooking.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : `Reserve & Pay ${pricing.totalHkt.toFixed(8)} HKT`}
                  </Button>
                )}
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  You can cancel for a 50% refund before your check-in date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}