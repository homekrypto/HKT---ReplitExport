import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Calendar, 
  Users, 
  DollarSign,
  Coins,
  ExternalLink,
  Copy,
  Mail,
  MapPin,
  Gift
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingDetails {
  id: string;
  propertyId: string;
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  paymentMethod: 'USD' | 'HKT';
  totalUSD: number;
  totalHKT?: number;
  transactionHash?: string;
  stripePaymentId?: string;
  isOwnerBooking: boolean;
  walletAddress?: string;
  status: string;
  createdAt: string;
}

interface BookingSuccessProps {
  booking: BookingDetails;
  onClose?: () => void;
  onViewBookings?: () => void;
}

export default function BookingSuccess({ booking, onClose, onViewBookings }: BookingSuccessProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Send confirmation email
    sendConfirmationEmail();
  }, []);

  const sendConfirmationEmail = async () => {
    try {
      const response = await fetch('/api/bookings/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id })
      });

      if (response.ok) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  };

  const copyTransactionHash = () => {
    if (booking.transactionHash) {
      navigator.clipboard.writeText(booking.transactionHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getEtherscanUrl = (hash: string) => {
    return `https://etherscan.io/tx/${hash}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-green-700 dark:text-green-300">
            Your reservation has been successfully processed
          </p>
          <Badge variant="secondary" className="mt-3">
            Booking ID: {booking.id}
          </Badge>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Property Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{booking.propertyName}</h3>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{booking.location}</span>
              </div>
            </div>
            {booking.isOwnerBooking && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Gift className="h-3 w-3 mr-1" />
                Owner Perk
              </Badge>
            )}
          </div>

          {/* Stay Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Check-in</div>
              <div className="font-medium">
                {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Check-out</div>
              <div className="font-medium">
                {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Guests</div>
              <div className="font-medium flex items-center gap-1">
                <Users className="h-4 w-4" />
                {booking.guests} guest{booking.guests > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Stay</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {booking.nights} night{booking.nights > 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {booking.paymentMethod === 'USD' ? (
              <DollarSign className="h-5 w-5" />
            ) : (
              <Coins className="h-5 w-5" />
            )}
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Payment Method</div>
              <div className="font-medium">
                {booking.paymentMethod === 'USD' ? 'Credit Card (USD)' : 'Cryptocurrency (HKT)'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
              <div className="font-medium">
                ${booking.totalUSD}
                {booking.totalHKT && (
                  <div className="text-sm text-muted-foreground">
                    ({booking.totalHKT.toLocaleString()} HKT)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          {booking.transactionHash && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Transaction Hash</div>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm flex-1">
                  {booking.transactionHash}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyTransactionHash}
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={getEtherscanUrl(booking.transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Wallet Address */}
          {booking.walletAddress && (
            <div>
              <div className="text-sm text-muted-foreground">Wallet Address</div>
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                {booking.walletAddress}
              </code>
            </div>
          )}

          {/* Owner Booking Details */}
          {booking.isOwnerBooking && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
              <Gift className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                <strong>Property Owner Benefit Applied:</strong> You've used your free week perk for this property. 
                Only the $90 cleaning fee was charged.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Email Confirmation */}
      {emailSent && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Mail className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Confirmation email sent with your booking details and transaction information.
          </AlertDescription>
        </Alert>
      )}

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Check-in Instructions:</strong> You'll receive detailed check-in instructions 
            24 hours before your arrival date.
          </div>
          <div>
            <strong>Cancellation Policy:</strong> Cancellations made 7+ days before check-in 
            receive a 50% refund. The cleaning fee is non-refundable.
          </div>
          <div>
            <strong>Property Contact:</strong> For any questions about your stay, contact 
            our property management team at support@homekrypto.com
          </div>
          {booking.paymentMethod === 'HKT' && (
            <div>
              <strong>Blockchain Transaction:</strong> Your payment has been recorded on the 
              blockchain. Keep your transaction hash as proof of payment.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {onViewBookings && (
          <Button onClick={onViewBookings} className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            View My Bookings
          </Button>
        )}
        {onClose && (
          <Button variant="outline" onClick={onClose} className="flex-1">
            Back to Properties
          </Button>
        )}
      </div>
    </div>
  );
}