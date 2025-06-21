import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginUser } from '@shared/schema';
import { Eye, EyeOff, Wallet, Mail, Lock } from 'lucide-react';
import { web3Service } from '@/lib/web3';

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const { toast } = useToast();
  const { login, isLoading } = useAuth();

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginUser) => {
    try {
      await login(data);
      toast({
        title: 'Login successful',
        description: 'Welcome back to HKT!',
      });
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleWalletLogin = async () => {
    try {
      setIsConnectingWallet(true);
      
      if (!window.ethereum) {
        toast({
          title: 'MetaMask not found',
          description: 'Please install MetaMask to use wallet login.',
          variant: 'destructive',
        });
        return;
      }

      // Connect wallet
      await web3Service.connectWallet();
      const state = web3Service.getState();
      
      if (!state.address) {
        throw new Error('Failed to get wallet address');
      }

      // Create a message to sign
      const message = `Sign this message to login to HKT: ${Date.now()}`;
      
      // Request signature (in a real app, you'd verify this on the backend)
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, state.address],
      });

      // Send to backend for verification and login
      const response = await fetch('/api/auth/wallet-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: state.address,
          signature,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Wallet login failed');
      }

      const data = await response.json();
      
      // Store tokens and redirect
      localStorage.setItem('hkt_access_token', data.accessToken);
      localStorage.setItem('hkt_refresh_token', data.refreshToken);
      
      toast({
        title: 'Wallet login successful',
        description: 'Welcome to HKT!',
      });
      
      setLocation('/dashboard');
    } catch (error: any) {
      console.error('Wallet login error:', error);
      toast({
        title: 'Wallet login failed',
        description: error.message || 'Failed to connect wallet.',
        variant: 'destructive',
      });
    } finally {
      setIsConnectingWallet(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to HKT
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Access your real estate investment portfolio
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Login to your account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...form.register('email')}
                  className="mt-1"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...form.register('password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={form.watch('rememberMe')}
                    onCheckedChange={(checked) => form.setValue('rememberMe', !!checked)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password">
                  <a className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleWalletLogin}
              disabled={isConnectingWallet}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnectingWallet ? 'Connecting...' : 'Connect with MetaMask'}
            </Button>

            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
              <Link href="/register">
                <a className="text-primary hover:underline font-medium">
                  Sign up
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}