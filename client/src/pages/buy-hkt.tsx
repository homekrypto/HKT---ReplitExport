import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Info } from 'lucide-react';
import { web3Service } from '@/lib/web3';
import { HKT_CONFIG, INVESTMENT_PLAN_DATA } from '@/lib/constants';

export default function BuyHKT() {
  const [selectedPlan, setSelectedPlan] = useState('default');
  const [ethAmount, setEthAmount] = useState('');
  const [estimatedTokens, setEstimatedTokens] = useState(0);

  const handleEthAmountChange = (value: string) => {
    setEthAmount(value);
    if (value) {
      // Mock ETH to USD conversion (assuming 1 ETH = $2500)
      const ethToUsd = parseFloat(value) * 2500;
      const tokens = ethToUsd / HKT_CONFIG.INITIAL_PRICE;
      setEstimatedTokens(tokens);
    } else {
      setEstimatedTokens(0);
    }
  };

  const handlePurchaseHKT = () => {
    alert('Purchase functionality will integrate with smart contract. Please connect your wallet first.');
  };

  const handleOpenUniswap = () => {
    window.open(web3Service.getUniswapUrl(), '_blank');
  };

  const investmentSummary = [
    { label: 'Monthly Investment:', value: '$106.83' },
    { label: 'Investment Period:', value: '36 months' },
    { label: 'Total Investment:', value: `$${INVESTMENT_PLAN_DATA.totalInvested.toLocaleString()}`, highlight: 'text-accent' },
    { label: 'Expected HKT Tokens:', value: `${INVESTMENT_PLAN_DATA.totalHktAccumulated.toLocaleString()} HKT`, highlight: 'text-secondary' },
  ];

  const projectedReturns = [
    { label: 'Projected Final Value:', value: `$${INVESTMENT_PLAN_DATA.finalPortfolioValue.toLocaleString()}`, bgColor: 'bg-green-900 bg-opacity-50', textColor: 'text-green-400' },
    { label: 'Expected Profit:', value: `$${INVESTMENT_PLAN_DATA.totalProfit.toLocaleString()} (${INVESTMENT_PLAN_DATA.roi}%)`, bgColor: 'bg-yellow-900 bg-opacity-50', textColor: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Buy HKT Tokens</h1>
          <p className="text-xl text-gray-300">Start your property investment journey today</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Quick Purchase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium mb-2 text-white">Investment Plan</Label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">$3,846 Plan - $106.83/month (36 months)</SelectItem>
                      <SelectItem value="custom">Custom Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium mb-2 text-white">ETH Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={ethAmount}
                    onChange={(e) => handleEthAmountChange(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">You'll receive approximately:</span>
                    <span className="font-bold text-white">{estimatedTokens.toLocaleString()} HKT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current HKT Price:</span>
                    <span className="font-bold text-accent">${HKT_CONFIG.INITIAL_PRICE.toFixed(3)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={handlePurchaseHKT}
                  className="w-full bg-accent hover:bg-yellow-500 text-gray-900 font-bold text-lg"
                >
                  Purchase HKT Tokens
                </Button>
              </CardContent>
            </Card>

            <Alert className="bg-blue-900 bg-opacity-50 border-blue-600">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-100">
                <h4 className="font-bold mb-2">How to Buy on Uniswap</h4>
                <ol className="space-y-1 text-sm">
                  <li>1. Install MetaMask and fund with ETH</li>
                  <li>2. Visit Uniswap and connect your wallet</li>
                  <li>3. Swap ETH for HKT tokens</li>
                  <li>4. Confirm transaction in MetaMask</li>
                </ol>
                <Button
                  onClick={handleOpenUniswap}
                  className="mt-3 bg-primary hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Uniswap
                </Button>
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-6">
            <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investmentSummary.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">{item.label}</span>
                      <span className={`font-bold ${item.highlight || 'text-white'}`}>{item.value}</span>
                    </div>
                  ))}
                  
                  {projectedReturns.map((item, index) => (
                    <div key={index} className={`flex justify-between items-center py-3 ${item.bgColor} rounded-lg px-4`}>
                      <span className={item.textColor.replace('text-', 'text-').replace('-400', '-200')}>{item.label}</span>
                      <span className={`font-bold ${item.textColor} text-xl`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-secondary to-green-600 border-0">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold mb-2 text-white">Ready to Start?</h4>
                <p className="text-green-100 mb-4">Join thousands of investors building wealth through blockchain real estate</p>
                <Button
                  onClick={handlePurchaseHKT}
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
  );
}
