import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';

interface CalculationResult {
  totalInvested: number;
  finalPrice: number;
  totalTokens: number;
  finalValue: number;
  profit: number;
  roi: number;
  monthlyAmount: number;
  months: number;
}

export default function InvestmentCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(106.83);
  const [months, setMonths] = useState(36);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { t } = useApp();

  const calculateMutation = useMutation({
    mutationFn: async (data: { monthlyAmount: number; months: number }) => {
      const response = await apiRequest('POST', '/api/calculate-investment', data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleCalculate = () => {
    calculateMutation.mutate({ monthlyAmount, months });
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl bg-white dark:bg-black border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white text-center">{t.calculator.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t.calculator.monthlyInvestment}</Label>
              <Input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                placeholder="Enter amount"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t.calculator.investmentPeriod}</Label>
              <Select value={months.toString()} onValueChange={(value) => setMonths(Number(value))}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 months</SelectItem>
              <SelectItem value="36">36 months</SelectItem>
              <SelectItem value="48">48 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

            <Button
              onClick={handleCalculate}
              disabled={calculateMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3"
            >
              {calculateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.calculator.calculating}
                </>
              ) : (
                t.calculator.calculate
              )}
            </Button>

            {result && (
              <div className="mt-6 space-y-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between text-gray-900 dark:text-white">
                  <span>{t.calculator.totalInvestment}</span>
                  <span className="font-bold">${result.totalInvested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-900 dark:text-white">
                  <span>{t.calculator.finalValue}</span>
                  <span className="font-bold text-secondary">${result.finalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-900 dark:text-white">
                  <span>{t.calculator.totalProfit}</span>
                  <span className="font-bold text-accent">${result.profit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-900 dark:text-white">
                  <span>{t.calculator.roi}</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{result.roi.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-gray-900 dark:text-white">
                  <span>{t.calculator.hktTokens}</span>
                  <span className="font-bold">{result.totalTokens.toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
