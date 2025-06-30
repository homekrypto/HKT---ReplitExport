import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building, 
  Calculator, 
  DollarSign, 
  BarChart3, 
  FileText, 
  Mail, 
  Shield, 
  Users, 
  Briefcase,
  TrendingUp,
  Activity,
  ExternalLink
} from 'lucide-react';
import { Link } from 'wouter';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function Sitemap() {
  useScrollToTop();

  const pageCategories = [
    {
      title: "Core Platform",
      icon: Home,
      pages: [
        { name: "Home", path: "/", description: "Main landing page with hero section and investment overview", status: "live" },
        { name: "Our Mission", path: "/our-mission", description: "Company mission, vision, and team information", status: "live" },
        { name: "How It Works", path: "/how-it-works", description: "Step-by-step investment process explanation", status: "live" }
      ]
    },
    {
      title: "Investment & Properties",
      icon: Building,
      pages: [
        { name: "Properties Portfolio", path: "/properties", description: "Global property portfolio overview with regional breakdown", status: "live" },
        { name: "Pilot Property Showcase", path: "/pilot-property-showcase", description: "Featured Punta Cana resort complex with detailed information", status: "live" },
        { name: "Property Details", path: "/property-details/1", description: "Individual property deep-dive with analytics and calendar", status: "live" },
        { name: "Buy HKT Tokens", path: "/buy-hkt", description: "Token purchase interface with Uniswap integration", status: "live" },
        { name: "Investment Calculator", path: "/investment-growth-projection", description: "Comprehensive growth projections and scenario analysis", status: "live" }
      ]
    },
    {
      title: "Trading & Analytics",
      icon: TrendingUp,
      pages: [
        { name: "Dashboard", path: "/dashboard", description: "Portfolio analytics, income tracking, and tax center", status: "live", protected: true },
        { name: "Secondary Market", path: "/secondary-market", description: "HKT token trading with order book and liquidity pools", status: "live" }
      ]
    },
    {
      title: "User Account",
      icon: Users,
      pages: [
        { name: "Login", path: "/login", description: "User authentication with email/password", status: "live" },
        { name: "Register", path: "/register", description: "New user registration with email verification", status: "live" },
        { name: "Profile", path: "/profile", description: "User profile management and settings", status: "live", protected: true },
        { name: "Forgot Password", path: "/forgot-password", description: "Password reset functionality", status: "live" },
        { name: "Email Verification", path: "/verify-email", description: "Email verification confirmation page", status: "live" }
      ]
    },
    {
      title: "Legal & Information",
      icon: Shield,
      pages: [
        { name: "Terms & Conditions", path: "/terms-and-conditions", description: "Legal terms and conditions for platform usage", status: "live" },
        { name: "Privacy Policy", path: "/privacy-policy", description: "Data privacy and protection policy", status: "live" },
        { name: "Whitepaper", path: "/whitepaper", description: "Technical whitepaper and platform documentation", status: "live" },
        { name: "FAQ", path: "/faq", description: "Frequently asked questions and answers", status: "live" }
      ]
    },
    {
      title: "Support & Contact",
      icon: Mail,
      pages: [
        { name: "Contact", path: "/contact", description: "Contact form with real email delivery to support", status: "live" },
        { name: "Work With Us", path: "/work-with-us", description: "Career opportunities and job listings", status: "live" },
        { name: "For Developers", path: "/for-developers", description: "Developer resources and API documentation", status: "live" }
      ]
    },
    {
      title: "Real Estate Agents",
      icon: Briefcase,
      pages: [
        { name: "Agents Directory", path: "/agents", description: "Find verified real estate agents specializing in crypto investments", status: "live" },
        { name: "Agent Registration", path: "/agent-registration", description: "Join our network of certified real estate professionals", status: "live" },
        { name: "Agent Management", path: "/admin/agents", description: "Administrative panel for agent approval and management", status: "live", protected: true }
      ]
    }
  ];

  const dashboardFeatures = [
    { name: "Portfolio Analytics", description: "Real-time performance tracking and ROI analysis" },
    { name: "Rental Income History", description: "Monthly/quarterly income breakdowns and trends" },
    { name: "Transaction History", description: "Complete trading and income transaction log" },
    { name: "Tax Center", description: "Tax document generation and annual summaries" },
    { name: "Performance Tracking", description: "Unrealized gains and portfolio growth metrics" }
  ];

  const propertyFeatures = [
    { name: "Occupancy Analytics", description: "Real-time booking and occupancy rate tracking" },
    { name: "Rental Calendar", description: "Booking schedules and availability management" },
    { name: "Maintenance Tracking", description: "Property upkeep costs and improvement monitoring" },
    { name: "Income Analytics", description: "Property-specific revenue and ROI analysis" },
    { name: "Token Distribution", description: "Ownership tracking and share calculations" }
  ];

  const tradingFeatures = [
    { name: "Live Order Book", description: "Real-time buy/sell orders and market depth" },
    { name: "Price Charts", description: "Historical price data and technical analysis" },
    { name: "Trading Interface", description: "Buy/sell HKT tokens with market orders" },
    { name: "Liquidity Pools", description: "DeFi integration with APY rewards" },
    { name: "Market Analytics", description: "Volume, market cap, and trading metrics" }
  ];

  const totalPages = pageCategories.reduce((total, category) => total + category.pages.length, 0);
  const protectedPages = pageCategories.reduce((total, category) => 
    total + category.pages.filter(page => page.protected).length, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Platform Sitemap
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            HKT Platform Sitemap
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto font-medium">
            Complete overview of all pages, features, and functionality available in the Home Krypto Token platform.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalPages}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{protectedPages}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Protected Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">7</div>
              <div className="text-sm text-gray-700 dark:text-gray-400 font-medium">Categories</div>
            </div>
          </div>
        </div>

        {/* Page Categories */}
        <div className="space-y-12">
          {pageCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <category.icon className="h-6 w-6 mr-3" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {category.pages.map((page, pageIndex) => (
                    <div key={pageIndex} className="border rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">{page.name}</h3>
                          {page.protected && (
                            <Badge variant="secondary" className="text-xs">
                              Protected
                            </Badge>
                          )}
                        </div>
                        <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          {page.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {page.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {page.path}
                        </code>
                        <Link href={page.path}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Dashboard Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Dashboard Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardFeatures.map((feature, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Property Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Property Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {propertyFeatures.map((feature, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trading Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Trading Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tradingFeatures.map((feature, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Architecture */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Platform Architecture Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Frontend</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">React + TypeScript with Tailwind CSS</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Backend</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Node.js + Express with PostgreSQL</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Authentication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">JWT + Session management</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">Web3</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">MetaMask + Uniswap integration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}