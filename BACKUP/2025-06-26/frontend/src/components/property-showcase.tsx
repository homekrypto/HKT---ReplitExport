import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Building, TrendingUp } from 'lucide-react';
import { INVESTMENT_PLAN_DATA } from '@/lib/constants';

export default function PropertyShowcase() {
  const benefits = {
    ownership: [
      'Blockchain-secured property shares',
      'Transparent and permanent ownership records',
      'Rental income generation potential',
      'Property value appreciation over time'
    ],
    tokenGrowth: [
      '15% annual token appreciation',
      '24/7 trading without property sale hassles',
      'Compounding potential with reinvestment',
      'Low-risk appreciation strategy'
    ]
  };

  const portfolioStats = [
    {
      label: 'Current Portfolio Value:',
      value: `$${INVESTMENT_PLAN_DATA.finalPortfolioValue.toLocaleString()}`,
      color: 'text-primary'
    },
    {
      label: '10-Year Projection:',
      value: '$12,000+',
      color: 'text-secondary'
    },
    {
      label: 'Total Tokens Owned:',
      value: `${INVESTMENT_PLAN_DATA.totalHktAccumulated.toLocaleString()} HKT`,
      color: 'text-accent'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your HKT Investment Benefits</h2>
          <p className="text-xl text-gray-600">Dual advantages of property ownership and token appreciation</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Building className="mr-3" />
                Premium Real Estate Ownership
              </h3>
              <ul className="space-y-3 text-blue-100">
                {benefits.ownership.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="mr-3 text-secondary flex-shrink-0" size={20} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-secondary to-green-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <TrendingUp className="mr-3" />
                Token Growth & Liquidity
              </h3>
              <ul className="space-y-3 text-green-100">
                {benefits.tokenGrowth.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="mr-3 text-yellow-300 flex-shrink-0" size={20} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500" 
              alt="Luxury modern apartment building" 
              className="rounded-xl shadow-lg w-full h-64 object-cover" 
            />
            
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4">Long-term Growth Potential</h4>
                <div className="space-y-3">
                  {portfolioStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{stat.label}</span>
                      <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
