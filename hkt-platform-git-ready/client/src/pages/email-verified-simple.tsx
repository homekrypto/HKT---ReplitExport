import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmailVerified() {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  
  const isSuccess = status === 'success';
  
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            isSuccess ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
          }`}>
            {isSuccess ? (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {isSuccess ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            {isSuccess 
              ? 'Your email has been successfully verified. You can now login to access all features.'
              : 'The verification link is invalid or has expired. Please try registering again.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {isSuccess ? (
              <Link href="/login">
                <Button className="w-full">
                  Continue to Login
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Register Again
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}