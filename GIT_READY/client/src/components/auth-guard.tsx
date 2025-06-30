import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect authenticated users away from auth pages
    if (!isLoading && isAuthenticated) {
      const authPages = ['/login', '/register', '/forgot-password'];
      const isOnAuthPage = authPages.some(page => location.startsWith(page));
      
      if (isOnAuthPage) {
        setLocation('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  return <>{children}</>;
}