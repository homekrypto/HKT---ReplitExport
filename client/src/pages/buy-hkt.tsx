import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { web3Service, type Web3State } from '@/lib/web3';
import ProtectedRoute from '@/components/protected-route';
import { 
  Wallet, 
  DollarSign, 
  CreditCard,
  Shield,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Info
} from 'lucide-react';

export default function BuyHKT() {
  const [web3State, setWeb3State] = useState<Web3State>(web3Service.getState());
  const [purchaseAmount, setPurchaseAmount] = useState(106.83);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const unsubscribe = web3Service.subscribe(setWeb3State);
    return unsubscribe;
  }, []);

  const { data: hktStats } = useQuery({
    queryKey: ['/api/hkt-stats'],
    refetchInterval: 30000,
  });

  const handleConnectWallet = async () => {
    if (web3State.isConnected) return;
    
    setIsConnecting(true);
    try {
      await web3Service.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const currentPrice = hktStats?.currentPrice || '0.152';
  const estimatedTokens = purchaseAmount / parseFloat(currentPrice);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Buy HKT Tokens
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Invest in real estate through blockchain technology. Start building your property portfolio today.
            </p>
          </div>

          {/* Current Price Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${currentPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
                  <p className="text-2xl font-bold text-green-600">+{hktStats?.priceChange24h || '2.34'}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${(hktStats?.marketCap || 15420000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Volume</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${(hktStats?.volume24h || 234500).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Purchase Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Purchase HKT Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="instant" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="instant">Instant Buy</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly Plan</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="instant" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Investment Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                        min="10"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-semibold">${purchaseAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HKT Price:</span>
                        <span className="font-semibold">${currentPrice}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>You'll receive:</span>
                        <span className="font-bold text-primary">{estimatedTokens.toFixed(2)} HKT</span>
                      </div>
                    </div>

                    {!web3State.isConnected ? (
                      <Button 
                        onClick={handleConnectWallet}
                        disabled={isConnecting}
                        className="w-full"
                        size="lg"
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        {isConnecting ? 'Connecting...' : 'Connect Wallet to Continue'}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Wallet connected: {web3Service.formatAddress(web3State.address!)}
                          </AlertDescription>
                        </Alert>
                        <Button className="w-full" size="lg">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Purchase HKT Tokens
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="monthly" className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Set up automatic monthly investments starting at $106.83/month
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {[106.83, 213.66, 320.49].map((amount) => (
                          <Button
                            key={amount}
                            variant={purchaseAmount === amount ? "default" : "outline"}
                            onClick={() => setPurchaseAmount(amount)}
                            className="text-sm"
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">36-Month Projection</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Total Investment:</span>
                            <span>${(purchaseAmount * 36).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Projected Value:</span>
                            <span className="text-green-600 font-semibold">
                              ${(purchaseAmount * 36 * 1.15).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated ROI:</span>
                            <span className="text-green-600 font-semibold">15%</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full" size="lg">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Set Up Monthly Investment
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Information Panel */}
            <div className="space-y-6">
              {/* Security Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Security & Trust
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Blockchain Transparency</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        All transactions are recorded on the blockchain for full transparency
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Smart Contract Security</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Audited smart contracts ensure secure and automated transactions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Real Estate Backing</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Every token is backed by real, income-generating properties
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Investment Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low Entry Point</span>
                      <Badge variant="secondary">From $10</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Expected Annual Return</span>
                      <Badge variant="secondary">15%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Liquidity</span>
                      <Badge variant="secondary">24/7 Trading</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Diversification</span>
                      <Badge variant="secondary">Multiple Properties</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-primary to-secondary text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Start Your Journey</h3>
                  <p className="mb-4 opacity-90">
                    Join thousands of investors building wealth through real estate
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-white text-secondary hover:bg-gray-100 font-bold"
                  >
                    Get Started Today
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}