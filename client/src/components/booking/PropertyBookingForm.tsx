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
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [lastError, setLastError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const CLEANING_FEE = 90;
  const MINIMUM_NIGHTS = 7;
  const MAX_RETRY_ATTEMPTS = 3;

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

    // Comprehensive date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      setError('Check-in date cannot be in the past');
      setCalculation(null);
      return;
    }

    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      setCalculation(null);
      return;
    }

    const nights = differenceInDays(checkOut, checkIn);
    
    if (nights < MINIMUM_NIGHTS) {
      setError(`Minimum stay is ${MINIMUM_NIGHTS} nights`);
      setCalculation(null);
      return;
    }

    if (nights > 365) {
      setError('Maximum stay is 365 nights');
      setCalculation(null);
      return;
    }

    // Guest validation
    if (guests < 1) {
      setError('At least 1 guest is required');
      setCalculation(null);
      return;
    }

    if (guests > maxGuests) {
      setError(`Maximum ${maxGuests} guests allowed`);
      setCalculation(null);
      return;
    }

    // Owner booking logic with validation
    const isOwnerBooking = isPropertyOwner && !hasUsedFreeWeek && nights >= 7;
    const basePrice = isOwnerBooking ? 0 : nights * nightlyPrice;
    const total = basePrice + CLEANING_FEE;
    
    // HKT rate validation
    if (hktRate <= 0) {
      setError('HKT price data unavailable. Please try again.');
      setCalculation(null);
      return;
    }

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
      setError('MetaMask wallet extension is required to pay with HKT. Please install MetaMask and try again.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Check if MetaMask is unlocked
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });

      if (accounts.length === 0) {
        // Request account access
        const newAccounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (newAccounts.length === 0) {
          setError('Please connect your MetaMask wallet to continue.');
          return;
        }
        
        setWalletAddress(newAccounts[0]);
      } else {
        setWalletAddress(accounts[0]);
      }

      setWalletConnected(true);
      
      // Check property ownership with better error handling
      try {
        await checkPropertyOwnership(walletAddress || accounts[0]);
      } catch (ownershipError) {
        console.warn('Could not check property ownership:', ownershipError);
        // Continue anyway - this is not critical for wallet connection
      }

    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      if (error.code === 4001) {
        setError('Wallet connection was rejected. Please try again and approve the connection.');
      } else if (error.code === -32002) {
        setError('Wallet connection is already pending. Please check MetaMask.');
      } else {
        setError('Failed to connect wallet. Please make sure MetaMask is installed and try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBooking = async (retryCount = 0) => {
    // Final validation before submission
    if (!checkIn || !checkOut || !calculation) {
      setError('Please select valid dates');
      return;
    }

    if (paymentMethod === 'HKT' && !walletConnected) {
      setError('Please connect your wallet to pay with HKT');
      return;
    }

    // Additional edge case validations
    if (calculation.total <= 0 && !calculation.isOwnerBooking) {
      setError('Invalid booking amount calculated');
      return;
    }

    if (paymentMethod === 'HKT' && calculation.totalHKT <= 0) {
      setError('Invalid HKT amount calculated');
      return;
    }

    // Check for network connectivity
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.');
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
        isOwnerBooking: calculation.isOwnerBooking,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      let response;
      
      // Timeout for fetch requests (30 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      if (paymentMethod === 'USD') {
        // Create Stripe payment with timeout
        response = await fetch('/api/bookings/create-stripe-booking', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Booking-Source': 'enhanced-form'
          },
          body: JSON.stringify(bookingData),
          signal: controller.signal
        });
      } else {
        // Create HKT payment with timeout
        response = await fetch('/api/bookings/create-hkt-booking', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Booking-Source': 'enhanced-form'
          },
          body: JSON.stringify(bookingData),
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      // Comprehensive response validation
      if (!response) {
        throw new Error('No response received from server');
      }

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many booking requests. Please wait and try again.');
        } else if (response.status === 503) {
          throw new Error('Booking service temporarily unavailable. Please try again.');
        } else if (response.status >= 500) {
          throw new Error('Server error occurred. Please try again later.');
        } else {
          throw new Error(`Booking failed: ${response.statusText}`);
        }
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server. Please try again.');
      }

      if (result.success) {
        if (onBookingComplete) {
          onBookingComplete(result.booking);
        }
        // Reset form on success
        setCheckIn(undefined);
        setCheckOut(undefined);
        setGuests(2);
        setCalculation(null);
        setError(null);
      } else {
        throw new Error(result.error || 'Booking failed for unknown reason');
      }

    } catch (error: any) {
      console.error('Booking error:', error);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (retryCount < MAX_RETRY_ATTEMPTS - 1 && (
        error.message.includes('server') || 
        error.message.includes('503') ||
        error.message.includes('timeout') ||
        error.message.includes('network')
      )) {
        // Automatic retry for server/network errors
        const nextAttempt = retryCount + 1;
        setRetryAttempts(nextAttempt);
        console.log(`Retrying booking... attempt ${nextAttempt} of ${MAX_RETRY_ATTEMPTS}`);
        
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.min(2000 * Math.pow(2, retryCount), 8000);
        setError(`Connection issue. Retrying in ${delay/1000} seconds... (${nextAttempt}/${MAX_RETRY_ATTEMPTS})`);
        
        setTimeout(() => {
          setError(null);
          handleBooking(nextAttempt);
        }, delay);
        return;
      } else {
        setError(error.message || 'Booking failed. Please try again.');
        setRetryAttempts(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateDates = () => {
    if (!checkIn || !checkOut) return false;
    const nights = differenceInDays(checkOut, checkIn);
    return nights >= MINIMUM_NIGHTS;
  };

  const handleBookingClick = () => {
    handleBooking();
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
          <div className="space-y-2">
            <Button 
              onClick={connectWallet} 
              variant="outline" 
              className="w-full"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Connecting...
                </div>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect MetaMask Wallet
                </>
              )}
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              MetaMask wallet required for HKT payments
            </div>
          </div>
        )}

        {/* Enhanced Wallet Info */}
        {walletConnected && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              {isPropertyOwner && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <Gift className="h-3 w-3 mr-1" />
                  Owner
                </Badge>
              )}
            </div>
            {isPropertyOwner && !hasUsedFreeWeek && (
              <div className="mt-2 text-xs text-green-700 dark:text-green-300">
                ✨ Free week available for 7+ night stays
              </div>
            )}
          </div>
        )}

        {/* HKT Price Information */}
        {paymentMethod === 'HKT' && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current HKT Rate</span>
              <div className="text-right">
                <div className="font-semibold">${hktRate.toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">
                  {format(priceUpdateTime, 'HH:mm:ss')}
                </div>
              </div>
            </div>
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
          onClick={handleBookingClick}
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

        {/* Enhanced Booking Terms */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-1">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Booking Terms</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              Minimum {MINIMUM_NIGHTS} nights required
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              ${CLEANING_FEE} cleaning fee applies to all bookings
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              Property owners get one free week per share
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
              50% refund available for cancellations
            </div>
            {paymentMethod === 'HKT' && (
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                HKT payments processed via blockchain
              </div>
            )}
          </div>
        </div>

        {/* Connection Status Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${navigator.onLine ? 'bg-green-500' : 'bg-red-500'}`}></div>
          {navigator.onLine ? 'Connected' : 'Offline'}
          {retryAttempts > 0 && (
            <span className="ml-2 text-orange-600">
              ({retryAttempts}/{MAX_RETRY_ATTEMPTS} retries)
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}