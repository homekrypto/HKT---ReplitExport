import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboarding } from '@/hooks/useOnboarding';
import { HelpCircle, Play, X } from 'lucide-react';
import { useState } from 'react';

interface OnboardingTriggerProps {
  variant?: 'banner' | 'card' | 'button';
  className?: string;
}

export default function OnboardingTrigger({ variant = 'card', className = '' }: OnboardingTriggerProps) {
  const { startOnboarding, hasCompletedOnboarding } = useOnboarding();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if user has completed onboarding or dismissed the prompt
  if (hasCompletedOnboarding() || isDismissed) {
    return null;
  }

  if (variant === 'button') {
    return (
      <Button
        onClick={startOnboarding}
        variant="outline"
        size="sm"
        className={className}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Take Platform Tour
      </Button>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                New to HKT? Take a quick tour!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn how to invest in real estate and maximize your returns.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={startOnboarding} size="sm">
              <Play className="h-4 w-4 mr-1" />
              Start Tour
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
            Welcome to HKT!
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Get started with a quick walkthrough of our platform features and learn how to maximize your investment returns.
        </p>
        <Button onClick={startOnboarding} className="w-full">
          <Play className="h-4 w-4 mr-2" />
          Start Platform Tour
        </Button>
      </CardContent>
    </Card>
  );
}