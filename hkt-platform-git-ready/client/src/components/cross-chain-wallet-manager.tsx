import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  Plus, 
  Shield, 
  Star, 
  Trash2, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  AlertCircle,
  Loader,
  Network
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SupportedChain {
  id: number;
  chainId: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
}

interface UserWallet {
  id: string;
  chainId: number;
  walletAddress: string;
  walletType: string;
  isVerified: boolean;
  isPrimary: boolean;
  lastUsed: string;
  chain: SupportedChain;
}

interface Window {
  ethereum?: any;
}

declare let window: Window;

export default function CrossChainWalletManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [verificationStep, setVerificationStep] = useState<'select' | 'connect' | 'sign' | 'complete'>('select');
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [showAddWallet, setShowAddWallet] = useState(false);

  // Fetch supported chains
  const { data: supportedChains = [] } = useQuery({
    queryKey: ['/api/cross-chain-wallet/supported-chains'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user wallets
  const { data: userWallets = [], isLoading: walletsLoading } = useQuery({
    queryKey: ['/api/cross-chain-wallet/user-wallets'],
    refetchOnWindowFocus: false,
  });

  // Generate verification challenge
  const generateChallengeMutation = useMutation({
    mutationFn: async ({ walletAddress, chainId }: { walletAddress: string; chainId: number }) => {
      return apiRequest('/api/cross-chain-wallet/generate-challenge', {
        method: 'POST',
        body: { walletAddress, chainId }
      });
    },
    onSuccess: (data) => {
      setCurrentChallenge(data);
      setVerificationStep('sign');
    },
    onError: (error: any) => {
      toast({
        title: "Challenge Generation Failed",
        description: error.message || "Failed to generate verification challenge",
        variant: "destructive",
      });
      setVerificationStep('select');
    },
  });

  // Verify signature
  const verifySignatureMutation = useMutation({
    mutationFn: async ({ challengeId, signature, walletType }: { challengeId: string; signature: string; walletType: string }) => {
      return apiRequest('/api/cross-chain-wallet/verify-signature', {
        method: 'POST',
        body: { challengeId, signature, walletType }
      });
    },
    onSuccess: () => {
      setVerificationStep('complete');
      queryClient.invalidateQueries({ queryKey: ['/api/cross-chain-wallet/user-wallets'] });
      toast({
        title: "Wallet Verified",
        description: "Your wallet has been successfully verified and added to your account.",
      });
      setTimeout(() => {
        setShowAddWallet(false);
        resetWalletConnection();
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify wallet signature",
        variant: "destructive",
      });
      setVerificationStep('connect');
    },
  });

  // Set primary wallet
  const setPrimaryMutation = useMutation({
    mutationFn: async (walletId: string) => {
      return apiRequest('/api/cross-chain-wallet/set-primary', {
        method: 'POST',
        body: { walletId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cross-chain-wallet/user-wallets'] });
      toast({
        title: "Primary Wallet Updated",
        description: "Successfully updated your primary wallet.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update primary wallet",
        variant: "destructive",
      });
    },
  });

  // Remove wallet
  const removeWalletMutation = useMutation({
    mutationFn: async (walletId: string) => {
      return apiRequest(`/api/cross-chain-wallet/remove-wallet/${walletId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cross-chain-wallet/user-wallets'] });
      toast({
        title: "Wallet Removed",
        description: "Wallet has been removed from your account.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove wallet",
        variant: "destructive",
      });
    },
  });

  const resetWalletConnection = () => {
    setVerificationStep('select');
    setSelectedChain(null);
    setCurrentChallenge(null);
    setIsConnecting(false);
  };

  const connectWallet = async () => {
    if (!selectedChain || !window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask and select a chain first.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    setVerificationStep('connect');

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];

      if (!walletAddress) {
        throw new Error('No wallet address found');
      }

      // Switch to selected chain if needed
      const selectedChainData = supportedChains.find((c: SupportedChain) => c.id === selectedChain);
      if (selectedChainData) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${selectedChainData.chainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          // Chain doesn't exist in wallet, ignore for now
          console.log('Chain switch failed:', switchError);
        }
      }

      // Generate verification challenge
      generateChallengeMutation.mutate({
        walletAddress,
        chainId: selectedChainData!.chainId
      });
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      setVerificationStep('select');
    } finally {
      setIsConnecting(false);
    }
  };

  const signMessage = async () => {
    if (!currentChallenge || !window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const walletAddress = accounts[0];

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [currentChallenge.challenge, walletAddress],
      });

      verifySignatureMutation.mutate({
        challengeId: currentChallenge.challengeId,
        signature,
        walletType: 'metamask'
      });
    } catch (error: any) {
      console.error('Signing error:', error);
      toast({
        title: "Signing Failed",
        description: error.message || "Failed to sign verification message",
        variant: "destructive",
      });
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainIcon = (chainId: number) => {
    // You can replace these with actual chain icons
    const icons: { [key: number]: string } = {
      1: '🔹', // Ethereum
      56: '🟡', // BSC
      137: '🟣', // Polygon
      43114: '🔺', // Avalanche
      250: '👻', // Fantom
    };
    return icons[chainId] || '⛓️';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cross-Chain Wallets</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Verify and manage your wallets across multiple blockchain networks
          </p>
        </div>
        <Dialog open={showAddWallet} onOpenChange={setShowAddWallet}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddWallet(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Cross-Chain Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {verificationStep === 'select' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Blockchain Network</label>
                    <Select onValueChange={(value) => setSelectedChain(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a blockchain network" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedChains.map((chain: SupportedChain) => (
                          <SelectItem key={chain.id} value={chain.id.toString()}>
                            <div className="flex items-center space-x-2">
                              <span>{getChainIcon(chain.chainId)}</span>
                              <span>{chain.name}</span>
                              {chain.isTestnet && <Badge variant="outline">Testnet</Badge>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={connectWallet} 
                    disabled={!selectedChain || isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                </div>
              )}

              {verificationStep === 'connect' && (
                <div className="text-center space-y-4">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Connecting Wallet</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Please approve the connection in your wallet
                    </p>
                  </div>
                </div>
              )}

              {verificationStep === 'sign' && currentChallenge && (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      To verify wallet ownership, please sign the verification message. This is free and won't trigger any blockchain transaction.
                    </AlertDescription>
                  </Alert>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-xs font-mono whitespace-pre-wrap break-all">
                      {currentChallenge.challenge}
                    </p>
                  </div>
                  <Button 
                    onClick={signMessage} 
                    disabled={verifySignatureMutation.isPending}
                    className="w-full"
                  >
                    {verifySignatureMutation.isPending ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Sign Message
                      </>
                    )}
                  </Button>
                </div>
              )}

              {verificationStep === 'complete' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">Wallet Verified!</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your wallet has been successfully added to your account
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {walletsLoading ? (
        <div className="text-center py-8">
          <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300 mt-2">Loading wallets...</p>
        </div>
      ) : userWallets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Wallets Connected
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Connect your first wallet to start using cross-chain features
            </p>
            <Button onClick={() => setShowAddWallet(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userWallets.map((wallet: UserWallet) => (
            <Card key={wallet.id} className={wallet.isPrimary ? 'ring-2 ring-blue-500' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getChainIcon(wallet.chain.chainId)}</div>
                    <div>
                      <CardTitle className="text-lg">{wallet.chain.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={wallet.chain.isTestnet ? 'outline' : 'secondary'}>
                          {wallet.chain.isTestnet ? 'Testnet' : 'Mainnet'}
                        </Badge>
                        {wallet.isVerified && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {wallet.isPrimary && (
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Wallet Address
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
                      {formatAddress(wallet.walletAddress)}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyAddress(wallet.walletAddress)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://etherscan.io/address/${wallet.walletAddress}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Wallet Type: {wallet.walletType}</span>
                  <span>Last Used: {new Date(wallet.lastUsed).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2">
                  {!wallet.isPrimary && wallet.isVerified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrimaryMutation.mutate(wallet.id)}
                      disabled={setPrimaryMutation.isPending}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Set Primary
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeWalletMutation.mutate(wallet.id)}
                    disabled={removeWalletMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}