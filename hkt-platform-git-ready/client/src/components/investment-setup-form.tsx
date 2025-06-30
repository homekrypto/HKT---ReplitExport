import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';

const investmentSetupSchema = z.object({
  monthlyAmount: z.number().min(10, 'Minimum monthly investment is $10').max(10000, 'Maximum monthly investment is $10,000'),
  initialInvestment: z.number().min(0, 'Initial investment cannot be negative').max(100000, 'Maximum initial investment is $100,000').optional(),
  monthsInvested: z.number().min(0, 'Months invested cannot be negative').max(120, 'Maximum 120 months'),
});

type InvestmentSetupForm = z.infer<typeof investmentSetupSchema>;

interface InvestmentSetupFormProps {
  onSuccess: () => void;
}

export default function InvestmentSetupForm({ onSuccess }: InvestmentSetupFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<InvestmentSetupForm>({
    resolver: zodResolver(investmentSetupSchema),
    defaultValues: {
      monthlyAmount: 106.83,
      initialInvestment: 0,
      monthsInvested: 0,
    },
  });

  const createInvestmentMutation = useMutation({
    mutationFn: async (data: InvestmentSetupForm & { userId: number; totalInvested: number; totalTokens: number }) => {
      return apiRequest('/api/investments/create', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Investment Setup Complete',
        description: 'Your investment tracking has been initialized successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/investments/user'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Setup Failed',
        description: error?.message || 'Failed to set up investment tracking',
        variant: 'destructive',
      });
    },
  });

  const calculateTokensFromInvestment = (monthlyAmount: number, monthsInvested: number, initialInvestment: number = 0) => {
    const initialPrice = 0.10;
    const annualGrowth = 0.15;
    
    let totalTokens = 0;
    let totalInvested = initialInvestment;
    
    // Add initial investment tokens
    if (initialInvestment > 0) {
      totalTokens += initialInvestment / initialPrice;
    }
    
    // Calculate tokens from monthly investments
    for (let month = 1; month <= monthsInvested; month++) {
      const currentPrice = initialPrice * Math.pow(1 + annualGrowth, (month - 1) / 12);
      const tokensThisMonth = monthlyAmount / currentPrice;
      totalTokens += tokensThisMonth;
      totalInvested += monthlyAmount;
    }
    
    return { totalTokens, totalInvested };
  };

  const onSubmit = async (data: InvestmentSetupForm) => {
    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to set up your investment.',
        variant: 'destructive',
      });
      return;
    }

    setIsCalculating(true);
    
    try {
      const { totalTokens, totalInvested } = calculateTokensFromInvestment(
        data.monthlyAmount,
        data.monthsInvested,
        data.initialInvestment || 0
      );

      await createInvestmentMutation.mutateAsync({
        ...data,
        userId: user.id,
        totalInvested,
        totalTokens,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set Up Your Investment</CardTitle>
        <CardDescription>
          Initialize your HKT investment tracking with your current or planned investment details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="monthlyAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Investment Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="106.83"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialInvestment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Investment ($) - Optional</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthsInvested"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Months Already Invested</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={createInvestmentMutation.isPending || isCalculating}
            >
              {createInvestmentMutation.isPending || isCalculating ? 'Setting Up...' : 'Start Tracking Investment'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}