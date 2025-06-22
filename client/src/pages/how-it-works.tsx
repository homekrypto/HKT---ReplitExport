import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Wallet, 
  Coins, 
  TrendingUp,
  MapPin,
  Calendar,
  Key,
  Umbrella,
  PiggyBank,
  Sprout,
  RefreshCw,
  Gavel,
  Globe,
  CheckSquare,
  Building
} from 'lucide-react';
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
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-primary'
    },
    {
      year: 2,
      title: 'Year 2: Growth Phase',
      description: 'HKT Price: $0.115 | Quarterly Investment: $320.40 | Total HKT: 23,960',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-secondary'
    },
    {
      year: 3,
      title: 'Year 3: Maturity & Returns',
      description: 'HKT Price: $0.152 | Final Portfolio: $5,300 | Profit: $1,454 (37.8% ROI)',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconBg: 'bg-accent'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How HKT Works</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Investment Timeline</h3>
            <div className="space-y-6">
              {timelineData.map((phase, index) => (
                <div key={index} className={`flex items-center space-x-6 p-4 ${phase.bgColor} rounded-lg border border-gray-200 dark:border-gray-700`}>
                  <div className={`w-12 h-12 ${phase.iconBg} rounded-full flex items-center justify-center text-white font-bold`}>
                    {phase.year}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{phase.title}</h4>
                    <p className="text-gray-700 dark:text-gray-200 font-medium">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Quarterly Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUARTERLY_BREAKDOWN.map((quarter, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Year {quarter.year} Q{quarter.quarter}</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">${quarter.hktPrice.toFixed(3)}</span>
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

      {/* Step-by-Step Investment Process */}
      <section className="py-16 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Your Journey to Property Shares: Step-by-Step with HKT
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our Pilot Model & Beyond - How investing with Home Krypto will work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">1. We Source High-Potential Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Home Krypto's team identifies properties with strong investment potential. Our initial focus is on high-demand locations worldwide, especially those effective for short-term rental income. For example, our pilot vision centers on a property in a popular tourist destination, ideal for vacation stays.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">2. Properties are Divided into Affordable "Slices"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  The chosen property (e.g., an apartment valued at $200,000 in our pilot concept) is structured for shared ownership. In our pilot model, this means dividing ownership into 52 shares – with each share representing the right to use the property for one week per year, or to benefit from its rental.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white">3. Choose Your Share(s) & Invest with HKT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  You'll explore properties on our platform. Select the property and decide how many HKT shares you want to purchase. You can start small! Acquiring HKT tokens monthly, even with amounts like $100-$200, is like building your crypto portfolio and steadily working towards owning a tangible property share.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">4. You Own a Piece of Real Estate!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Congratulations! You now own a real share of the property. Your ownership, represented by HKT, is transparently and securely recorded on the blockchain.
                </p>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors md:col-span-2 lg:col-span-2">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Umbrella className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">5. Enjoy the Benefits of Your Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">As an HKT shareholder in a property like our pilot:</p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="font-semibold text-white mr-2">Use Your Week:</span>
                    Enjoy staying at the property during your allocated week(s).
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-white mr-2">Earn Rental Income:</span>
                    If you choose not to use your week(s), opt to rent it out and receive your portion of the rental profit.
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-white mr-2">Potential Value Growth:</span>
                    If the property's value increases, your share's value could also increase.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pilot Benefits Section */}
      <section className="py-16 bg-gray-800 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              The Home Krypto Pilot: Smart Ownership, Flexible Investing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benefit 1 */}
            <div className="flex items-start space-x-4 p-6 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Affordable Vacation Home Access</h4>
                <p className="text-gray-300">
                  Own a guaranteed week in a high-demand tourist spot for a fraction of the cost of buying a whole vacation property.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start space-x-4 p-6 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Invest & Grow Steadily</h4>
                <p className="text-gray-300">
                  Think of your monthly HKT purchases as a dual-benefit strategy: investing in crypto (HKT) and progressively building towards tangible real estate ownership.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start space-x-4 p-6 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-5 w-5 text-black" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Flexible Use & Income Potential</h4>
                <p className="text-gray-300">
                  Enjoy your week, or turn it into an income-generating asset by renting it out.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start space-x-4 p-6 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Gavel className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">True Ownership, Not Timeshare</h4>
                <p className="text-gray-300">
                  You own a real share of the property, recorded on the blockchain, with potential for value appreciation.
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="flex items-start space-x-4 p-6 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Expanding Global Network (Future Vision)</h4>
                <p className="text-gray-300">
                  Our vision includes partnering with leading real estate agents worldwide for a growing selection of prime properties.
                </p>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="flex items-start space-x-4 p-6 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Simplified Investing with HKT</h4>
                <p className="text-gray-300">
                  Transparent blockchain records and a platform designed for ease of use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to See the Potential?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/buy-hkt">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg">
                Explore HKT Token Purchase
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
                Join Waitlist for Launch Updates
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
