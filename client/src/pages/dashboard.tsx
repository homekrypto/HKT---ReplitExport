import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { web3Service, type Web3State } from '@/lib/web3';
import HKTSwapInterface from '@/components/hkt-swap-interface';
import BookingManagement from '@/components/BookingManagement';
import { 
  User,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  Wallet,
  PieChart,
  BarChart3,
  Activity,
  Plus,
  Home,
  MapPin,
  Users,
  ShoppingCart
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [web3State, setWeb3State] = useState<Web3State>(web3Service.getState());

  useEffect(() => {
    const unsubscribe = web3Service.subscribe(setWeb3State);
    return unsubscribe;
  }, []);

  const { data: hktStats, isLoading: hktStatsLoading } = useQuery({
    queryKey: ['/api/hkt-stats'],
    refetchInterval: 30000, // Refresh every 30 seconds for live data
  });

  const { data: userWallets } = useQuery({
    queryKey: ['/api/cross-chain-wallet/user-wallets'],
    enabled: !!user?.id,
  });

  const handleConnectWallet = async () => {
    try {
      await web3Service.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Mock property data - replace with real API later
  const availableProperties = [
    {
      id: 1,
      name: "Luxury Beachfront Villa",
      location: "Punta Cana, Dominican Republic",
      totalValue: 195000,
      sharePrice: 3750,
      sharesAvailable: 52,
      totalShares: 52,
      expectedReturn: "12-15% annually",
      image: "/api/placeholder/400/300"
    }
  ];

  // Real HKT balance from connected wallet
  const hktBalance = web3State.isConnected ? 1250.75 : 0; // TODO: Fetch real balance from blockchain

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Track your HKT investments and real estate portfolio performance
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                {user?.lastLoginAt && (
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-400 font-medium mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">HKT Balance</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hktBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  @ ${hktStatsLoading ? 'Loading...' : parseFloat(hktStats?.currentPrice || '0').toFixed(6)} per token
                </p>
                {hktStats && parseFloat(hktStats.currentPrice) < 0.001 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Live price pending exchange listings
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${hktStatsLoading ? 'Loading...' : (hktBalance * parseFloat(hktStats?.currentPrice || '0')).toFixed(2)}
                </div>
                <p className={`text-xs ${
                  parseFloat(hktStats?.priceChange24h || '0') >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {hktStatsLoading ? 'Fetching live data...' : (
                    <>
                      {parseFloat(hktStats?.priceChange24h || '0') >= 0 ? '+' : ''}
                      {parseFloat(hktStats?.priceChange24h || '0').toFixed(2)}% (24h)
                    </>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Status</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {web3State.isConnected ? (
                  <div>
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">Connected</div>
                    <p className="text-xs text-muted-foreground truncate">
                      {web3State.account?.slice(0, 6)}...{web3State.account?.slice(-4)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-bold text-orange-600 dark:text-orange-400">Not Connected</div>
                    <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" onClick={handleConnectWallet}>
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Property Shares</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Properties owned
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <HKTSwapInterface />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Market Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Price:</span>
                    <span className="font-semibold">
                      ${hktStatsLoading ? 'Loading...' : parseFloat(hktStats?.currentPrice || '0').toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Change:</span>
                    <span className={`font-semibold ${
                      parseFloat(hktStats?.priceChange24h || '0') >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {hktStatsLoading ? 'Loading...' : (
                        <>
                          {parseFloat(hktStats?.priceChange24h || '0') >= 0 ? '+' : ''}
                          {parseFloat(hktStats?.priceChange24h || '0').toFixed(2)}%
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Cap:</span>
                    <span className="font-semibold">
                      ${hktStats ? parseFloat(hktStats.marketCap || '0').toLocaleString() : 'Loading...'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Volume:</span>
                    <span className="font-semibold">
                      ${hktStats ? parseFloat(hktStats.volume24h || '0').toLocaleString() : 'Loading...'}
                    </span>
                  </div>
                </div>
                
                {hktStats && parseFloat(hktStats.currentPrice) < 0.001 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
                    <strong>Pre-Market Token:</strong> HKT is awaiting major exchange listings. Current data reflects estimated values until live trading begins.
                  </div>
                )}

                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-semibold text-sm">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Transaction History
                    </Button>
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Connect Multiple Wallets
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Available Property Shares</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Purchase fractional ownership in premium real estate properties
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Property Value:</span>
                          <span className="font-semibold">${property.totalValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Share Price:</span>
                          <span className="font-semibold">${property.sharePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shares Available:</span>
                          <span className="font-semibold">{property.sharesAvailable}/{property.totalShares}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Return:</span>
                          <span className="font-semibold text-green-600">{property.expectedReturn}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Purchase Shares
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Booking Management Section */}
          <BookingManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
}