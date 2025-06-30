import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CalendarIcon, 
  Users, 
  DollarSign, 
  Coins, 
  Wallet,
  Gift,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface PropertyBookingFormProps {
  propertyId: string;
  propertyName: string;
  nightlyPrice: number;
  maxGuests: number;
  onBookingComplete?: (booking: any) => void;
}

interface BookingCalculation {
  nights: number;
  basePrice: number;
  cleaningFee: number;
  total: number;
  totalHKT: number;
  isOwnerBooking: boolean;
  hktRate: number;
}

export default function PropertyBookingForm({
  propertyId,
  propertyName,
  nightlyPrice,
  maxGuests,
  onBookingComplete
}: PropertyBookingFormProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<'USD' | 'HKT'>('USD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hktRate, setHktRate] = useState(0.10); // Default $0.10 per HKT
  const [calculation, setCalculation] = useState<BookingCalculation | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isPropertyOwner, setIsPropertyOwner] = useState(false);
  const [hasUsedFreeWeek, setHasUsedFreeWeek] = useState(false);
  const [priceUpdateTime, setPriceUpdateTime] = useState<Date>(new Date());

  const CLEANING_FEE = 90;
  const MINIMUM_NIGHTS = 7;

  useEffect(() => {
    // Check wallet connection
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
          checkPropertyOwnership(accounts[0]);
        }
      });
    }
  }, []);

  useEffect(() => {
    // Fetch HKT price every 60 seconds
    const fetchHKTPrice = async () => {
      try {
        const response = await fetch('/api/hkt-stats');
        const data = await response.json();
        if (data.price) {
          setHktRate(data.price);
          setPriceUpdateTime(new Date());
        }
      } catch (error) {
        console.error('Failed to fetch HKT price:', error);
      }
    };

    fetchHKTPrice();
    const interval = setInterval(fetchHKTPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate booking price when dates change
    if (checkIn && checkOut) {
      calculateBookingPrice();
    }
  }, [checkIn, checkOut, guests, isPropertyOwner, hasUsedFreeWeek, hktRate]);

  const checkPropertyOwnership = async (address: string) => {
    try {
      const response = await fetch(`/api/bookings/user-shares/${propertyId}`, {
        headers: {
          'X-Wallet-Address': address
        }
      });
      const data = await response.json();
      setIsPropertyOwner(data.hasShares);
      setHasUsedFreeWeek(data.hasUsedFreeWeek || false);
    } catch (error) {
      console.error('Failed to check property ownership:', error);
    }
  };

  const calculateBookingPrice = () => {
    if (!checkIn || !checkOut) return;

    const nights = differenceInDays(checkOut, checkIn);
    if (nights < MINIMUM_NIGHTS) {
      setError(`Minimum stay is ${MINIMUM_NIGHTS} nights`);
      setCalculation(null);
      return;
    }

    const isOwnerBooking = isPropertyOwner && !hasUsedFreeWeek && nights >= 7;
    const basePrice = isOwnerBooking ? 0 : nights * nightlyPrice;
    const total = basePrice + CLEANING_FEE;
    const totalHKT = total / hktRate;

    setCalculation({
      nights,
      basePrice,
      cleaningFee: CLEANING_FEE,
      total,
      totalHKT,
      isOwnerBooking,
      hktRate
    });
    setError(null);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is required to pay with HKT');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
      await checkPropertyOwnership(accounts[0]);
    } catch (error) {
      setError('Failed to connect wallet');
    }
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !calculation) {
      setError('Please select valid dates');
      return;
    }

    if (paymentMethod === 'HKT' && !walletConnected) {
      setError('Please connect your wallet to pay with HKT');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const bookingData = {
        propertyId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        paymentMethod,
        calculation,
        walletAddress: paymentMethod === 'HKT' ? walletAddress : null,
        isOwnerBooking: calculation.isOwnerBooking
      };

      let response;
      if (paymentMethod === 'USD') {
        // Create Stripe payment
        response = await fetch('/api/bookings/create-stripe-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
      } else {
        // Create HKT payment
        response = await fetch('/api/bookings/create-hkt-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
      }

      const result = await response.json();

      if (result.success) {
        if (onBookingComplete) {
          onBookingComplete(result.booking);
        }
        // Reset form
        setCheckIn(undefined);
        setCheckOut(undefined);
        setGuests(2);
        setCalculation(null);
      } else {
        setError(result.error || 'Booking failed');
      }
    } catch (error) {
      setError('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateDates = () => {
    if (!checkIn || !checkOut) return false;
    const nights = differenceInDays(checkOut, checkIn);
    return nights >= MINIMUM_NIGHTS;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Book {propertyName}
        </CardTitle>
        <CardDescription>
          Minimum {MINIMUM_NIGHTS} nights • ${nightlyPrice}/night
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Owner Perk Notice */}
        {isPropertyOwner && !hasUsedFreeWeek && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <Gift className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              🎉 Property Owner Perk: Book 7+ nights for free (cleaning fee only)
            </AlertDescription>
          </Alert>
        )}

        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "MMM dd") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "MMM dd") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => 
                    date < (checkIn ? addDays(checkIn, MINIMUM_NIGHTS) : new Date())
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guests Selection */}
        <div className="space-y-2">
          <Label>Guests</Label>
          <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {num} guest{num > 1 ? 's' : ''}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>USD (Credit Card)</span>
            </div>
            <Switch
              checked={paymentMethod === 'HKT'}
              onCheckedChange={(checked) => setPaymentMethod(checked ? 'HKT' : 'USD')}
            />
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              <span>HKT (Crypto)</span>
            </div>
          </div>

          {/* HKT Rate Display */}
          {paymentMethod === 'HKT' && (
            <div className="text-xs text-muted-foreground">
              1 HKT = ${hktRate.toFixed(4)} USD
              <span className="ml-2">
                Updated: {format(priceUpdateTime, 'HH:mm:ss')}
              </span>
            </div>
          )}
        </div>

        {/* Wallet Connection for HKT */}
        {paymentMethod === 'HKT' && !walletConnected && (
          <Button onClick={connectWallet} variant="outline" className="w-full">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}

        {/* Wallet Info */}
        {walletConnected && (
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
            {isPropertyOwner && (
              <Badge variant="secondary" className="mt-1">
                Property Owner
              </Badge>
            )}
          </div>
        )}

        {/* Price Calculation */}
        {calculation && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{calculation.nights} nights × ${nightlyPrice}</span>
                <span>
                  {calculation.isOwnerBooking ? (
                    <span className="text-green-600 line-through">${calculation.nights * nightlyPrice}</span>
                  ) : (
                    `$${calculation.basePrice}`
                  )}
                </span>
              </div>
              {calculation.isOwnerBooking && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Owner discount</span>
                  <span>-${calculation.nights * nightlyPrice}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Cleaning fee</span>
                <span>${calculation.cleaningFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <div className="text-right">
                  <div>${calculation.total}</div>
                  {paymentMethod === 'HKT' && (
                    <div className="text-sm text-muted-foreground">
                      {calculation.totalHKT.toLocaleString()} HKT
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Book Button */}
        <Button
          onClick={handleBooking}
          disabled={!validateDates() || isLoading || (paymentMethod === 'HKT' && !walletConnected)}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              {paymentMethod === 'USD' ? (
                <DollarSign className="h-4 w-4 mr-2" />
              ) : (
                <Coins className="h-4 w-4 mr-2" />
              )}
              Book with {paymentMethod}
              {calculation && ` - ${paymentMethod === 'USD' ? '$' + calculation.total : calculation.totalHKT.toLocaleString() + ' HKT'}`}
            </>
          )}
        </Button>

        {/* Booking Terms */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Minimum {MINIMUM_NIGHTS} nights required</div>
          <div>• $90 cleaning fee applies to all bookings</div>
          <div>• Property owners get one free week per property share</div>
          {paymentMethod === 'HKT' && (
            <div>• HKT payments are processed via smart contract</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}