import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
    <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Investment Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="block text-sm font-medium mb-2 text-white">Monthly Investment</Label>
          <Input
            type="number"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(Number(e.target.value))}
            className="bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-gray-300"
            placeholder="Enter amount"
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium mb-2 text-white">Investment Period</Label>
          <Select value={months.toString()} onValueChange={(value) => setMonths(Number(value))}>
            <SelectTrigger className="bg-white bg-opacity-20 border-white border-opacity-30 text-white">
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
          className="w-full bg-secondary hover:bg-green-600 text-white font-semibold"
        >
          {calculateMutation.isPending ? 'Calculating...' : 'Calculate Returns'}
        </Button>

        {result && (
          <div className="mt-6 space-y-3 p-4 bg-white bg-opacity-10 rounded-lg">
            <div className="flex justify-between text-white">
              <span>Total Investment:</span>
              <span className="font-bold">${result.totalInvested.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Final Value:</span>
              <span className="font-bold text-secondary">${result.finalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Profit:</span>
              <span className="font-bold text-accent">${result.profit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>ROI:</span>
              <span className="font-bold text-green-400">{result.roi.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-white">
              <span>HKT Tokens:</span>
              <span className="font-bold">{result.totalTokens.toLocaleString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
