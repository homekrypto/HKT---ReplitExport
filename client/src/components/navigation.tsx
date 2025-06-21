import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { web3Service, type Web3State } from '@/lib/web3';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import WalletConnectDropdown from './wallet-connect-dropdown';
import { Wallet, Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();
  const [web3State, setWeb3State] = useState<Web3State>(web3Service.getState());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { t } = useApp();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const unsubscribe = web3Service.subscribe(setWeb3State);
    return unsubscribe;
  }, []);

  const handleConnectWallet = async () => {
    if (web3State.isConnected) return;
    
    setIsConnecting(true);
    try {
      await web3Service.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const publicNavLinks = [
    { href: '/', label: t.nav.home, active: location === '/' },
    { href: '/our-mission', label: 'Our Mission', active: location === '/our-mission' },
    { href: '/how-it-works', label: t.nav.howItWorks, active: location === '/how-it-works' },
  ];

  const authenticatedNavLinks = [
    ...publicNavLinks,
    { href: '/buy-hkt', label: t.nav.buyHkt, active: location === '/buy-hkt' },
    { href: '/dashboard', label: t.nav.dashboard, active: location === '/dashboard' },
  ];

  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks;

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img 
                src="@assets/Home Krypto Logo_1750516529891.png" 
                alt="Home Krypto Token" 
                className="h-10 w-auto"
              />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 font-medium transition-colors ${
                      link.active
                        ? 'text-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/faq"
                  className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/contact"
                  className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <WalletConnectDropdown />
                <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {!user?.walletAddress && (
                  <Button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    variant="outline"
                    size="sm"
                    className="hidden md:flex"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {isConnecting
                      ? 'Connecting...'
                      : web3State.isConnected && web3State.address
                      ? web3Service.formatAddress(web3State.address)
                      : 'Connect Wallet'}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} />
                        <AvatarFallback className="text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block font-medium">
                        {getUserDisplayName()}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <button
              className="md:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 font-medium transition-colors ${
                    link.active
                      ? 'text-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {!isAuthenticated ? (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3 space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-primary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3 space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
