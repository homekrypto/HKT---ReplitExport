import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowRight, Shield, Clock, ExternalLink, AlertCircle } from 'lucide-react';

interface FiatProvider {
  id: string;
  name: string;
  icon: string;
  fees: string;
  processingTime: string;
  supportedMethods: string[];
  minAmount: number;
  maxAmount: number;
  isRecommended?: boolean;
}

interface FiatOnRampProps {
  isOpen: boolean;
  onClose: () => void;
  targetAmount?: number;
  onSuccess?: (txHash: string) => void;
}

export default function FiatOnRamp({ isOpen, onClose, targetAmount = 0, onSuccess }: FiatOnRampProps) {
  const [amount, setAmount] = useState(targetAmount.toString());
  const [selectedProvider, setSelectedProvider] = useState<string>('transak');
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hktPrice, setHktPrice] = useState(0.10); // $0.10 per HKT
  const [estimatedHKT, setEstimatedHKT] = useState(0);

  const fiatProviders: FiatProvider[] = [
    {
      id: 'transak',
      name: 'Transak',
      icon: '🏦',
      fees: '0.99% + network fees',
      processingTime: '5-10 minutes',
      supportedMethods: ['Credit Card', 'Debit Card', 'Bank Transfer'],
      minAmount: 20,
      maxAmount: 10000,
      isRecommended: true
    },
    {
      id: 'ramp',
      name: 'Ramp Network',
      icon: '⚡',
      fees: '1.5% + network fees',
      processingTime: '2-5 minutes',
      supportedMethods: ['Credit Card', 'Debit Card', 'Apple Pay', 'Google Pay'],
      minAmount: 25,
      maxAmount: 5000
    },
    {
      id: 'moonpay',
      name: 'MoonPay',
      icon: '🌙',
      fees: '1.2% + $3.99',
      processingTime: '10-30 minutes',
      supportedMethods: ['Credit Card', 'Debit Card', 'Bank Transfer', 'SEPA'],
      minAmount: 30,
      maxAmount: 15000
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
    { id: 'apple', name: 'Apple Pay', icon: '🍎' },
    { id: 'google', name: 'Google Pay', icon: '🔍' }
  ];

  const selectedProviderData = fiatProviders.find(p => p.id === selectedProvider);

  useEffect(() => {
    // Calculate estimated HKT tokens
    const usdAmount = parseFloat(amount) || 0;
    const estimated = usdAmount / hktPrice;
    setEstimatedHKT(estimated);
  }, [amount, hktPrice]);

  useEffect(() => {
    // Fetch current HKT price
    const fetchHKTPrice = async () => {
      try {
        const response = await fetch('/api/hkt-stats');
        const data = await response.json();
        if (data.price) {
          setHktPrice(data.price);
        }
      } catch (error) {
        console.error('Failed to fetch HKT price:', error);
      }
    };

    if (isOpen) {
      fetchHKTPrice();
    }
  }, [isOpen]);

  const handlePurchase = async () => {
    setIsProcessing(true);

    try {
      // Simulate fiat on-ramp integration
      const purchaseData = {
        provider: selectedProvider,
        amount: parseFloat(amount),
        paymentMethod: selectedMethod,
        targetToken: 'HKT',
        destinationAddress: window.ethereum?.selectedAddress
      };

      // In real implementation, integrate with chosen provider:
      // - Transak: Use Transak SDK
      // - Ramp: Use Ramp Instant SDK  
      // - MoonPay: Use MoonPay SDK

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful transaction
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      if (onSuccess) {
        onSuccess(mockTxHash);
      }

      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  const openProviderInterface = () => {
    const provider = selectedProviderData;
    if (!provider) return;

    // Construct provider-specific URL with parameters
    const params = new URLSearchParams({
      amount: amount,
      currency: 'USD',
      targetCurrency: 'HKT',
      paymentMethod: selectedMethod,
      walletAddress: window.ethereum?.selectedAddress || ''
    });

    // Provider-specific URLs (these would be real integration URLs)
    const providerUrls = {
      transak: `https://global.transak.com/?${params}`,
      ramp: `https://app.ramp.network/?${params}`,
      moonpay: `https://buy.moonpay.com/?${params}`
    };

    const url = providerUrls[selectedProvider as keyof typeof providerUrls];
    if (url) {
      window.open(url, '_blank', 'width=400,height=600');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Buy HKT with USD
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter USD amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={selectedProviderData?.minAmount || 20}
              max={selectedProviderData?.maxAmount || 10000}
            />
            {selectedProviderData && (
              <p className="text-sm text-muted-foreground">
                Min: ${selectedProviderData.minAmount} - Max: ${selectedProviderData.maxAmount.toLocaleString()}
              </p>
            )}
          </div>

          {/* Conversion Display */}
          {estimatedHKT > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">You'll receive approximately:</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {estimatedHKT.toLocaleString()} HKT
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Rate: 1 HKT = ${hktPrice.toFixed(4)} USD
                </p>
              </CardContent>
            </Card>
          )}

          {/* Provider Selection */}
          <div className="space-y-3">
            <Label>Payment Provider</Label>
            <div className="grid gap-3">
              {fiatProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className={`cursor-pointer transition-colors ${
                    selectedProvider === provider.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{provider.name}</h3>
                            {provider.isRecommended && (
                              <Badge variant="secondary" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">Fee: {provider.fees}</p>
                          <p className="text-sm text-muted-foreground">Time: {provider.processingTime}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods
                  .filter(method => 
                    selectedProviderData?.supportedMethods.some(supported => 
                      supported.toLowerCase().includes(method.name.toLowerCase())
                    )
                  )
                  .map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <span>{method.icon}</span>
                        <span>{method.name}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your payment is processed securely by {selectedProviderData?.name}. 
              HKT tokens will be sent directly to your connected wallet.
            </AlertDescription>
          </Alert>

          {/* KYC Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Large purchases may require identity verification (KYC) as per regulatory requirements.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={openProviderInterface}
              disabled={!amount || parseFloat(amount) < (selectedProviderData?.minAmount || 20)}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Continue with {selectedProviderData?.name}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          {/* Process Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Processing time: {selectedProviderData?.processingTime}</span>
            </div>
            <div>
              Network fees may apply for token delivery to your wallet
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}