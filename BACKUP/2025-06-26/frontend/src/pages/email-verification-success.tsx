import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function EmailVerificationSuccess() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/login';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600 dark:text-green-400">
            Email Verified Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            Your email has been verified successfully. You can now log in to your HKT account and start investing in real estate.
          </p>
          
          <div className="space-y-4">
            <Link href="/login">
              <Button className="w-full">
                Go to Login
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to login in {countdown} seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}