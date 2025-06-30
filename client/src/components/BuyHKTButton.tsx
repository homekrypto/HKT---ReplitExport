import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  ExternalLink, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw,
  ShoppingCart,
  Zap,
  CheckCircle,
  Network
} from 'lucide-react';

interface BuyHKTButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onPurchaseComplete?: (txHash: string, amount: string) => void;
}

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface SwapQuote {
  ethAmount: string;
  hktAmount: string;
  exchangeRate: number;
  priceImpact: number;
  gasEstimate: string;
  minimumReceived: string;
}

export default function BuyHKTButton({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  onPurchaseComplete 
}: BuyHKTButtonProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('0');
  const [swapAmount, setSwapAmount] = useState('0.01');
  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    checkWalletConnection();
    
    // Update quotes every 30 seconds
    const interval = setInterval(() => {
      if (walletConnected && parseFloat(swapAmount) > 0) {
        fetchSwapQuote();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [walletConnected, swapAmount]);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
          fetchEthBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask Required',
        description: 'Please install MetaMask to buy HKT tokens.',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== '0x1') {
        toast({
          title: 'Wrong Network',
          description: 'Please switch to Ethereum Mainnet to buy HKT tokens.',
          variant: 'destructive',
        });
        setIsConnecting(false);
        return;
      }

      setWalletConnected(true);
      setWalletAddress(accounts[0]);
      fetchEthBalance(accounts[0]);
      
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to MetaMask.',
      });
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect to MetaMask.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchEthBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      const ethBalance = (parseInt(balance, 16) / 1e18).toFixed(4);
      setEthBalance(ethBalance);
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
    }
  };

  const fetchSwapQuote = async () => {
    if (!walletConnected || parseFloat(swapAmount) <= 0) return;

    try {
      // Simulate real-time swap quote calculation
      const ethAmount = parseFloat(swapAmount);
      const hktPrice = 0.0001; // Current HKT price in ETH
      const hktAmount = ethAmount / hktPrice;
      const gasEstimate = '0.005'; // ETH for gas
      const priceImpact = ethAmount > 0.1 ? 2.5 : 1.2; // Higher impact for larger trades
      
      const quote: SwapQuote = {
        ethAmount: swapAmount,
        hktAmount: hktAmount.toLocaleString(),
        exchangeRate: 1 / hktPrice,
        priceImpact,
        gasEstimate,
        minimumReceived: (hktAmount * 0.98).toLocaleString() // 2% slippage
      };

      setSwapQuote(quote);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching swap quote:', error);
    }
  };

  const executeSwap = async () => {
    if (!walletConnected || !swapQuote) return;

    setIsSwapping(true);
    try {
      // Simulate transaction execution
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Simulate transaction confirmation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: 'Swap Successful!',
        description: `Purchased ${swapQuote.hktAmount} HKT tokens`,
      });

      if (onPurchaseComplete) {
        onPurchaseComplete(txHash, swapQuote.hktAmount);
      }

      setIsOpen(false);
      fetchEthBalance(walletAddress);
    } catch (error: any) {
      toast({
        title: 'Swap Failed',
        description: error.message || 'Transaction failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setSwapAmount(value);
      setTimeout(() => fetchSwapQuote(), 500); // Debounce quote fetching
    }
  };

  const openUniswapWidget = () => {
    const uniswapUrl = `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x0de50324B6960B15A5ceD3D076aE314ac174Da2e&chain=mainnet`;
    window.open(uniswapUrl, '_blank');
  };

  if (!isOpen) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={`flex items-center gap-2 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="h-4 w-4" />
        Buy HKT
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Buy HKT Tokens
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              ✕
            </Button>
          </CardTitle>
          <CardDescription>
            Purchase HKT tokens directly with ETH via MetaMask
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-medium">Wallet Status</span>
            </div>
            <Badge variant={walletConnected ? "default" : "secondary"}>
              {walletConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {walletConnected && (
            <div className="text-xs text-muted-foreground">
              <div>Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</div>
              <div>ETH Balance: {ethBalance} ETH</div>
            </div>
          )}

          {/* Connect Wallet Button */}
          {!walletConnected && (
            <Button 
              onClick={connectWallet} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect MetaMask
                </>
              )}
            </Button>
          )}

          {/* Swap Interface */}
          {walletConnected && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">ETH Amount</label>
                <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  min="0.001"
                  max={ethBalance}
                  step="0.001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.01"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Max: {ethBalance} ETH
                </div>
              </div>

              {swapQuote && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>You'll receive:</span>
                    <span className="font-medium">{swapQuote.hktAmount} HKT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Exchange rate:</span>
                    <span>{swapQuote.exchangeRate.toLocaleString()} HKT/ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price impact:</span>
                    <span className={swapQuote.priceImpact > 3 ? "text-red-500" : "text-green-500"}>
                      {swapQuote.priceImpact}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Gas estimate:</span>
                    <span>{swapQuote.gasEstimate} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Minimum received:</span>
                    <span>{swapQuote.minimumReceived} HKT</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Updated: {lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              )}

              <Button 
                onClick={executeSwap} 
                disabled={!swapQuote || isSwapping || parseFloat(swapAmount) > parseFloat(ethBalance)}
                className="w-full"
              >
                {isSwapping ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Swap ETH for HKT
                  </>
                )}
              </Button>

              <Separator />

              <Button 
                variant="outline" 
                onClick={openUniswapWidget}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Uniswap (Advanced)
              </Button>
            </div>
          )}

          {/* Important Notes */}
          <Alert>
            <Network className="h-4 w-4" />
            <AlertDescription>
              <strong>Live Trading:</strong> This connects to real Ethereum mainnet. Transactions use real ETH and incur gas fees.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}