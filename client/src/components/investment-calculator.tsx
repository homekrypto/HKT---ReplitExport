import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

export default function InvestmentCalculator() {
  const [accumulationPeriod, setAccumulationPeriod] = useState(12);
  const [customPropertyValue, setCustomPropertyValue] = useState(200000);
  
  // Fixed property and token data based on specifications
  const totalShares = 52; // 52 weeks
  const currentHktPrice = 0.10; // $0.10 per HKT token

  // Property share calculation
  const calculatePropertyInvestment = () => {
    const valuePerShare = customPropertyValue / totalShares;
    const hktTokensNeeded = valuePerShare / currentHktPrice;
    const monthlyHktTokens = hktTokensNeeded / accumulationPeriod;
    const monthlyUsdInvestment = monthlyHktTokens * currentHktPrice;
    
    return {
      propertyValue: customPropertyValue,
      valuePerShare,
      totalHktNeeded: hktTokensNeeded,
      monthlyHktTokens,
      monthlyUsdInvestment,
      totalInvestmentPlan: monthlyUsdInvestment * accumulationPeriod
    };
  };

  const investment = calculatePropertyInvestment();

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl bg-white dark:bg-black border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white text-center justify-center">
              <Calculator className="h-6 w-6" />
              Property Share Calculator
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Calculate how to acquire 1 week of property ownership through HKT tokens
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Property Value ($)</Label>
                <Input
                  type="text"
                  value={customPropertyValue.toLocaleString('de-DE')}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value.replace(/\./g, ''));
                    if (!isNaN(numericValue)) {
                      setCustomPropertyValue(numericValue);
                    }
                  }}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Accumulation Period (months)</Label>
                <Input
                  type="number"
                  value={accumulationPeriod}
                  onChange={(e) => setAccumulationPeriod(Number(e.target.value))}
                  min="1"
                  max="60"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Value per Share (1 Week)</div>
                  <div className="text-2xl font-bold text-primary">
                    ${investment.valuePerShare.toLocaleString(undefined, {maximumFractionDigits: 2})}
                  </div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total HKT Tokens Needed</div>
                  <div className="text-2xl font-bold text-secondary">
                    {investment.totalHktNeeded.toLocaleString(undefined, {maximumFractionDigits: 1})} HKT
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Monthly HKT Purchase</div>
                  <div className="text-2xl font-bold text-green-600">
                    {investment.monthlyHktTokens.toLocaleString(undefined, {maximumFractionDigits: 0})} HKT
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Monthly USD Investment</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${investment.monthlyUsdInvestment.toLocaleString(undefined, {maximumFractionDigits: 2})}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                {accumulationPeriod}-Month Investment Plan Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 dark:text-blue-300">Property Value:</span>
                  <div className="font-semibold">${investment.propertyValue.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-300">Total Shares:</span>
                  <div className="font-semibold">{totalShares} weeks</div>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-300">Current HKT Price:</span>
                  <div className="font-semibold">${currentHktPrice.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-300">Total Investment:</span>
                  <div className="font-semibold">${investment.totalInvestmentPlan.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              * Calculations assume stable HKT price of $0.10. Actual token price may fluctuate.
              <br />
              This calculator is for illustrative purposes only and does not constitute financial advice.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}