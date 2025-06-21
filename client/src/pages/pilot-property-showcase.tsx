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

  const properties = [
    {
      id: 1,
      title: "Luxury Resort Villas - Punta Cana",
      location: "Punta Cana, Dominican Republic",
      image: dominican1,
      price: "$285,000",
      tokenPrice: "1,875 HKT",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      occupancyRate: "92%",
      yearlyReturn: "18.5%",
      amenities: ["Private Pool", "Ocean View", "Resort Access", "Concierge"],
      description: "Stunning 2-bedroom villas in a premier resort complex with direct beach access and world-class amenities."
    },
    {
      id: 2,
      title: "Modern Condos - Bavaro Beach",
      location: "Bavaro, Dominican Republic",
      image: dominican2,
      price: "$195,000",
      tokenPrice: "1,281 HKT",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 850,
      occupancyRate: "88%",
      yearlyReturn: "16.2%",
      amenities: ["Beach Access", "Pool", "Gym", "Restaurant"],
      description: "Contemporary condos just steps from pristine beaches with exceptional rental demand year-round."
    },
    {
      id: 3,
      title: "Penthouse Suites - Cap Cana",
      location: "Cap Cana, Dominican Republic",
      image: dominican3,
      price: "$450,000",
      tokenPrice: "2,960 HKT",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1800,
      occupancyRate: "85%",
      yearlyReturn: "22.3%",
      amenities: ["Rooftop Terrace", "Marina View", "Golf Access", "Spa"],
      description: "Exclusive penthouse units with panoramic views and access to championship golf courses."
    },
    {
      id: 4,
      title: "Beachfront Apartments - La Romana",
      location: "La Romana, Dominican Republic",
      image: dominican4,
      price: "$165,000",
      tokenPrice: "1,085 HKT",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750,
      occupancyRate: "94%",
      yearlyReturn: "19.8%",
      amenities: ["Direct Beach", "Pool", "Bar", "Water Sports"],
      description: "Prime beachfront location with exceptional rental performance and stunning ocean views."
    }
  ];

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
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
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
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {property.occupancyRate} Occupied
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {property.price}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      {property.tokenPrice}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {property.description}
                </p>
                
                {/* Property Details */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">{property.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">{property.bathrooms} Bath</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">{property.sqft} sqft</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Yearly Return</div>
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {property.yearlyReturn}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Occupancy</div>
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {property.occupancyRate}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Amenities</div>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  View Property Details
                </Button>
              </CardContent>
            </Card>
          ))}
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
                <p className="text-gray-600 dark:text-gray-300">
                  Strategically located in the world's most sought-after tourist destinations with year-round demand.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Proven Performance</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Each property has demonstrated consistent high occupancy rates and strong rental yields.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Amenities</h3>
                <p className="text-gray-600 dark:text-gray-300">
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
              Ready to Invest in These Properties?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join our pilot program and start earning returns from day one. With fractional ownership through HKT tokens, 
              you can diversify across multiple properties with minimal capital requirements.
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