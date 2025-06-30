import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  TrendingUp, 
  DollarSign, 
  Home, 
  Calculator,
  ArrowLeft,
  Calendar,
  Target,
  Coins,
  LineChart,
  PieChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface PropertyInvestment {
  propertyValue: number;
  sharePrice: number;
  totalShares: number;
  sharesOwned: number;
  hktTokensPerShare: number;
  annualRentalYield: number;
  freeWeeksPerShare: number;
}

interface HKTProjection {
  year: number;
  price: number;
  totalValue: number;
  rentalIncome: number;
  freeWeekValue: number;
  totalReturn: number;
}

export default function InvestmentSimulation() {
  const [, setLocation] = useLocation();
  const [sharesOwned, setSharesOwned] = useState(1);
  const [initialHKTPrice] = useState(0.10);
  const [yearlyIncrease] = useState(0.01);
  const [projections, setProjections] = useState<HKTProjection[]>([]);
  const [propertyData, setPropertyData] = useState<PropertyInvestment>({
    propertyValue: 195000,
    sharePrice: 3750, // $3,750 USD
    totalShares: 52, // 52 weeks
    sharesOwned: 1,
    hktTokensPerShare: 37500, // 37,500 HKT at $0.10
    annualRentalYield: 0.12, // 12% annual yield
    freeWeeksPerShare: 1
  });

  useEffect(() => {
    calculateProjections();
  }, [sharesOwned]);

  const calculateProjections = () => {
    const projectionData: HKTProjection[] = [];
    
    for (let year = 0; year <= 5; year++) {
      const currentHKTPrice = initialHKTPrice + (year * yearlyIncrease);
      const totalHKTOwned = propertyData.hktTokensPerShare * sharesOwned;
      const totalValue = totalHKTOwned * currentHKTPrice;
      
      // Annual rental income (property generates 12% yield)
      const propertyPortionOwned = sharesOwned / propertyData.totalShares;
      const annualRentalIncome = propertyData.propertyValue * propertyData.annualRentalYield * propertyPortionOwned;
      
      // Free week value (market rate for accommodations)
      const weeklyRentalValue = 2000; // $2,000 per week market rate
      const freeWeekValue = sharesOwned * weeklyRentalValue;
      
      // Total return calculation
      const initialInvestment = propertyData.sharePrice * sharesOwned;
      const totalReturn = ((totalValue + (annualRentalIncome * year) + freeWeekValue - initialInvestment) / initialInvestment) * 100;
      
      projectionData.push({
        year,
        price: currentHKTPrice,
        totalValue,
        rentalIncome: annualRentalIncome * year,
        freeWeekValue,
        totalReturn
      });
    }
    
    setProjections(projectionData);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const pieChartData = [
    { name: 'HKT Token Value', value: projections[5]?.totalValue || 0 },
    { name: 'Rental Income (5yr)', value: projections[5]?.rentalIncome || 0 },
    { name: 'Free Week Benefits', value: projections[5]?.freeWeekValue || 0 }
  ];

  const initialInvestment = propertyData.sharePrice * sharesOwned;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation('/booking/cap-cana-villa')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Property Investment Simulation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              See what happens when you invest in property shares and HKT tokens appreciate over 5 years
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>HKT grows $0.01 annually</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-blue-500" />
                <span>12% annual rental yield</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span>Free week benefits included</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investment Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Investment Configuration
                </CardTitle>
                <CardDescription>
                  Adjust your investment to see projected returns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shares Selector */}
                <div className="space-y-3">
                  <Label>Number of Property Shares</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[sharesOwned]}
                      onValueChange={(value) => setSharesOwned(value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1 share</span>
                      <span className="font-medium">{sharesOwned} share{sharesOwned > 1 ? 's' : ''}</span>
                      <span>10 shares</span>
                    </div>
                  </div>
                </div>

                {/* Investment Summary */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Share Price:</span>
                    <span className="font-medium">${propertyData.sharePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HKT per Share:</span>
                    <span className="font-medium">{propertyData.hktTokensPerShare.toLocaleString()} HKT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Investment:</span>
                    <span className="font-bold text-blue-600">${initialInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total HKT Owned:</span>
                    <span className="font-bold text-green-600">
                      {(propertyData.hktTokensPerShare * sharesOwned).toLocaleString()} HKT
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Cap Cana Villa</h4>
                    <div className="space-y-1 text-sm">
                      <div>Property Value: ${propertyData.propertyValue.toLocaleString()}</div>
                      <div>Total Shares: {propertyData.totalShares}</div>
                      <div>Annual Yield: {(propertyData.annualRentalYield * 100).toFixed(1)}%</div>
                      <div>Your Ownership: {((sharesOwned / propertyData.totalShares) * 100).toFixed(2)}%</div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Benefits Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Investment Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">{sharesOwned} Free Week{sharesOwned > 1 ? 's' : ''}/Year</div>
                    <div className="text-sm text-green-600">Worth ${(sharesOwned * 2000).toLocaleString()}/year</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Rental Income</div>
                    <div className="text-sm text-blue-600">
                      ${((propertyData.propertyValue * propertyData.annualRentalYield * sharesOwned) / propertyData.totalShares).toFixed(0)}/year
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Coins className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">HKT Appreciation</div>
                    <div className="text-sm text-purple-600">$0.01 increase per year</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projections and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${projections[5]?.totalValue.toFixed(0) || '0'}
                  </div>
                  <div className="text-sm text-gray-600">HKT Value (Year 5)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${projections[5]?.rentalIncome.toFixed(0) || '0'}
                  </div>
                  <div className="text-sm text-gray-600">Rental Income (5yr)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${projections[5]?.freeWeekValue.toFixed(0) || '0'}
                  </div>
                  <div className="text-sm text-gray-600">Free Week Value</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {projections[5]?.totalReturn.toFixed(1) || '0'}%
                  </div>
                  <div className="text-sm text-gray-600">Total Return</div>
                </CardContent>
              </Card>
            </div>

            {/* Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Investment Growth Over 5 Years
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          `$${Number(value).toLocaleString()}`, 
                          name === 'totalValue' ? 'HKT Token Value' : 
                          name === 'rentalIncome' ? 'Cumulative Rental Income' : name
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalValue" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        name="HKT Token Value"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rentalIncome" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Cumulative Rental Income"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Value Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Total Value Breakdown (Year 5)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Year-by-Year Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {projections.map((projection, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <div className="font-medium">Year {projection.year}</div>
                          <div className="text-sm text-gray-600">HKT: ${projection.price.toFixed(3)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${projection.totalValue.toFixed(0)}</div>
                          <div className={`text-sm ${projection.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {projection.totalReturn >= 0 ? '+' : ''}{projection.totalReturn.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investment Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Scenarios Comparison</CardTitle>
                <CardDescription>
                  Compare different investment levels and their 5-year outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Shares</th>
                        <th className="text-left p-2">Initial Investment</th>
                        <th className="text-left p-2">HKT Tokens</th>
                        <th className="text-left p-2">5-Year HKT Value</th>
                        <th className="text-left p-2">5-Year Rental Income</th>
                        <th className="text-left p-2">Free Week Value</th>
                        <th className="text-left p-2">Total Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 5, 10].map((shares) => {
                        const investment = shares * propertyData.sharePrice;
                        const hktTokens = shares * propertyData.hktTokensPerShare;
                        const year5HKTValue = hktTokens * (initialHKTPrice + 5 * yearlyIncrease);
                        const rentalIncome = (propertyData.propertyValue * propertyData.annualRentalYield * shares / propertyData.totalShares) * 5;
                        const freeWeekValue = shares * 2000;
                        const totalValue = year5HKTValue + rentalIncome + freeWeekValue;
                        const totalReturn = ((totalValue - investment) / investment) * 100;
                        
                        return (
                          <tr key={shares} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-2 font-medium">{shares}</td>
                            <td className="p-2">${investment.toLocaleString()}</td>
                            <td className="p-2">{hktTokens.toLocaleString()}</td>
                            <td className="p-2">${year5HKTValue.toFixed(0)}</td>
                            <td className="p-2">${rentalIncome.toFixed(0)}</td>
                            <td className="p-2">${freeWeekValue.toLocaleString()}</td>
                            <td className="p-2 font-medium text-green-600">+{totalReturn.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Start Your Investment Journey?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Property shares are available now. Start with just 1 share and grow your portfolio over time.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => setLocation('/booking/cap-cana-villa')}
                    size="lg"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Book Your Property Share
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/properties')}
                    size="lg"
                  >
                    View All Properties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}