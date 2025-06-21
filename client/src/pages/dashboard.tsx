import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrossChainWalletManager from '@/components/cross-chain-wallet-manager';
import OnboardingTrigger from '@/components/onboarding-trigger';
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
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

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
                <div className="text-2xl font-bold">$3,845.88</div>
                <p className="text-xs text-muted-foreground">
                  $106.83/month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,423.76</div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +$577.88 (15.03%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">HKT Tokens</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">29,108.32</div>
                <p className="text-xs text-muted-foreground">
                  @ $0.152 per token
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Status</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold text-orange-600 dark:text-orange-400">Not Connected</div>
                <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Investment Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Your real estate investment portfolio is performing well. 
                  You've invested for 23 months out of 36, with 13 months remaining.
                </p>
                <div className="mt-4">
                  <Button>View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  Increase Investment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  View Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}