import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Shield, Smartphone, Globe, AlertTriangle } from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  isInstalled: boolean;
  downloadUrl: string;
}

interface WalletConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletId: string) => Promise<void>;
}

export default function WalletConnect({ isOpen, onClose, onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const walletOptions: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Popular browser extension wallet',
      isInstalled: typeof window !== 'undefined' && !!window.ethereum?.isMetaMask,
      downloadUrl: 'https://metamask.io/download/'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect with mobile wallets via QR code',
      isInstalled: true, // Always available
      downloadUrl: ''
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Coinbase\'s self-custody wallet',
      isInstalled: typeof window !== 'undefined' && !!window.ethereum?.isCoinbaseWallet,
      downloadUrl: 'https://www.coinbase.com/wallet'
    },
    {
      id: 'web3auth',
      name: 'Social Login',
      icon: '📧',
      description: 'Login with Google, Twitter, or email',
      isInstalled: true, // Always available
      downloadUrl: ''
    }
  ];

  const handleWalletConnect = async (walletId: string) => {
    setIsConnecting(true);
    setSelectedWallet(walletId);
    setError(null);

    try {
      await onConnect(walletId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  const openDownloadLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Only connect to trusted wallets. HKT will never ask for your private keys or seed phrase.
            </AlertDescription>
          </Alert>

          {/* Wallet Options */}
          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <Card 
                key={wallet.id} 
                className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedWallet === wallet.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => wallet.isInstalled ? handleWalletConnect(wallet.id) : openDownloadLink(wallet.downloadUrl)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div>
                      <h3 className="font-medium">{wallet.name}</h3>
                      <p className="text-sm text-muted-foreground">{wallet.description}</p>
                    </div>
                  </div>
                  
                  {wallet.isInstalled ? (
                    <Button 
                      size="sm" 
                      disabled={isConnecting}
                      loading={isConnecting && selectedWallet === wallet.id}
                    >
                      {isConnecting && selectedWallet === wallet.id ? 'Connecting...' : 'Connect'}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      Install
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Web3 Onboarding Info */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>New to Web3? We recommend starting with MetaMask</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Need help? Check our wallet setup guide</span>
            </div>
          </div>

          {/* Terms Notice */}
          <div className="text-xs text-muted-foreground border-t pt-3">
            By connecting your wallet, you agree to our{' '}
            <a href="/terms-and-conditions" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}