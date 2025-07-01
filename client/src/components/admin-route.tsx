import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access the admin panel.',
          variant: 'destructive',
        });
        setLocation('/login');
        return;
      }

      // Check if user has admin privileges
      if (user && !user.isAdmin && user.email !== 'admin@homekrypto.com') {
        toast({
          title: 'Access Denied',
          description: 'Admin access is restricted to authorized personnel only.',
          variant: 'destructive',
        });
        setLocation('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, setLocation, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Show access denied if not admin
  if (user && !user.isAdmin && user.email !== 'admin@homekrypto.com') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Access Denied</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Admin access is restricted to authorized personnel only.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render admin content if all checks pass
  return <>{children}</>;
}