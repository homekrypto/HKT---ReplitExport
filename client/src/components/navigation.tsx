import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from './theme-toggle';
import LanguageSelector from './language-selector';
import WalletConnectDropdown from './wallet-connect-dropdown';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setLocation('/');
        window.location.reload(); // Force refresh to clear auth state
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/our-mission', label: 'Our Mission' },
    { href: '/buy-hkt', label: 'Buy HKT' },
    { href: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: Logo above navigation */}
        <div className="hidden md:block">
          <div className="flex justify-center py-4 border-b border-gray-100 dark:border-gray-800">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-primary">HKT</h1>
            </Link>
          </div>
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center justify-center w-full">
              <div className="flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/contact"
                  className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <WalletConnectDropdown />
              {!isLoading && (
                isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <User className="h-4 w-4" />
                      <span>{user?.firstName || user?.email}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center space-x-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <Button variant="outline" size="sm">Log In</Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">Register</Button>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Logo and hamburger on top line */}
        <div className="md:hidden">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">HKT</h1>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Mobile: Action buttons on separate line */}
          <div className="flex justify-center space-x-3 py-3 border-t border-gray-100 dark:border-gray-800">
            <WalletConnectDropdown />
            {!isLoading && (
              isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-300">
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-20">{user?.firstName || user?.email}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">Log In</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              
              {/* Mobile Settings */}
              <div className="pt-4 pb-2 space-y-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center space-x-4">
                  <ThemeToggle />
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}