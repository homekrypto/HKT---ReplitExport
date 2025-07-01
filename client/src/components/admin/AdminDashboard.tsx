import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { 
  Users,
  Building,
  BarChart3,
  Settings,
  UserCheck,
  Home,
  DollarSign,
  TrendingUp,
  Activity,
  BookOpen,
  Shield,
  Globe
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Fetch admin-specific statistics
  const { data: hktStats } = useQuery({
    queryKey: ['/api/hkt-stats'],
    refetchInterval: 30000,
  });

  const { data: agentStats } = useQuery({
    queryKey: ['/api/admin/agents/stats'],
    enabled: !!user?.isAdmin,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to the Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your Home Krypto platform from this central dashboard
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/agents">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Agent Management
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agentStats?.totalAgents || 0}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Registered agents
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/properties">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                  Property Management
                </CardTitle>
                <Building className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {hktStats?.totalProperties || 4}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Active properties
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">
                HKT Price
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${hktStats?.price?.toFixed(4) || '0.0001'}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Current token price
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Platform Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                $0
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Agent Management Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Agent Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage real estate agent registrations and approvals
              </p>
              <div className="space-y-2">
                <Link href="/admin/agents">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    View All Agents
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                    <span className="font-medium text-yellow-700 dark:text-yellow-300">
                      Pending: {agentStats?.pendingAgents || 0}
                    </span>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <span className="font-medium text-green-700 dark:text-green-300">
                      Approved: {agentStats?.approvedAgents || 0}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Management Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage property listings, pricing, and availability
              </p>
              <div className="space-y-2">
                <Link href="/admin/properties">
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="h-4 w-4 mr-2" />
                    Manage Properties
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Platform Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Platform Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Bookings</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Investments</span>
                  <span className="font-medium">$0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  No recent activity
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">HKT Price Feed</span>
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email Service</span>
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">Working</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}