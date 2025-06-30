import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Calendar, Target, AlertTriangle } from 'lucide-react';

export default function InvestmentGrowthProjection() {
  const projections = [
    { year: 1, price: 0.100, growth: 0, description: 'Foundation Building - Initial platform launch and property acquisition' },
    { year: 2, price: 0.115, growth: 15, description: 'Growth Phase - Expanding property portfolio and user base' },
    { year: 3, price: 0.152, growth: 32.2, description: 'Maturity & Returns - Established rental income streams' },
    { year: 4, price: 0.175, growth: 15.1, description: 'Market Expansion - International property markets' },
    { year: 5, price: 0.201, growth: 14.9, description: 'Platform Scale - Advanced DeFi integrations' },
    { year: 6, price: 2.00, growth: 895.5, description: 'Adoption Growth - Mainstream real estate tokenization' },
    { year: 7, price: 10.00, growth: 400, description: 'Mainstream Adoption - Major institutional partnerships' },
    { year: 8, price: 15.00, growth: 50, description: 'Ecosystem Expansion - Full real estate ecosystem' },
    { year: 9, price: 20.00, growth: 33.3, description: 'Market Leadership - Industry standard platform' },
    { year: 10, price: 25.00, growth: 25, description: 'Mature Asset Class - Established investment vehicle' }
  ];

  const monthlyInvestment = 106.83;
  const totalMonths = 36;
  const totalInvested = monthlyInvestment * totalMonths;

  const calculateReturns = (years: number) => {
    const targetPrice = projections.find(p => p.year === years)?.price || 0.152;
    const tokensAccumulated = totalInvested / 0.100; // Assuming initial purchase at $0.10
    const finalValue = tokensAccumulated * targetPrice;
    const profit = finalValue - totalInvested;
    const roi = ((profit / totalInvested) * 100);
    
    return { tokensAccumulated, finalValue, profit, roi };
  };

  const threeYearProjection = calculateReturns(3);
  const tenYearProjection = calculateReturns(10);

  const milestones = [
    { year: 1, title: 'Platform Launch', status: 'completed' },
    { year: 2, title: 'First Property Tokenized', status: 'completed' },
    { year: 3, title: 'Rental Income Distribution', status: 'in-progress' },
    { year: 4, title: 'Secondary Market Launch', status: 'planned' },
    { year: 5, title: 'International Expansion', status: 'planned' },
    { year: 6, title: 'Mainstream Adoption', status: 'planned' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Investment Growth Projection
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Explore the long-term potential of HKT token investment based on market analysis, 
            property performance, and platform adoption projections.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="font-semibold text-yellow-800 dark:text-yellow-200">Important Disclaimer</span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              These projections are hypothetical and for illustrative purposes only. Actual results may vary significantly 
              based on market conditions, adoption rates, and other factors. Cryptocurrency investments carry substantial risk.
            </p>
          </div>
        </div>

        {/* Current Investment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${monthlyInvestment}</h3>
              <p className="text-gray-600 dark:text-gray-300">Monthly Investment</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-10 w-10 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalMonths} months</h3>
              <p className="text-gray-600 dark:text-gray-300">Investment Period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${totalInvested.toLocaleString()}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Investment</p>
            </CardContent>
          </Card>
        </div>

        {/* Price Projection Chart */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              HKT Token Price Projections (10-Year Outlook)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Year</th>
                    <th className="text-left py-3 px-4">Projected Price</th>
                    <th className="text-left py-3 px-4">Annual Growth</th>
                    <th className="text-left py-3 px-4">Phase Description</th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map((projection, index) => (
                    <tr key={projection.year} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 font-medium">Year {projection.year}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-lg">${projection.price.toFixed(3)}</span>
                      </td>
                      <td className="py-3 px-4">
                        {projection.growth > 0 ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            +{projection.growth.toFixed(1)}%
                          </Badge>
                        ) : (
                          <Badge variant="outline">Base Year</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {projection.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Investment Returns Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* 3-Year Projection */}
          <Card>
            <CardHeader>
              <CardTitle>3-Year Investment Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Invested:</span>
                <span className="font-bold">${totalInvested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>HKT Tokens Accumulated:</span>
                <span className="font-bold">{threeYearProjection.tokensAccumulated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Projected Token Price:</span>
                <span className="font-bold">$0.152</span>
              </div>
              <div className="flex justify-between">
                <span>Portfolio Value:</span>
                <span className="font-bold text-secondary">${threeYearProjection.finalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Profit:</span>
                <span className="font-bold text-green-600">${threeYearProjection.profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ROI:</span>
                <span className="font-bold text-accent">{threeYearProjection.roi.toFixed(1)}%</span>
              </div>
              <Progress value={threeYearProjection.roi} className="h-3" />
            </CardContent>
          </Card>

          {/* 10-Year Projection */}
          <Card>
            <CardHeader>
              <CardTitle>10-Year Investment Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Invested:</span>
                <span className="font-bold">${totalInvested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>HKT Tokens Accumulated:</span>
                <span className="font-bold">{tenYearProjection.tokensAccumulated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Projected Token Price:</span>
                <span className="font-bold">$25.00</span>
              </div>
              <div className="flex justify-between">
                <span>Portfolio Value:</span>
                <span className="font-bold text-secondary">${tenYearProjection.finalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Profit:</span>
                <span className="font-bold text-green-600">${tenYearProjection.profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ROI:</span>
                <span className="font-bold text-accent">{tenYearProjection.roi.toLocaleString()}%</span>
              </div>
              <Progress value={100} className="h-3" />
            </CardContent>
          </Card>
        </div>

        {/* Development Milestones */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Platform Development Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    milestone.status === 'completed' ? 'bg-green-500 text-white' :
                    milestone.status === 'in-progress' ? 'bg-blue-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {milestone.year}
                  </div>
                  <div>
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <Badge 
                      variant={milestone.status === 'completed' ? 'default' : 'outline'}
                      className="text-xs mt-1"
                    >
                      {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1).replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Risk Factors & Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Market Risks</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Cryptocurrency market volatility</li>
                  <li>• Real estate market fluctuations</li>
                  <li>• Regulatory changes affecting crypto or real estate</li>
                  <li>• Competition from other tokenization platforms</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Platform Risks</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Technology risks and smart contract vulnerabilities</li>
                  <li>• Adoption rate lower than projected</li>
                  <li>• Property management and maintenance costs</li>
                  <li>• Liquidity risks in secondary markets</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
            <p className="text-lg mb-6">
              Begin building your real estate portfolio with monthly HKT investments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Start Investing Today
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Download Full Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}