import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ChevronDown } from 'lucide-react';

interface WalletOption {
  name: string;
  icon: string;
  connect: () => Promise<void>;
}

export default function WalletConnectDropdown() {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        toast({
          title: "MetaMask Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      } else {
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive"
      });
    }
  };

  const connectWalletConnect = async () => {
    toast({
      title: "WalletConnect",
      description: "WalletConnect integration coming soon!",
    });
  };

  const connectCoinbaseWallet = async () => {
    toast({
      title: "Coinbase Wallet",
      description: "Coinbase Wallet integration coming soon!",
    });
  };

  const connectTrustWallet = async () => {
    toast({
      title: "Trust Wallet",
      description: "Trust Wallet integration coming soon!",
    });
  };

  const walletOptions: WalletOption[] = [
    {
      name: 'MetaMask',
      icon: '🦊',
      connect: connectMetaMask
    },
    {
      name: 'WalletConnect',
      icon: '🔗',
      connect: connectWalletConnect
    },
    {
      name: 'Coinbase Wallet',
      icon: '🔵',
      connect: connectCoinbaseWallet
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      connect: connectTrustWallet
    }
  ];

  const handleWalletConnect = async (wallet: WalletOption) => {
    setIsConnecting(wallet.name);
    try {
      await wallet.connect();
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {walletOptions.map((wallet) => (
          <DropdownMenuItem
            key={wallet.name}
            onClick={() => handleWalletConnect(wallet)}
            disabled={isConnecting === wallet.name}
            className="cursor-pointer"
          >
            <span className="mr-3 text-lg">{wallet.icon}</span>
            <span className="flex-1">{wallet.name}</span>
            {isConnecting === wallet.name && (
              <span className="text-xs text-gray-500">Connecting...</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}