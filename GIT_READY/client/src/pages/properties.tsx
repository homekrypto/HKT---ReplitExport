import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  TrendingUp, 
  Users,
  Star,
  DollarSign,
  Building,
  Globe,
  ArrowRight,
  Calendar,
  Shield,
  Trophy
} from 'lucide-react';
import { Link } from 'wouter';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function Properties() {
  useScrollToTop();

  const stats = [
    {
      icon: Building,
      title: "Active Properties",
      value: "48",
      description: "Premium locations worldwide"
    },
    {
      icon: Globe,
      title: "Countries",
      value: "15+",
      description: "Top tourist destinations"
    },
    {
      icon: TrendingUp,
      title: "Average ROI",
      value: "19.2%",
      description: "Annual returns from rentals"
    },
    {
      icon: Users,
      title: "Occupancy Rate",
      value: "89.7%",
      description: "Average across portfolio"
    }
  ];

  const regions = [
    {
      name: "Caribbean",
      properties: 12,
      featured: "Dominican Republic Resort Complex",
      avgReturn: "18.5%",
      description: "Tropical paradise destinations with year-round demand"
    },
    {
      name: "Mediterranean",
      properties: 8,
      featured: "Spanish Coast Villas",
      avgReturn: "16.8%",
      description: "Historic coastal properties in prime European locations"
    },
    {
      name: "Southeast Asia",
      properties: 15,
      featured: "Bali Luxury Resorts",
      avgReturn: "21.3%",
      description: "Exotic destinations with exceptional growth potential"
    },
    {
      name: "Central America",
      properties: 13,
      featured: "Costa Rica Eco-Lodges",
      avgReturn: "17.9%",
      description: "Sustainable tourism properties in pristine locations"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "All properties undergo rigorous due diligence and legal verification"
    },
    {
      icon: Trophy,
      title: "Premium Locations",
      description: "Hand-picked properties in the world's most desirable tourist destinations"
    },
    {
      icon: DollarSign,
      title: "Fractional Ownership",
      description: "Start investing with as little as $3,750 for a weekly share"
    },
    {
      icon: TrendingUp,
      title: "Proven Returns",
      description: "Track record of consistent high occupancy and strong rental yields"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Global Portfolio
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Properties
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto font-medium">
            Discover our carefully curated portfolio of short-term rental properties in the world's most popular tourist destinations. 
            Each property is optimized for maximum occupancy and returns through our innovative tokenized investment model.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {stat.title}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Property Showcase */}
        <Card className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Featured Property
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Luxury Resort Complex - Punta Cana
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 font-medium">
                  Our flagship property showcasing the potential of tokenized real estate investment. 
                  Located in one of the Caribbean's premier destinations with exceptional rental performance.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">$195,000</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Property Value</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">18.5%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Annual Return</div>
                  </div>
                </div>
                <Link href="/pilot-property-showcase">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    View Property Details
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Weekly Share Price</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">$3,750</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    37,500 HKT @ $0.10 per token
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Occupancy Rate</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">92%</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Location</span>
                    <span className="text-sm font-medium">Punta Cana, DR</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Portfolio */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Global Portfolio by Region
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regions.map((region, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{region.name}</CardTitle>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {region.properties} Properties
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {region.avgReturn} ROI
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {region.description}
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Featured Property</div>
                    <div className="font-medium">{region.featured}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Our Properties */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why Our Properties Excel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Investment Process */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How Property Investment Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Choose Your Property</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Browse our verified portfolio and select properties that match your investment goals and risk profile.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Purchase HKT Tokens</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Buy fractional ownership through HKT tokens. Start with as little as $3,750 for a weekly share.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Earn Rental Returns</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive your share of rental income from short-term vacation rentals managed by our expert team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Property Investment Journey?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of investors who are already earning passive income from premium vacation rental properties 
              in the world's most desirable destinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pilot-property-showcase">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Building className="h-5 w-5 mr-2" />
                  View Featured Property
                </Button>
              </Link>
              <Link href="/buy-hkt">
                <Button size="lg" variant="outline">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Start Investing
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}