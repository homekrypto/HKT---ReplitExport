import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimpleSwapInterface from './simple-swap-interface';
import { useToast } from '@/hooks/use-toast';
import { 
  ExternalLink, 
  Shield, 
  Zap, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function TokenPurchaseSection() {
  const { toast } = useToast();
  const [recentTransaction, setRecentTransaction] = useState<string | null>(null);

  const handleTransactionComplete = (txHash: string) => {
    setRecentTransaction(txHash);
    toast({
      title: 'Transaction Submitted',
      description: 'Your HKT token purchase has been submitted to the blockchain.',
    });
  };

  const openEtherscan = (txHash: string) => {
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Purchase HKT Tokens
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Buy HKT tokens directly through Uniswap. Start building your real estate portfolio 
          with transparent, blockchain-based investments.
        </p>
      </div>

      {/* Token Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">Secure Trading</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Powered by Uniswap's decentralized exchange protocol
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">Instant Liquidity</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Trade HKT tokens 24/7 with deep liquidity pools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">Real Estate Backed</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Each token represents fractional ownership in premium properties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Uniswap Widget */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Buy HKT Tokens</span>
                <Badge variant="secondary" className="flex items-center">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Uniswap V3
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="widget" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="widget">Swap Interface</TabsTrigger>
                  <TabsTrigger value="info">Trading Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="widget" className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Connect your MetaMask wallet to start trading. Ensure you have ETH for gas fees.
                    </AlertDescription>
                  </Alert>
                  
                  <SimpleSwapInterface onTransactionComplete={handleTransactionComplete} />
                  
                  {recentTransaction && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <span>Transaction submitted successfully!</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEtherscan(recentTransaction)}
                        >
                          View on Etherscan
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
                
                <TabsContent value="info" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Contract Address</h4>
                        <p className="text-sm font-mono text-gray-600 dark:text-gray-300 break-all">
                          0x1234...7890
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Trading Pair</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          HKT/USDC
                        </p>
                      </div>
                    </div>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Important:</strong> Always verify the contract address before trading. 
                        Only trade on official Uniswap interfaces.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Trading Tips:</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Set appropriate slippage tolerance (1-3% recommended)</li>
                        <li>• Check gas fees before confirming transactions</li>
                        <li>• Consider market conditions and liquidity</li>
                        <li>• Keep some ETH for future transactions</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Token Stats */}
          <Card>
            <CardHeader>
              <CardTitle>HKT Token Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Current Price:</span>
                <span className="font-semibold">$0.152</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">24h Change:</span>
                <span className="font-semibold text-green-600">+2.34%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Market Cap:</span>
                <span className="font-semibold">$15.4M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Supply:</span>
                <span className="font-semibold">100M HKT</span>
              </div>
            </CardContent>
          </Card>

          {/* Investment Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Why Buy HKT?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Real Estate Exposure</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Fractional ownership in premium properties
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Passive Income</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Earn from rental yields and appreciation
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Liquidity</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Trade anytime on decentralized exchanges
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Links */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Trading Guide
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Uniswap Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}