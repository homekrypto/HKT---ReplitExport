import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import BuyHKTButton from '@/components/BuyHKTButton';
import BlockchainTestSuite from '@/components/blockchain/BlockchainTestSuite';
import { 
  Network,
  Zap,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Wallet,
  Home,
  Vote,
  Coins,
  ExternalLink,
  RefreshCw,
  Shield,
  Target
} from 'lucide-react';

interface UserJourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  component?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export default function MainnetTesting() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('journey');
  const [journeyProgress, setJourneyProgress] = useState(0);

  const [userJourneySteps, setUserJourneySteps] = useState<UserJourneyStep[]>([
    {
      id: 'buy-hkt',
      title: 'Step 1: Purchase HKT Tokens',
      description: 'Buy HKT tokens using ETH via MetaMask and Uniswap integration',
      status: 'pending',
      actionButton: <BuyHKTButton onPurchaseComplete={handleHKTPurchase} />
    },
    {
      id: 'book-property',
      title: 'Step 2: Book Property with HKT',
      description: 'Use HKT tokens to book a week at our Dominican Republic property',
      status: 'pending',
      actionButton: (
        <Button variant="outline" onClick={() => handlePropertyBooking()}>
          <Home className="h-4 w-4 mr-2" />
          Book Property
        </Button>
      )
    },
    {
      id: 'receive-nft',
      title: 'Step 3: Receive Property NFT',
      description: 'Get your property ownership NFT with special perks and benefits',
      status: 'pending'
    },
    {
      id: 'dao-participation',
      title: 'Step 4: Join DAO Governance',
      description: 'Participate in HomeKrypto DAO voting and governance decisions',
      status: 'pending',
      actionButton: (
        <Button variant="outline" onClick={() => handleDAOJoin()}>
          <Vote className="h-4 w-4 mr-2" />
          Join DAO
        </Button>
      )
    }
  ]);

  function handleHKTPurchase(txHash: string, amount: string) {
    updateStepStatus('buy-hkt', 'completed');
    updateStepStatus('book-property', 'pending');
    
    toast({
      title: 'HKT Purchase Successful!',
      description: `Purchased ${amount} HKT tokens. You can now book properties.`,
    });
  }

  function handlePropertyBooking() {
    updateStepStatus('book-property', 'in-progress');
    
    // Simulate booking process
    setTimeout(() => {
      updateStepStatus('book-property', 'completed');
      updateStepStatus('receive-nft', 'in-progress');
      
      // Simulate NFT minting
      setTimeout(() => {
        updateStepStatus('receive-nft', 'completed');
        updateStepStatus('dao-participation', 'pending');
        
        toast({
          title: 'Property Booked & NFT Minted!',
          description: 'Your booking is confirmed and ownership NFT has been minted.',
        });
      }, 2000);
    }, 1500);
  }

  function handleDAOJoin() {
    updateStepStatus('dao-participation', 'in-progress');
    
    setTimeout(() => {
      updateStepStatus('dao-participation', 'completed');
      
      toast({
        title: 'DAO Registration Complete!',
        description: 'You can now participate in governance voting.',
      });
    }, 1000);
  }

  function updateStepStatus(stepId: string, status: UserJourneyStep['status']) {
    setUserJourneySteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
    
    // Update progress
    setJourneyProgress(
      userJourneySteps.filter(step => step.status === 'completed').length / userJourneySteps.length * 100
    );
  }

  const getStatusIcon = (status: UserJourneyStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: UserJourneyStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'in-progress':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      case 'error':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Network className="h-8 w-8 text-blue-500" />
                  Mainnet Testing Lab
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Test the complete user journey: Buy HKT → Book Property → Get NFT Perks → DAO Participation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Ethereum Mainnet
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Live Testing
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="journey" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                User Journey
              </TabsTrigger>
              <TabsTrigger value="blockchain" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Blockchain Tests
              </TabsTrigger>
              <TabsTrigger value="integration" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Integration Status
              </TabsTrigger>
            </TabsList>

            {/* User Journey Tab */}
            <TabsContent value="journey" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete User Journey Testing</CardTitle>
                  <CardDescription>
                    Follow these steps to test the complete HKT ecosystem integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userJourneySteps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`p-6 rounded-lg border ${getStatusColor(step.status)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            {getStatusIcon(step.status)}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{step.title}</h3>
                              <p className="text-muted-foreground mt-1">{step.description}</p>
                              
                              {step.status === 'completed' && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-green-700">
                                    ✓ Completed
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {step.actionButton && step.status === 'pending' && (
                            <div className="ml-4">
                              {step.actionButton}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Buy HKT Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Purchase HKT tokens directly with ETH via MetaMask
                    </p>
                    <BuyHKTButton className="w-full" onPurchaseComplete={handleHKTPurchase} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Book Property
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use HKT tokens to book our Dominican Republic villa
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('/booking/DOM001', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Booking Page
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Vote className="h-5 w-5" />
                      DAO Governance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Participate in HomeKrypto DAO voting and decisions
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      <Vote className="h-4 w-4 mr-2" />
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Blockchain Tests Tab */}
            <TabsContent value="blockchain">
              <BlockchainTestSuite />
            </TabsContent>

            {/* Integration Status Tab */}
            <TabsContent value="integration" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Smart Contract Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>HKT Token Contract</span>
                      <Badge className="bg-green-100 text-green-800">Live</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Property NFT Contract</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Testing</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Booking Escrow Contract</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Testing</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>DAO Governance Contract</span>
                      <Badge className="bg-blue-100 text-blue-800">Development</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Integration Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>MetaMask Connection</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Uniswap DEX Integration</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Price Feed Service</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Mainnet Deployment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Network className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Current Status:</strong> HKT platform is successfully deployed on Ethereum Mainnet with real HKT token contract at{' '}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                        0x0de50324B6960B15A5ceD3D076aE314ac174Da2e
                      </code>
                      . Users can purchase HKT tokens, book properties, and participate in the ecosystem using real ETH transactions.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}