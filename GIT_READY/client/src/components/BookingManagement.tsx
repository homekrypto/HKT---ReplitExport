import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, MapPin, Users, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: number;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalUsd: number;
  totalHkt: number;
  currency: string;
  cleaningFee: number;
  isFreeWeek: boolean;
  status: string;
  createdAt: string;
}

interface Property {
  id: string;
  name: string;
  location: string;
  images: string[];
}

interface BookingWithProperty {
  booking: Booking;
  property: Property;
}

export default function BookingManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Fetch user bookings
  const { data: bookings = [], isLoading } = useQuery<BookingWithProperty[]>({
    queryKey: ['/api/bookings/my-bookings'],
  });

  // Cancel booking mutation
  const cancelBooking = useMutation({
    mutationFn: (bookingId: number) => 
      fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      }).then(res => res.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/my-bookings'] });
      toast({
        title: 'Booking Canceled',
        description: data.refundMessage,
      });
      setCancellingId(null);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: error.message || 'Failed to cancel booking',
      });
      setCancellingId(null);
    },
  });

  const handleCancel = (bookingId: number) => {
    setCancellingId(bookingId);
    cancelBooking.mutate(bookingId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const canCancel = (booking: Booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    return booking.status === 'confirmed' && now < checkIn;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5" />
          <span>Your Property Bookings</span>
        </CardTitle>
        <CardDescription>
          Manage your upcoming and past property reservations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't made any property bookings yet. Start by exploring our available properties.
            </p>
            <Button onClick={() => window.location.href = '/pilot-property-showcase'}>
              Explore Properties
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(({ booking, property }) => (
              <div key={booking.id} className="border rounded-lg p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                      {property?.name || 'Luxury Villa Cap Cana'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property?.location || 'Cap Cana, Dominican Republic'}
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {booking.status === 'canceled' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Check-in</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Check-out</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Duration</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {booking.nights} nights
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accommodation ({booking.nights} nights)</span>
                      <span>
                        {booking.currency === 'USD' 
                          ? `$${(booking.totalUsd - booking.cleaningFee).toFixed(2)}`
                          : `${(booking.totalHkt * 0.9).toFixed(0)} HKT`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cleaning fee</span>
                      <span>
                        {booking.currency === 'USD' 
                          ? `$${booking.cleaningFee.toFixed(2)}`
                          : `${(booking.totalHkt * 0.1).toFixed(0)} HKT`
                        }
                      </span>
                    </div>
                    {booking.isFreeWeek && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Free week discount</span>
                        <span>Applied ✓</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total paid</span>
                      <span>
                        {booking.currency === 'USD' 
                          ? `$${booking.totalUsd.toFixed(2)}`
                          : `${booking.totalHkt.toFixed(0)} HKT`
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Special Features */}
                {booking.isFreeWeek && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-center text-green-800 dark:text-green-200">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        Property Share Owner Benefit: First 7 nights were FREE
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {canCancel(booking) && (
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Cancel before check-in for 50% refund
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? 'Canceling...' : 'Cancel Booking'}
                    </Button>
                  </div>
                )}

                {/* Booking Date */}
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
                  Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}