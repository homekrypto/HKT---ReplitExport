import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function VerifyEmail() {
  useScrollToTop();
  const [location] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const statusParam = urlParams.get('status');

    if (statusParam === 'success') {
      setStatus('success');
      setMessage('Your email has been successfully verified! You can now log in to your account.');
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      return;
    }

    // Verify the token
    fetch(`/api/verify-email?token=${token}`)
      .then(response => {
        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been successfully verified! You can now log in to your account.');
        } else {
          return response.json().then(data => {
            throw new Error(data.message || 'Verification failed');
          });
        }
      })
      .catch(error => {
        setStatus('error');
        setMessage(error.message || 'Verification failed. Please try again or contact support.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center mb-4">
              {status === 'loading' && <Loader className="h-8 w-8 text-blue-600 animate-spin" />}
              {status === 'success' && <CheckCircle className="h-8 w-8 text-green-600" />}
              {status === 'error' && <XCircle className="h-8 w-8 text-red-600" />}
            </CardTitle>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h1>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {message}
            </p>
            
            <div className="space-y-3">
              {status === 'success' && (
                <Link href="/login">
                  <Button className="w-full">
                    Go to Login
                  </Button>
                </Link>
              )}
              
              {status === 'error' && (
                <>
                  <Link href="/register">
                    <Button variant="outline" className="w-full">
                      Try Registration Again
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </>
              )}
              
              <Link href="/">
                <Button variant="ghost" className="w-full">
                  Return to Homepage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}