import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { web3Service, type Web3State } from '@/lib/web3';
import { 
  Wallet, 
  ExternalLink, 
  ArrowUpDown, 
  Info, 
  CheckCircle 
} from 'lucide-react';

interface SimpleSwapInterfaceProps {
  onTransactionComplete?: (txHash: string) => void;
}

export default function SimpleSwapInterface({ onTransactionComplete }: SimpleSwapInterfaceProps) {
  const [web3State, setWeb3State] = useState<Web3State>(web3Service.getState());
  const [usdcAmount, setUsdcAmount] = useState('100');
  const [hktAmount, setHktAmount] = useState('657.89');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = web3Service.subscribe(setWeb3State);
    return unsubscribe;
  }, []);

  // Mock HKT price calculation (in real implementation, fetch from API)
  const hktPrice = 0.152;
  
  const handleUsdcChange = (value: string) => {
    setUsdcAmount(value);
    const numValue = parseFloat(value) || 0;
    setHktAmount((numValue / hktPrice).toFixed(2));
  };

  const handleHktChange = (value: string) => {
    setHktAmount(value);
    const numValue = parseFloat(value) || 0;
    setUsdcAmount((numValue * hktPrice).toFixed(2));
  };

  const handleConnectWallet = async () => {
    if (web3State.isConnected) return;
    
    setIsConnecting(true);
    try {
      await web3Service.connectWallet();
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to MetaMask',
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwap = async () => {
    if (!web3State.isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    setIsSwapping(true);
    try {
      // Mock transaction simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      toast({
        title: 'Transaction Submitted',
        description: 'Your HKT purchase is being processed',
      });
      
      if (onTransactionComplete) {
        onTransactionComplete(mockTxHash);
      }
    } catch (error) {
      toast({
        title: 'Transaction Failed',
        description: 'Failed to complete swap. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const openUniswap = () => {
    const uniswapUrl = `https://app.uniswap.org/#/swap?inputCurrency=${USDC_ADDRESS}&outputCurrency=${HKT_TOKEN_ADDRESS}`;
    window.open(uniswapUrl, '_blank');
  };

  // Mock addresses for display
  const USDC_ADDRESS = '0xA0b86a33E6417c5c5aAB3297e6B26F21F3B42dBb';
  const HKT_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Swap Tokens</span>
          <Badge variant="outline" className="flex items-center">
            <ExternalLink className="h-3 w-3 mr-1" />
            Uniswap
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Token */}
        <div className="space-y-3">
          <Label>From</Label>
          <div className="relative">
            <Input
              type="number"
              value={usdcAmount}
              onChange={(e) => handleUsdcChange(e.target.value)}
              placeholder="0.00"
              className="pr-20"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              <Badge variant="secondary">USDC</Badge>
            </div>
          </div>
          <p className="text-xs text-gray-500">≈ ${usdcAmount} USD</p>
        </div>

        {/* Swap Direction */}
        <div className="flex justify-center">
          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* To Token */}
        <div className="space-y-3">
          <Label>To</Label>
          <div className="relative">
            <Input
              type="number"
              value={hktAmount}
              onChange={(e) => handleHktChange(e.target.value)}
              placeholder="0.00"
              className="pr-20"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary">HKT</Badge>
            </div>
          </div>
          <p className="text-xs text-gray-500">≈ ${(parseFloat(hktAmount) * hktPrice).toFixed(2)} USD</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Rate:</span>
            <span>1 HKT = ${hktPrice} USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Network:</span>
            <span>Ethereum</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Est. Gas:</span>
            <span>~$12-25</span>
          </div>
        </div>

        {/* Wallet Connection & Swap Button */}
        {!web3State.isConnected ? (
          <Button 
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        ) : (
          <div className="space-y-3">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Wallet: {web3Service.formatAddress(web3State.address!)}
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleSwap}
              disabled={isSwapping || !usdcAmount || parseFloat(usdcAmount) <= 0}
              className="w-full"
              size="lg"
            >
              {isSwapping ? 'Swapping...' : `Swap ${usdcAmount} USDC for ${hktAmount} HKT`}
            </Button>
          </div>
        )}

        {/* External Uniswap Link */}
        <div className="pt-4 border-t">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm">Trade on Uniswap directly for best rates</span>
              <Button
                size="sm"
                variant="outline"
                onClick={openUniswap}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Uniswap
              </Button>
            </AlertDescription>
          </Alert>
        </div>

        {/* Token Addresses */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>HKT Contract:</span>
            <span className="font-mono">{HKT_TOKEN_ADDRESS.slice(0, 6)}...{HKT_TOKEN_ADDRESS.slice(-4)}</span>
          </div>
          <div className="flex justify-between">
            <span>USDC Contract:</span>
            <span className="font-mono">{USDC_ADDRESS.slice(0, 6)}...{USDC_ADDRESS.slice(-4)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}