import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import CrossChainWalletManager from '@/components/cross-chain-wallet-manager';
import OnboardingTrigger from '@/components/onboarding-trigger';
import InvestmentSetupForm from '@/components/investment-setup-form';
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
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: investmentData, isLoading: investmentLoading, refetch: refetchInvestment } = useQuery({
    queryKey: ['/api/investments/user', user?.id],
    enabled: !!user?.id,
  });

  const { data: hktStats } = useQuery({
    queryKey: ['/api/hkt-stats'],
    refetchInterval: 30000,
  });

  const hasInvestment = investmentData && investmentData.totalInvested > 0;

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
          {investmentLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : hasInvestment ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${investmentData.totalInvested.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    ${investmentData.monthlyAmount}/month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${investmentData.currentValue.toLocaleString()}</div>
                  <p className={`text-xs ${investmentData.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {investmentData.profit >= 0 ? '+' : ''}${investmentData.profit.toLocaleString()} ({investmentData.roi.toFixed(2)}%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">HKT Tokens</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{investmentData.hktTokens.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    @ ${hktStats?.currentPrice || '0.152'} per token
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Investment Period</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{investmentData.monthsInvested} months</div>
                  <p className="text-xs text-muted-foreground">
                    {investmentData.startDate ? `Started ${new Date(investmentData.startDate).toLocaleDateString()}` : 'No start date'}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="mb-8">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Start Your Investment Journey</h3>
                  <p className="text-gray-600 dark:text-gray-300">You haven't started investing in HKT tokens yet. Set up your first investment to begin tracking your portfolio.</p>
                </div>
                <InvestmentSetupForm onSuccess={() => refetchInvestment()} />
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          {hasInvestment && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Your real estate investment portfolio performance summary.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Investment Period:</span>
                      <span className="font-semibold">{investmentData.monthsInvested} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Contribution:</span>
                      <span className="font-semibold">${investmentData.monthlyAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Contributions:</span>
                      <span className="font-semibold">${investmentData.totalInvested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Portfolio Value:</span>
                      <span className="font-semibold text-primary">${investmentData.currentValue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button>View Investment Details</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Monthly Investment
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Investment History
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}