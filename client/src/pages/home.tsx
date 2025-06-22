import HeroSection from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { 
  AlertTriangle as Roadblock, 
  Key, 
  PiggyBank, 
  Settings, 
  Globe, 
  Shield 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Problem Solution Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white drop-shadow-sm">
            Tired of Real Estate Roadblocks? HKT is Changing That.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="mb-4 flex justify-center">
                <Roadblock className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white drop-shadow-sm">
                Traditional Investing Can Be Tough
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-medium">
                <li>High Costs & Down Payments</li>
                <li>Complex & Slow Processes</li>
                <li>Hard to Sell Quickly (Illiquid)</li>
              </ul>
            </div>
            <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="mb-4 flex justify-center">
                <Key className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white drop-shadow-sm">
                HKT Makes it Accessible & Simple
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-medium">
                <li>Start with Affordable Shares</li>
                <li>Simplified & Transparent Process (Our Vision)</li>
                <li>Easier to Trade Shares (Future Goal)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Introducing Home Krypto */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Home Krypto: Your New Path to Property Ownership
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Home Krypto uses our secure Home Krypto Token (HKT) and transparent blockchain technology to allow you to own fractional shares of real estate. We're focused on making property investment easy to understand, secure, and letting you start with amounts that fit your budget.
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose Home Krypto? The Advantages of HKT.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4 flex justify-center">
                <PiggyBank className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Affordable Start</h3>
              <p className="text-gray-600 dark:text-gray-300">Invest with what you can afford...</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4 flex justify-center">
                <Settings className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Simplified Process</h3>
              <p className="text-gray-600 dark:text-gray-300">Our goal is a clear, straightforward way...</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4 flex justify-center">
                <Globe className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Global Access (Our Vision)</h3>
              <p className="text-gray-600 dark:text-gray-300">Explore diverse property opportunities...</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4 flex justify-center">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Secure & Transparent</h3>
              <p className="text-gray-600 dark:text-gray-300">Your ownership is planned to be recorded securely...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Property Showcase */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Affordable Property Shares: Real Examples, Future Potential
          </h2>
          <p className="text-lg text-gray-300 text-center mb-12 max-w-4xl mx-auto">
            Discover how Home Krypto is making desirable property ownership a reality. Our pilot focus is on high-yield vacation destinations like Cap Cana, with exciting city-based investments planned for key international hubs like Miami and Madrid.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Cap Cana Pilot */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="aspect-video rounded-t-lg overflow-hidden">
                <img 
                  src="https://homekrypto.com/wp-content/uploads/2025/06/invest-in-dominican-republic.jpg"
                  alt="Cap Cana Property - Luxury Dominican Republic Real Estate"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">Marvelous Cap Cana Condo (Our Pilot Focus)</h3>
                <p className="text-gray-300 mb-4">Luxury 2-Bed/2-Bath condo in Ciudad Las Canas. High rental demand (80-85% occupancy) in a prime Dominican Republic tourist hub.</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Investment Options (Illustrative):</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Own a "Week-Share":</span>
                      <div className="text-green-400 font-semibold">~$3,750 USD (approx. 37,500 HKT @ $0.10)</div>
                      <div className="text-gray-300">Your annual getaway + rental income.</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Start Investing Monthly with HKT:</span>
                      <div className="text-green-400 font-semibold">From ~$100 - $200 USD / month</div>
                      <div className="text-gray-300">Accumulate HKT for your share.</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Micro-Share Entry:</span>
                      <div className="text-green-400 font-semibold">From ~$75 USD (approx. 750 HKT @ $0.10)</div>
                      <div className="text-gray-300">Begin your property investment.</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">Based on illustrative $195k property value. Live values will vary.</p>
              </CardContent>
            </Card>

            {/* Miami Coming Soon */}
            <Card className="bg-gray-800 border-gray-700 opacity-75">
              <div className="aspect-video bg-gray-600 rounded-t-lg flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gray-700 opacity-50"></div>
                <div className="relative text-center">
                  <div className="text-white font-bold text-2xl mb-2">PHOTO</div>
                  <div className="text-white font-bold text-2xl">COMING SOON</div>
                </div>
                <div className="absolute top-2 right-2 bottom-2 left-2 border-4 border-white opacity-30 rounded"></div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">Vibrant Miami Condo (Coming Soon!)</h3>
                <p className="text-gray-300 mb-4">
                  <strong>Status: Under planning with developers.</strong> Experience the allure of Miami, Florida! This upcoming HKT opportunity targets properties ideal for the dynamic short-term rental market, aiming for 90-95% rental occupancy.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Anticipated Investment Options:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Own a Full Share (Conceptual):</span>
                      <div className="text-blue-400 font-semibold">~$3,846 USD (Based on $200k value / 52 shares)</div>
                      <div className="text-gray-300">Invest in Miami's thriving property scene.</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">Illustrative $200k property value. Details subject to finalization.</p>
              </CardContent>
            </Card>

            {/* Madrid Coming Soon */}
            <Card className="bg-gray-800 border-gray-700 opacity-75">
              <div className="aspect-video bg-gray-600 rounded-t-lg flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gray-700 opacity-50"></div>
                <div className="relative text-center">
                  <div className="text-white font-bold text-2xl mb-2">PHOTO</div>
                  <div className="text-white font-bold text-2xl">COMING SOON</div>
                </div>
                <div className="absolute top-2 right-2 bottom-2 left-2 border-4 border-white opacity-30 rounded"></div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">Chic Madrid Residence (Coming Soon!)</h3>
                <p className="text-gray-300 mb-4">
                  <strong>Status: Under planning with developers.</strong> An elegant residence planned for a sought-after Madrid neighborhood, targeting 90-95% rental occupancy.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Anticipated Investment Options:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Own a Full Share (Conceptual):</span>
                      <div className="text-blue-400 font-semibold">~$3,846 USD (Based on $200k value / 52 shares)</div>
                      <div className="text-gray-300">Invest in Spain's vibrant capital lifestyle.</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">Illustrative $200k property value. Details subject to finalization.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Expanding to Global Prime Locations</h3>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              While Cap Cana represents our exciting pilot, Home Krypto's vision extends worldwide. We are actively planning with developers to bring tokenized properties from major global cities like Miami (USA) and Madrid (Spain), targeting locations with 90-95% occupancy rates to maximize investor returns.
            </p>
            <Link href="/pilot-property-showcase">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                Learn More About Our Pilot & Future Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What is HKT */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Meet HKT: Your Key to Property Investment
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            The Home Krypto Token (HKT) is our platform's specially designed digital token. Think of it as the simple, secure 'key' you use to easily buy and hold your shares in real estate. HKT is what makes our transparent and accessible investment system work.
          </p>
          <Link href="/what-is-hkt">
            <Button variant="outline" size="lg">
              Learn More About HKT
            </Button>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore the Future of Real Estate?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Sign up for our waitlist to get exclusive updates on platform development, our pilot property launch, HKT news, and early access opportunities.
          </p>
          <Link href="/join-waitlist">
            <Button size="lg" className="text-lg px-12 py-4">
              Join Our Waitlist
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}