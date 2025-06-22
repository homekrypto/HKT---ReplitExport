import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  TrendingUp, 
  Calendar,
  Users,
  Star,
  DollarSign,
  Building,
  Globe
} from 'lucide-react';
import { Link } from 'wouter';
import { useScrollToTop } from '@/hooks/useScrollToTop';

// Import property images
import dominican1 from '@assets/invest-in-dominican-republic_1750519048069.jpg';
import dominican2 from '@assets/invest-in-properties-in-punta-cana-dominican-republic-scaled_1750519048071.jpg';
import dominican3 from '@assets/real-estate-buy-with-crypto-scaled_1750519048071.jpg';
import dominican4 from '@assets/invest-in-real-estate-and-cryptoo-at-same-time-scaled_1750519048072.jpg';

export default function PilotPropertyShowcase() {
  useScrollToTop();

  const property = {
    title: "Luxury Resort Complex - Punta Cana",
    location: "Punta Cana, Dominican Republic",
    images: [dominican1, dominican2, dominican3, dominican4],
    price: "$195,000",
    tokenPrice: "37,500 HKT",
    sharePrice: "$3,750",
    shareTokens: "37,500 HKT",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    occupancyRate: "92%",
    yearlyReturn: "18.5%",
    amenities: ["Private Pool", "Ocean View", "Resort Access", "Concierge", "Beach Access", "Spa", "Golf Access", "Marina View"],
    description: "Stunning luxury resort complex featuring modern villas, condos, and penthouse suites with direct beach access, world-class amenities, and exceptional rental performance in one of the Caribbean's most popular destinations."
  };

  const stats = [
    {
      icon: Globe,
      title: "Global Tourist Destinations",
      value: "15+",
      description: "Properties in top vacation hotspots worldwide"
    },
    {
      icon: TrendingUp,
      title: "Average Annual Return",
      value: "19.2%",
      description: "Based on short-term rental performance"
    },
    {
      icon: Users,
      title: "Occupancy Rate",
      value: "89.7%",
      description: "Average across all pilot properties"
    },
    {
      icon: Building,
      title: "Properties Available",
      value: "48",
      description: "Ready for tokenized investment"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Pilot Program
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Pilot Property Showcase
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto font-medium">
            Discover our carefully selected portfolio of short-term rental properties in the world's most popular tourist destinations. 
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

        {/* Property Showcase */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            {/* Image Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="grid grid-cols-2 gap-0">
                {property.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`${property.title} - View ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          {property.occupancyRate} Occupied
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {property.title}
                    </h2>
                    <div className="flex items-center text-gray-700 dark:text-gray-400 mb-4 font-medium">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      Property Value: {property.price}
                    </div>
                    <div className="text-lg text-blue-600 dark:text-blue-400 mt-2">
                      Share (1 Week): {property.sharePrice}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      ~{property.shareTokens} @ $0.10 HKT/USD
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">
                  {property.description}
                </p>
                
                {/* Property Details */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{property.sqft} sqft</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Yearly Return</div>
                    <div className="text-2xl font-semibold text-green-600 dark:text-green-400">
                      {property.yearlyReturn}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Occupancy Rate</div>
                    <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {property.occupancyRate}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Premium Amenities</div>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Invest in This Property
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Why These Properties Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Why These Properties Excel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Prime Locations</h3>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Strategically located in the world's most sought-after tourist destinations with year-round demand.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Proven Performance</h3>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Each property has demonstrated consistent high occupancy rates and strong rental yields.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Amenities</h3>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Fully equipped with luxury amenities that command premium rates and attract discerning travelers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Opportunity */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Invest in This Property?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto font-medium">
              Start with just $3,750 USD for a 1-week share in this luxury resort complex. 
              Get fractional ownership through 37,500 HKT tokens at $0.10 per token and earn returns from short-term rentals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy-hkt">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Start Investing Now
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