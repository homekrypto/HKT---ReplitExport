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
      
      {/* Emotional Problem-Solution Section - Apple Style */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 leading-tight">
              Real Estate Investment
              <br />
              <span className="font-medium text-gray-600 dark:text-gray-400">Reimagined</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto">
              We believe everyone deserves access to premium real estate opportunities. 
              That's why we created HKT.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Before - Traditional Problems */}
            <div className="order-2 md:order-1">
              <div className="space-y-6">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  The Old Way
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-8">
                  Why real estate felt 
                  <span className="text-red-500"> out of reach</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Massive Capital Requirements</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Need $50K+ down payments just to start</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Geographic Limitations</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Stuck with local markets only</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Complex Processes</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Months of paperwork and legal hurdles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* After - HKT Solution */}
            <div className="order-1 md:order-2">
              <div className="space-y-6">
                <div className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                  The HKT Way
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-8">
                  How we make it
                  <span className="text-green-500"> accessible</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Start with $100</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fractional ownership makes it affordable</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Global Portfolio</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Premium properties in top destinations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">One-Click Investment</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Digital-first, blockchain-secured</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introducing HKT - Apple-style Product Introduction */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white text-lg font-medium rounded-full shadow-lg">
                Introducing HKT
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-light text-gray-900 dark:text-white mb-8 leading-tight">
              The Token That
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent font-medium">
                Unlocks Everything
              </span>
            </h2>
            
            <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-light mb-16 max-w-4xl mx-auto leading-relaxed">
              HKT isn't just a token. It's your key to a world where premium real estate 
              is no longer reserved for the wealthy few.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Blockchain Secured</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Every transaction is transparent, immutable, and secured by cutting-edge blockchain technology.
                </p>
              </div>

              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Instant Liquidity</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Trade your property shares instantly, without the typical 3-6 month real estate transaction cycles.
                </p>
              </div>

              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Global Access</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Own pieces of premium properties from Punta Cana to Miami, all from your smartphone.
                </p>
              </div>
            </div>
          </div>
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

      {/* Property Showcase - Apple-style Product Gallery */}
      <section className="py-24 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white text-lg font-medium rounded-full shadow-lg">
                Live Properties
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
              Your Next
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
                Investment Destination
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-4xl mx-auto leading-relaxed">
              Don't just dream about owning that perfect vacation home. 
              <span className="text-white font-medium"> Start today.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Cap Cana Pilot */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="aspect-video rounded-t-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img 
                  src="@assets/invest-in-properties-in-punta-cana-dominican-republic-scaled_1750519048071.jpg"
                  alt="Cap Cana Property - Luxury Dominican Republic Real Estate"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
                  }}
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

          {/* Apple-style Call to Action */}
          <div className="text-center mt-16">
            <h3 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
              The Future of Real Estate
              <br />
              <span className="text-green-400 font-medium">Starts Now</span>
            </h3>
            <p className="text-xl text-gray-300 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
              Cap Cana is just the beginning. Miami, Madrid, and beyond—we're building a global portfolio 
              that puts premium real estate within everyone's reach.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pilot-property-showcase">
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-4 w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium"
                >
                  Explore Properties
                </Button>
              </Link>
              <Link href="/join-waitlist">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-lg px-12 py-4 w-full sm:w-auto text-white hover:bg-white/10 font-medium border border-white/20"
                >
                  Join Waitlist →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HKT Token Section - Apple Product Focus */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-medium rounded-full shadow-lg">
                Powered by HKT
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-8 leading-tight">
              One Token.
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent font-medium">
                Infinite Possibilities.
              </span>
            </h2>
            
            <p className="text-2xl text-gray-600 dark:text-gray-300 font-light mb-16 max-w-3xl mx-auto leading-relaxed">
              HKT isn't just another cryptocurrency. It's your passport to a world where 
              <span className="text-gray-900 dark:text-white font-medium"> every property is within reach</span>.
            </p>

            {/* Token Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Verified Ownership</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Every HKT token represents verified ownership in real properties, secured by blockchain technology that can't be faked or manipulated.
                </p>
              </div>

              <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Trade Instantly</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Sell your property shares in seconds, not months. HKT transforms real estate from the most illiquid asset to the most liquid.
                </p>
              </div>
            </div>

            <Link href="/what-is-hkt">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-12 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-200 font-medium"
              >
                Discover HKT →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA - Apple-style Emotional Close */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-600/10 rounded-full blur-xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight">
              Your Future
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-transparent font-medium">
                Starts Today
              </span>
            </h2>
            
            <p className="text-2xl md:text-3xl text-gray-300 font-light mb-12 max-w-4xl mx-auto leading-relaxed">
              Stop waiting for "someday." Stop watching from the sidelines. 
              <br />
              <span className="text-white font-medium">Your property portfolio begins now.</span>
            </p>

            {/* Social proof elements */}
            <div className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Properties Available Now</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>100% Blockchain Secured</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Start from $100</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/pilot-property-showcase">
                <Button 
                  size="lg" 
                  className="text-xl px-16 py-6 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-medium text-white border-0"
                >
                  Start Investing
                </Button>
              </Link>
              <Link href="/join-waitlist">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-xl px-16 py-6 w-full sm:w-auto text-white hover:bg-white/10 font-medium border-2 border-white/30 hover:border-white/50 transition-all duration-200"
                >
                  Join Waitlist
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-8 max-w-2xl mx-auto">
              Join thousands who are already building their real estate portfolios the smart way. 
              Early access available for waitlist members.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}