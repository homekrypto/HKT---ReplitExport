import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowUpDown, 
  Settings, 
  Info, 
  ExternalLink, 
  Zap, 
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUri: string;
  balance?: string;
}

interface SwapQuote {
  inputAmount: string;
  outputAmount: string;
  price: number;
  priceImpact: number;
  minimumReceived: string;
  gasEstimate: string;
  route: string[];
}

interface DEXSwapWidgetProps {
  defaultInputToken?: string;
  defaultOutputToken?: string;
  onSwapSuccess?: (txHash: string) => void;
}

export default function DEXSwapWidget({ 
  defaultInputToken = 'ETH', 
  defaultOutputToken = 'HKT',
  onSwapSuccess 
}: DEXSwapWidgetProps) {
  const [inputToken, setInputToken] = useState<Token | null>(null);
  const [outputToken, setOutputToken] = useState<Token | null>(null);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Popular tokens for the swap interface
  const tokens: Token[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logoUri: '⚡',
      balance: '1.2534'
    },
    {
      symbol: 'HKT',
      name: 'Home Krypto Token',
      address: '0x0de50324B6960B15A5ceD3D076aE314ac174Da2e',
      decimals: 18,
      logoUri: '🏠',
      balance: '50,000'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xA0b86a33E6441f8c8b0f5c87e3b19bb7e5a5a4b1',
      decimals: 6,
      logoUri: '💵',
      balance: '1,250.00'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      logoUri: '💰',
      balance: '850.50'
    }
  ];

  useEffect(() => {
    // Set default tokens
    const defaultInput = tokens.find(t => t.symbol === defaultInputToken);
    const defaultOutput = tokens.find(t => t.symbol === defaultOutputToken);
    
    if (defaultInput) setInputToken(defaultInput);
    if (defaultOutput) setOutputToken(defaultOutput);
  }, [defaultInputToken, defaultOutputToken]);

  useEffect(() => {
    // Get quote when input amount changes
    if (inputAmount && inputToken && outputToken && parseFloat(inputAmount) > 0) {
      fetchQuote();
    } else {
      setOutputAmount('');
      setQuote(null);
    }
  }, [inputAmount, inputToken, outputToken, slippage]);

  const fetchQuote = async () => {
    if (!inputToken || !outputToken || !inputAmount) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to DEX aggregator (0x API, 1inch, etc.)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock quote calculation
      const inputAmountNum = parseFloat(inputAmount);
      let rate = 1;
      
      // Simulate different exchange rates
      if (inputToken.symbol === 'ETH' && outputToken.symbol === 'HKT') {
        rate = 35000; // 1 ETH = 35,000 HKT (at $0.10 per HKT, $3,500 ETH)
      } else if (inputToken.symbol === 'HKT' && outputToken.symbol === 'ETH') {
        rate = 1 / 35000;
      } else if (inputToken.symbol === 'USDC' && outputToken.symbol === 'HKT') {
        rate = 10; // 1 USDC = 10 HKT
      } else if (inputToken.symbol === 'HKT' && outputToken.symbol === 'USDC') {
        rate = 0.1; // 1 HKT = 0.1 USDC
      }

      const outputAmountNum = inputAmountNum * rate;
      const priceImpact = inputAmountNum > 1000 ? 0.3 : 0.1; // Higher impact for larger trades
      const minimumReceived = outputAmountNum * (1 - slippage / 100);

      const mockQuote: SwapQuote = {
        inputAmount: inputAmount,
        outputAmount: outputAmountNum.toFixed(6),
        price: rate,
        priceImpact,
        minimumReceived: minimumReceived.toFixed(6),
        gasEstimate: '0.008',
        route: [inputToken.symbol, outputToken.symbol]
      };

      setQuote(mockQuote);
      setOutputAmount(mockQuote.outputAmount);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quote');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!quote || !inputToken || !outputToken) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate swap transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock successful transaction
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      if (onSwapSuccess) {
        onSwapSuccess(mockTxHash);
      }

      // Reset form
      setInputAmount('');
      setOutputAmount('');
      setQuote(null);
    } catch (err: any) {
      setError(err.message || 'Swap failed');
    } finally {
      setIsLoading(false);
    }
  };

  const switchTokens = () => {
    const tempToken = inputToken;
    setInputToken(outputToken);
    setOutputToken(tempToken);
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
  };

  const setMaxInput = () => {
    if (inputToken?.balance) {
      const balance = parseFloat(inputToken.balance.replace(/,/g, ''));
      setInputAmount(balance.toString());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Swap Tokens
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Exchange tokens at the best available rates
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Settings Panel */}
        {showSettings && (
          <Card className="p-4 bg-gray-50 dark:bg-gray-800">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Slippage Tolerance</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Slider
                    value={[slippage]}
                    onValueChange={(value) => setSlippage(value[0])}
                    max={5}
                    min={0.1}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-12">{slippage}%</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Input Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>From</Label>
            {inputToken?.balance && (
              <button
                onClick={setMaxInput}
                className="text-xs text-blue-600 hover:underline"
              >
                Balance: {inputToken.balance} {inputToken.symbol}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Select value={inputToken?.symbol} onValueChange={(symbol) => {
              const token = tokens.find(t => t.symbol === symbol);
              setInputToken(token || null);
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center gap-2">
                      <span>{token.logoUri}</span>
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.0"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Swap Direction */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={switchTokens}
            disabled={isLoading}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Output Token */}
        <div className="space-y-2">
          <Label>To</Label>
          <div className="flex gap-2">
            <Select value={outputToken?.symbol} onValueChange={(symbol) => {
              const token = tokens.find(t => t.symbol === symbol);
              setOutputToken(token || null);
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center gap-2">
                      <span>{token.logoUri}</span>
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.0"
              value={outputAmount}
              disabled
              className="flex-1"
            />
          </div>
        </div>

        {/* Quote Information */}
        {quote && (
          <Card className="p-3 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Rate:</span>
                <span>1 {inputToken?.symbol} = {quote.price.toLocaleString()} {outputToken?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span>Price Impact:</span>
                <span className={quote.priceImpact > 1 ? 'text-orange-600' : 'text-green-600'}>
                  {quote.priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Minimum Received:</span>
                <span>{quote.minimumReceived} {outputToken?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span>Network Fee:</span>
                <span>~{quote.gasEstimate} ETH</span>
              </div>
            </div>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!quote || isLoading || !inputAmount || parseFloat(inputAmount) <= 0}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              {quote ? 'Swapping...' : 'Getting Quote...'}
            </div>
          ) : (
            'Swap Tokens'
          )}
        </Button>

        {/* Powered By */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          <span>Powered by 0x Protocol & Uniswap</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  );
}