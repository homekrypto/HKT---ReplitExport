import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Coins, TrendingUp } from 'lucide-react';
import { QUARTERLY_BREAKDOWN } from '@/lib/constants';

export default function HowItWorks() {
  const steps = [
    {
      icon: Wallet,
      title: '1. Connect Your Wallet',
      description: 'Link your MetaMask wallet to start investing. Your transactions are secured on the Ethereum blockchain.',
      bgColor: 'bg-primary'
    },
    {
      icon: Coins,
      title: '2. Buy HKT Tokens',
      description: 'Purchase HKT tokens that represent shares in premium real estate properties. Start with as little as $106.83/month.',
      bgColor: 'bg-secondary'
    },
    {
      icon: TrendingUp,
      title: '3. Earn Returns',
      description: 'Watch your investment grow through property appreciation and rental income, with 15% annual token growth.',
      bgColor: 'bg-accent'
    }
  ];

  const timelineData = [
    {
      year: 1,
      title: 'Year 1: Foundation Building',
      description: 'HKT Price: $0.100 | Quarterly Investment: $320.40 | Total HKT: 12,816',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-primary'
    },
    {
      year: 2,
      title: 'Year 2: Growth Phase',
      description: 'HKT Price: $0.115 | Quarterly Investment: $320.40 | Total HKT: 23,960',
      bgColor: 'bg-green-50',
      iconBg: 'bg-secondary'
    },
    {
      year: 3,
      title: 'Year 3: Maturity & Returns',
      description: 'HKT Price: $0.152 | Final Portfolio: $5,300 | Profit: $1,454 (37.8% ROI)',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-accent'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How HKT Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, transparent, and secure property investment through blockchain technology
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mb-6`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <h3 className="text-3xl font-bold text-center mb-8">Investment Timeline</h3>
            <div className="space-y-6">
              {timelineData.map((phase, index) => (
                <div key={index} className={`flex items-center space-x-6 p-4 ${phase.bgColor} rounded-lg`}>
                  <div className={`w-12 h-12 ${phase.iconBg} rounded-full flex items-center justify-center text-white font-bold`}>
                    {phase.year}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{phase.title}</h4>
                    <p className="text-gray-600">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Quarterly Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUARTERLY_BREAKDOWN.map((quarter, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Year {quarter.year} Q{quarter.quarter}</h4>
                    <span className="text-sm text-gray-500">${quarter.hktPrice.toFixed(3)}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Purchased: {quarter.hktPurchased.toLocaleString()} HKT</div>
                    <div>Total: {quarter.totalHkt.toLocaleString()} HKT</div>
                    <div className="font-semibold">Value: ${quarter.portfolioValue.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
