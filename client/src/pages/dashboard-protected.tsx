import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { web3Service, type Web3State } from '@/lib/web3';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/protected-route';
import { 
  TrendingUp, 
  Wallet, 
  DollarSign, 
  Target,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  User,
  Mail,
  Calendar,
  Plus,
  Download
} from 'lucide-react';

export default function DashboardProtected() {
  const { user } = useAuth();
  const [web3State, setWeb3State] = useState<Web3State>(web3Service.getState());

  useEffect(() => {
    const unsubscribe = web3Service.subscribe(setWeb3State);
    return unsubscribe;
  }, []);

  const { data: hktStats } = useQuery({
    queryKey: ['/api/hkt-stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const mockUserInvestment = {
    totalInvested: 3845.88,
    currentValue: 4423.76,
    profit: 577.88,
    roi: 15.03,
    hktTokens: 29108.32,
    monthlyAmount: 106.83,
  };

  const handleConnectWallet = async () => {
    try {
      await web3Service.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Track your HKT investments and real estate portfolio performance
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                {user?.lastLoginAt && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockUserInvestment.totalInvested.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ${mockUserInvestment.monthlyAmount}/month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockUserInvestment.currentValue.toLocaleString()}</div>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +${mockUserInvestment.profit.toLocaleString()} ({mockUserInvestment.roi}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">HKT Tokens</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUserInvestment.hktTokens.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  @ ${hktStats?.currentPrice || '0.152'} per token
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
                    <p className="text-xs text-muted-foreground">
                      {web3Service.formatAddress(web3State.address!)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-bold text-orange-600 dark:text-orange-400">Not Connected</div>
                    <Button 
                      onClick={handleConnectWallet}
                      size="sm" 
                      variant="outline" 
                      className="mt-2 h-7 text-xs"
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Investment Overview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Investment Portfolio</CardTitle>
                      <CardDescription>
                        Your real estate investment performance over time
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Portfolio Summary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Investment Progress</p>
                        <Progress value={65} className="w-full" />
                        <p className="text-xs text-muted-foreground">
                          Month 23 of 36 • 13 months remaining
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Property Allocation</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Residential 45%</Badge>
                          <Badge variant="outline">Commercial 35%</Badge>
                          <Badge variant="outline">Mixed-use 20%</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Recent Activity</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Monthly Investment</p>
                              <p className="text-xs text-muted-foreground">December 2024</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">+$106.83</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Token Price Update</p>
                              <p className="text-xs text-muted-foreground">HKT increased 2.3%</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-green-600">+$12.45</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Market Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">HKT Market Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="font-semibold">${hktStats?.currentPrice || '0.152'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Change</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      +{hktStats?.priceChange24h || '2.34'}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Market Cap</span>
                    <span className="font-semibold">${(hktStats?.marketCap || 15420000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Volume</span>
                    <span className="font-semibold">${(hktStats?.volume24h || 234500).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Increase Investment
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}