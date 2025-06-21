import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { web3Service, type Web3State } from '@/lib/web3';
import { useApp } from '@/contexts/AppContext';
import { Wallet, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();
  const [web3State, setWeb3State] = useState<Web3State>(web3Service.getState());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { t } = useApp();

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

  const navLinks = [
    { href: '/', label: t.nav.home, active: location === '/' },
    { href: '/how-it-works', label: t.nav.howItWorks, active: location === '/how-it-works' },
    { href: '/buy-hkt', label: t.nav.buyHkt, active: location === '/buy-hkt' },
    { href: '/dashboard', label: t.nav.dashboard, active: location === '/dashboard' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">HKT</h1>
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
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={`${
                web3State.isConnected
                  ? 'bg-secondary hover:bg-green-700'
                  : 'bg-primary hover:bg-blue-700'
              } text-white font-medium transition-colors`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnecting
                ? 'Connecting...'
                : web3State.isConnected && web3State.address
                ? web3Service.formatAddress(web3State.address)
                : t.nav.connectWallet}
            </Button>

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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
