import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { web3Service, type Web3State } from '@/lib/web3';
import { DollarSign, Coins, TrendingUp, Percent, Plus, Wallet, Building, Download, AlertCircle } from 'lucide-react';
import { QUARTERLY_BREAKDOWN } from '@/lib/constants';

export default function Dashboard() {
  const [web3State, setWeb3State] = useState<Web3State>(web3Service.getState());

  useEffect(() => {
    const unsubscribe = web3Service.subscribe(setWeb3State);
    return unsubscribe;
  }, []);

  if (!web3State.isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to view your investment dashboard.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => web3Service.connectWallet()}
              className="mt-6 bg-primary hover:bg-blue-700 text-white"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const portfolioCards = [
    {
      title: 'Total Investment',
      value: '$2,561.48',
      subtitle: '24 months active',
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      title: 'HKT Balance',
      value: '23,960',
      subtitle: '+2,786 this quarter',
      icon: Coins,
      color: 'text-secondary'
    },
    {
      title: 'Portfolio Value',
      value: '$3,654.20',
      subtitle: '+$1,092.72 profit',
      icon: TrendingUp,
      color: 'text-accent'
    },
    {
      title: 'ROI',
      value: '+42.7%',
      subtitle: 'Since inception',
      icon: Percent,
      color: 'text-green-500'
    }
  ];

  const ownershipStats = [
    { label: 'Ownership Percentage:', value: '0.348%', color: 'text-primary' },
    { label: 'Property Value Share:', value: '$43,520', color: 'text-gray-900' },
    { label: 'Monthly Rental Income:', value: '$151.32', color: 'text-secondary' },
    { label: 'Total Rental Earned:', value: '$3,026.40', color: 'text-green-600', bg: 'bg-green-50' }
  ];

  const quickActions = [
    { label: 'Buy More HKT', icon: Plus, color: 'bg-primary hover:bg-blue-700' },
    { label: 'Withdraw Rental Income', icon: DollarSign, color: 'bg-secondary hover:bg-green-700' },
    { label: 'View Property Details', icon: Building, color: 'bg-accent hover:bg-yellow-500' },
    { label: 'Export Investment Data', icon: Download, color: 'border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary bg-white' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investor Dashboard</h1>
          <p className="text-xl text-gray-600">Track your HKT investment performance and property ownership</p>
          <div className="mt-4 text-sm text-gray-500">
            Connected: {web3Service.formatAddress(web3State.address!)}
          </div>
        </div>

        <div className="space-y-8">
          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {portfolioCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Card key={index} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                      <IconComponent className={card.color} size={20} />
                    </div>
                    <div className={`text-3xl font-bold text-gray-900 ${card.color}`}>
                      {card.value}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{card.subtitle}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Investment Progress */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Investment Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {QUARTERLY_BREAKDOWN.slice(0, 8).map((quarter, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      Q{quarter.quarter}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-semibold">202{quarter.year + 1} Q{quarter.quarter} - Year {quarter.year}</h4>
                        <span className="text-primary font-bold">$320.40 invested</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>HKT Price: ${quarter.hktPrice.toFixed(3)} | Purchased: {quarter.hktPurchased.toLocaleString()} HKT</span>
                        <span>Total HKT: {quarter.totalHkt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Property Ownership and Quick Actions */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Property Ownership</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ownershipStats.map((stat, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center py-3 ${
                        stat.bg ? `${stat.bg} rounded-lg px-4` : 'border-b border-gray-200'
                      }`}
                    >
                      <span className={stat.bg ? 'text-green-700' : 'text-gray-600'}>{stat.label}</span>
                      <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={index}
                        className={`w-full ${action.color} font-semibold transition-colors`}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
