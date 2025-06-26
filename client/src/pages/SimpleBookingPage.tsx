import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Users, Bed, Bath, Gift } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function SimpleBookingPage() {
  const [, params] = useRoute('/booking/:propertyId');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const propertyId = params?.propertyId || 'cap-cana-villa';
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [currency, setCurrency] = useState<'USD' | 'HKT'>('USD');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch property details
  const { data: property, isLoading: loadingProperty } = useQuery({
    queryKey: [`/api/bookings/properties/${propertyId}`],
  });

  // Fetch user shares for this property
  const { data: userShares } = useQuery({
    queryKey: [`/api/bookings/user-shares/${propertyId}`],
  });

  // Calculate price when dates change
  const { data: pricing, isLoading: loadingPrice } = useQuery({
    queryKey: [`/api/bookings/calculate-price`, checkIn, checkOut, currency],
    enabled: !!(checkIn && checkOut),
  });

  // Give test share mutation
  const giveTestShare = useMutation({
    mutationFn: () => fetch('/api/bookings/give-test-share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/user-shares/${propertyId}`] });
      toast({
        title: 'Test Share Granted',
        description: 'You now own 1 share in this property for testing!',
      });
    },
  });

  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: (bookingData: any) => fetch('/api/bookings/create-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    }).then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: 'Booking Confirmed',
        description: data.message,
      });
      setLocation('/dashboard');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: 'Failed to create booking',
      });
      setIsProcessing(false);
    },
  });

  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;
  const isValidBooking = nights >= 7 && checkIn && checkOut;

  const handleCalculatePrice = async () => {
    if (!isValidBooking) return;
    
    try {
      const response = await fetch('/api/bookings/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          checkIn,
          checkOut,
          currency,
          guests,
        }),
      });
      
      const result = await response.json();
      queryClient.setQueryData([`/api/bookings/calculate-price`, checkIn, checkOut, currency], result);
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  const handleBooking = async () => {
    if (!isValidBooking || !pricing) return;
    
    setIsProcessing(true);
    
    createBooking.mutate({
      propertyId,
      checkIn,
      checkOut,
      currency,
      total: currency === 'USD' ? pricing.total : pricing.totalHkt,
      nights,
      isFreeWeek: pricing.isFreeWeek,
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation('/pilot-property-showcase')}
            className="mb-4"
          >
            ← Back to Properties
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Book Luxury Villa Cap Cana
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Cap Cana, Dominican Republic</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Details */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1520637836862-4d197d17c38a?w=800&h=600&fit=crop"
                    alt="Luxury Villa Cap Cana"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Experience the ultimate luxury in this stunning beachfront villa featuring panoramic ocean views, private pool, and world-class amenities.
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Up to 8 guests</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bed className="h-4 w-4" />
                    <span>4 bedrooms</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="h-4 w-4" />
                    <span>3 bathrooms</span>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-medium mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Private Pool', 'Ocean View', 'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Beach Access'].map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

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

                {/* Test Share Button */}
                {!userShares?.hasShares && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Want to test the free week feature?
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Get a test property share to experience the booking system with owner benefits.
                    </p>
                    <Button
                      onClick={() => giveTestShare.mutate()}
                      disabled={giveTestShare.isPending}
                      size="sm"
                      variant="outline"
                    >
                      {giveTestShare.isPending ? 'Granting...' : 'Get Test Share'}
                    </Button>
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
                <CardDescription>Minimum 7-night stay required • $285.71/night</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                      className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn ? format(addDays(new Date(checkIn), 7), 'yyyy-MM-dd') : format(addDays(new Date(), 8), 'yyyy-MM-dd')}
                      className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                  >
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
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

                {/* Calculate Price Button */}
                {isValidBooking && (
                  <Button
                    onClick={handleCalculatePrice}
                    disabled={loadingPrice}
                    className="w-full"
                    variant="outline"
                  >
                    {loadingPrice ? 'Calculating...' : 'Calculate Price'}
                  </Button>
                )}

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
                    <span>${pricing.pricePerNight.toFixed(2)} × {pricing.nights} nights</span>
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
                        : `${pricing.totalHkt.toFixed(0)} HKT`
                      }
                    </span>
                  </div>

                  {pricing.isFreeWeek && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Your first 7 nights are FREE as a property share owner!
                    </div>
                  )}

                  {/* Booking Button */}
                  <Button
                    onClick={handleBooking}
                    disabled={isProcessing || createBooking.isPending}
                    className="w-full mt-4"
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : 
                     currency === 'USD' ? `Reserve & Pay $${pricing.total.toFixed(2)}` :
                     `Reserve & Pay ${pricing.totalHkt.toFixed(0)} HKT`}
                  </Button>
                  
                  <p className="text-xs text-gray-700 dark:text-gray-400 text-center font-medium">
                    You can cancel for a 50% refund before your check-in date.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}