import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { web3Service, type Web3State } from '@/lib/web3';
import { 
  ArrowUpDown, 
  Wallet, 
  Settings, 
  Info,
  ExternalLink,
  RefreshCw,
  Zap
} from 'lucide-react';

const HKT_CONTRACT_ADDRESS = '0x0de50324B6960B15A5ceD3D076aE314ac174Da2e';
const USDC_CONTRACT_ADDRESS = '0xA0b86a33E6441e0D9d34adbdf9C0B44F50ABE84e'; // USDC on Ethereum
const WETH_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // WETH

interface SwapToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
}

interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  price: string;
  priceImpact: string;
  gas: string;
  protocols: string[];
}

export default function HKTSwapInterface() {
  const { toast } = useToast();
  const [web3State, setWeb3State] = useState<Web3State>(web3Service.getState());
  const [fromToken, setFromToken] = useState<SwapToken>({
    address: WETH_CONTRACT_ADDRESS,
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
  });
  const [toToken, setToToken] = useState<SwapToken>({
    address: HKT_CONTRACT_ADDRESS,
    symbol: 'HKT',
    name: 'Home Krypto Token',
    decimals: 18,
  });
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isSwapping, setIsSwapping] = useState(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);

  useEffect(() => {
    const unsubscribe = web3Service.subscribe(setWeb3State);
    return unsubscribe;
  }, []);

  const { data: hktStats } = useQuery({
    queryKey: ['/api/hkt-stats'],
    refetchInterval: 30000,
  });

  const popularTokens: SwapToken[] = [
    { address: WETH_CONTRACT_ADDRESS, symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    { address: USDC_CONTRACT_ADDRESS, symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    { address: HKT_CONTRACT_ADDRESS, symbol: 'HKT', name: 'Home Krypto Token', decimals: 18 },
  ];

  const handleConnectWallet = async () => {
    try {
      await web3Service.connectWallet();
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been connected successfully.',
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const fetchSwapQuote = async () => {
    if (!fromAmount || !web3State.isConnected) return;

    try {
      const response = await fetch('/api/swap/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromToken: fromToken.address,
          toToken: toToken.address,
          amount: fromAmount,
          slippage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }

      const quoteData = await response.json();
      setToAmount(quoteData.toAmount);
      
      const swapQuote: SwapQuote = {
        fromToken: quoteData.fromToken,
        toToken: quoteData.toToken,
        fromAmount: quoteData.fromAmount,
        toAmount: quoteData.toAmount,
        price: quoteData.price,
        priceImpact: quoteData.priceImpact,
        gas: quoteData.gas,
        protocols: quoteData.protocols,
      };
      
      setQuote(swapQuote);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      toast({
        title: 'Quote Failed',
        description: 'Failed to get swap quote. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSwap = async () => {
    if (!web3State.isConnected || !quote) {
      toast({
        title: 'Cannot Execute Swap',
        description: 'Please connect your wallet and get a quote first.',
        variant: 'destructive',
      });
      return;
    }

    setIsSwapping(true);
    
    try {
      const response = await fetch('/api/swap/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fromToken: fromToken.address,
          toToken: toToken.address,
          fromAmount,
          toAmount,
          slippage,
        }),
      });

      if (!response.ok) {
        throw new Error('Swap execution failed');
      }

      const result = await response.json();
      
      toast({
        title: 'Swap Successful!',
        description: `Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
      });
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      setQuote(null);
      
    } catch (error) {
      toast({
        title: 'Swap Failed',
        description: 'The swap transaction failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const handleTokenSwitch = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    
    setQuote(null);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setQuote(null);
    if (value && parseFloat(value) > 0) {
      fetchSwapQuote();
    } else {
      setToAmount('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          HKT Token Swap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!web3State.isConnected ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Wallet className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Connect your wallet to start swapping tokens
              </p>
            </div>
            <Button onClick={handleConnectWallet} className="w-full">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            {/* From Token */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">From</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Balance: {fromToken.balance || '0.00'}
                </span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {fromToken.symbol.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium">{fromToken.symbol}</div>
                    <div className="text-xs text-gray-500 truncate">{fromToken.name}</div>
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="text-right border-0 bg-transparent text-lg font-medium"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTokenSwitch}
                className="rounded-full w-10 h-10 p-0"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">To</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Balance: {toToken.balance || '0.00'}
                </span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {toToken.symbol.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium">{toToken.symbol}</div>
                    <div className="text-xs text-gray-500 truncate">{toToken.name}</div>
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="text-right border-0 bg-transparent text-lg font-medium"
                />
              </div>
            </div>

            {/* Quote Information */}
            {quote && (
              <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600 dark:text-blue-400">Exchange Rate</span>
                  <span className="font-medium">
                    1 {fromToken.symbol} = {parseFloat(quote.price).toFixed(6)} {toToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600 dark:text-blue-400">Price Impact</span>
                  <span className="font-medium text-green-600">{quote.priceImpact}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600 dark:text-blue-400">Network Fee</span>
                  <span className="font-medium">~{quote.gas} ETH</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <Info className="h-3 w-3" />
                  <span>Route: {quote.protocols.join(' → ')}</span>
                </div>
              </div>
            )}

            {/* Swap Settings */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Slippage Tolerance</span>
              </div>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-16 h-7 text-xs text-right"
                  step="0.1"
                  min="0.1"
                  max="50"
                />
                <span className="text-gray-600 dark:text-gray-300">%</span>
              </div>
            </div>

            {/* Swap Button */}
            <Button
              onClick={handleSwap}
              disabled={!fromAmount || !toAmount || isSwapping || !quote}
              className="w-full"
              size="lg"
            >
              {isSwapping ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Swapping...
                </>
              ) : !fromAmount ? (
                'Enter Amount'
              ) : !quote ? (
                'Get Quote'
              ) : (
                `Swap ${fromToken.symbol} for ${toToken.symbol}`
              )}
            </Button>

            {/* Popular Tokens */}
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">Quick Select</div>
              <div className="flex gap-2">
                {popularTokens.map((token) => (
                  <Badge
                    key={token.address}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      setFromToken(token);
                      setQuote(null);
                      setFromAmount('');
                      setToAmount('');
                    }}
                  >
                    {token.symbol}
                  </Badge>
                ))}
              </div>
            </div>

            {/* External Links */}
            <div className="flex justify-center pt-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                View on Uniswap
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}