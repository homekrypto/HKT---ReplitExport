import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import InvestmentCalculator from './investment-calculator';

export default function HeroSection() {
  return (
    <>
      {/* Hero Section - Apple-Inspired Design */}
      <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black min-h-screen flex items-center overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/20 dark:from-blue-900/10 dark:via-transparent dark:to-green-900/5"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* Pre-headline - Creates anticipation */}
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium rounded-full shadow-lg">
                Premium Properties Made Accessible
              </span>
            </div>

            {/* Main headline - Emotional and aspirational */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 text-gray-900 dark:text-white leading-tight tracking-tight">
              Own Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent font-medium">
                Dream Property
              </span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl text-gray-600 dark:text-gray-400">
                Starting Today
              </span>
            </h1>

            {/* Subheadline - Problem-focused with emotional appeal */}
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              Why wait for "someday" when you can start building your property portfolio 
              <span className="text-gray-900 dark:text-white font-medium"> right now</span>? 
              HKT makes premium real estate accessible to everyone.
            </p>

            {/* Social proof elements */}
            <div className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Properties Available</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Blockchain Secured</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Start from $100</span>
              </div>
            </div>
            
            {/* Call-to-action buttons - Apple-style minimalism */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/pilot-property-showcase">
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-4 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium"
                >
                  Start Investing Now
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-lg px-12 py-4 w-full sm:w-auto text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium"
                >
                  Learn More →
                </Button>
              </Link>
            </div>

            {/* Value proposition cards - Minimalist Apple style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="group p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 relative">
                  {/* Custom geometric design - Dollar symbol made of circles */}
                  <div className="relative">
                    <div className="w-4 h-4 border-2 border-white rounded-full absolute -top-1 -left-1"></div>
                    <div className="w-2 h-6 bg-white rounded-full"></div>
                    <div className="w-4 h-4 border-2 border-white rounded-full absolute -bottom-1 -right-1"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start Small</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Begin with amounts that fit your budget</p>
              </div>

              <div className="group p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 relative">
                  {/* Custom geometric design - Abstract building shapes */}
                  <div className="flex space-x-1">
                    <div className="w-1 h-6 bg-white rounded-full"></div>
                    <div className="w-1 h-4 bg-white rounded-full mt-2"></div>
                    <div className="w-1 h-5 bg-white rounded-full mt-1"></div>
                    <div className="w-1 h-3 bg-white rounded-full mt-3"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Own Globally</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Access premium properties worldwide</p>
              </div>

              <div className="group p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 relative">
                  {/* Custom geometric design - Shield made of hexagons */}
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-white transform rotate-45"></div>
                    <div className="w-3 h-3 bg-white transform rotate-45 absolute top-1 left-1"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Stay Secure</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Blockchain technology ensures transparency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-green-200 dark:bg-green-900 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 animate-float-slow"></div>
      </section>

      {/* Investment Calculator Section */}
      <div id="investment-calculator">
        <InvestmentCalculator />
      </div>
    </>
  );
}