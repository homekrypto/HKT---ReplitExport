import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocation } from 'wouter';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function EmailVerified() {
  const [location, setLocation] = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const verified = urlParams.get('verified');

    if (verified === 'true') {
      setVerificationStatus('success');
      setMessage('Your email has been verified successfully!');
      return;
    }

    if (!token) {
      setVerificationStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
      return;
    }

    // Verify the token with the server
    fetch(`/verify-email?token=${token}`)
      .then(response => {
        if (response.ok) {
          setVerificationStatus('success');
          setMessage('Your email has been verified successfully!');
          // Redirect to login after showing success
          setTimeout(() => {
            setLocation('/login?verified=true');
          }, 3000);
        } else {
          setVerificationStatus('error');
          setMessage('Verification failed. The link may be expired or invalid.');
        }
      })
      .catch(() => {
        setVerificationStatus('error');
        setMessage('Verification failed. Please try again or contact support.');
      });
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {verificationStatus === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <p className="text-gray-600 dark:text-gray-300">
                Verifying your email address...
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {message}
                </AlertDescription>
              </Alert>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You can now access all features of your HKT account, including:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Investment dashboard and portfolio tracking</li>
                  <li>• HKT token purchases through Uniswap</li>
                  <li>• Real estate investment opportunities</li>
                  <li>• Monthly investment plans</li>
                </ul>
                <Button 
                  onClick={() => setLocation('/login')}
                  className="w-full mt-4"
                >
                  Continue to Login
                </Button>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Need help? Contact our support team or try registering again.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/register')}
                    className="flex-1"
                  >
                    Register Again
                  </Button>
                  <Button 
                    onClick={() => setLocation('/login')}
                    className="flex-1"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}