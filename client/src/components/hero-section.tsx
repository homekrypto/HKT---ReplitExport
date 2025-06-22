import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import InvestmentCalculator from './investment-calculator';

export default function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 [text-shadow:_0_2px_4px_rgb(255_255_255_/_50%)] dark:[text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
              Home Krypto: Making Global Real Estate Investment Accessible to Everyone, Starting with Shares You Can Afford.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Stop dreaming, start owning. Invest in property the smart, modern way.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/how-it-works">
                <Button size="lg" className="text-lg px-8 py-3 w-full sm:w-auto">
                  Learn How It Works
                </Button>
              </Link>
              <Link href="/pilot-property-showcase">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 w-full sm:w-auto">
                  View Example Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Calculator Section */}
      <div id="investment-calculator">
        <InvestmentCalculator />
      </div>
    </>
  );
}