import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const [location] = useLocation();
  const [status, setStatus] = useState<string>('loading');
  const [message, setMessage] = useState<string>('Verifying your email...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    const token = urlParams.get('token');

    if (statusParam) {
      setStatus(statusParam);
      switch (statusParam) {
        case 'success':
          setMessage('Email verified successfully! You can now log in.');
          break;
        case 'already-verified':
          setMessage('This email has already been verified. You can log in now.');
          break;
        case 'expired':
          setMessage('Verification token has expired. Please request a new verification email.');
          break;
        case 'invalid':
          setMessage('Invalid verification token. Please check your email and try again.');
          break;
        case 'error':
          setMessage('Email verification failed. Please try again.');
          break;
        default:
          setMessage('Unknown verification status.');
      }
    } else if (token) {
      // If token is in URL, verify it
      verifyToken(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [location]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`/verify-email/${token}`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Email verification failed. Please try again.');
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'success':
      case 'already-verified':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'expired':
      case 'invalid':
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'loading':
        return <Clock className="h-16 w-16 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-16 w-16 text-yellow-500" />;
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'success':
      case 'already-verified':
        return 'Go to Login';
      case 'expired':
      case 'invalid':
      case 'error':
        return 'Back to Registration';
      default:
        return 'Go to Home';
    }
  };

  const getButtonLink = () => {
    switch (status) {
      case 'success':
      case 'already-verified':
        return '/login';
      case 'expired':
      case 'invalid':
      case 'error':
        return '/register';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            {message}
          </p>
          
          <Button 
            asChild 
            className="w-full"
            variant={status === 'success' || status === 'already-verified' ? 'default' : 'outline'}
          >
            <a href={getButtonLink()}>
              {getButtonText()}
            </a>
          </Button>
          
          {(status === 'expired' || status === 'invalid') && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Need help? Contact support at support@homekrypto.com</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}