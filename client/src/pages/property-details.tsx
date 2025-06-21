import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  Star,
  Wifi,
  Car,
  Coffee,
  Waves
} from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useRoute } from 'wouter';

// Import property images
import dominican1 from '@assets/invest-in-dominican-republic_1750519048069.jpg';
import dominican2 from '@assets/invest-in-properties-in-punta-cana-dominican-republic-scaled_1750519048071.jpg';
import dominican3 from '@assets/real-estate-buy-with-crypto-scaled_1750519048071.jpg';
import dominican4 from '@assets/invest-in-real-estate-and-cryptoo-at-same-time-scaled_1750519048072.jpg';

export default function PropertyDetails() {
  useScrollToTop();
  const [match, params] = useRoute('/property-details/:id');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const property = {
    id: 1,
    name: "Luxury Resort Complex - Punta Cana",
    location: "Punta Cana, Dominican Republic",
    images: [dominican1, dominican2, dominican3, dominican4],
    price: 195000,
    tokenPrice: 37500,
    sharePrice: 3750,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    occupancyRate: 92,
    yearlyReturn: 18.5,
    monthlyIncome: 487.50,
    totalTokens: 1300000,
    availableTokens: 962500,
    description: "Stunning luxury resort complex featuring modern villas, condos, and penthouse suites with direct beach access, world-class amenities, and exceptional rental performance in one of the Caribbean's most popular destinations."
  };

  const performanceData = [
    { month: 'Jan', occupancy: 89, income: 425.30, bookings: 28 },
    { month: 'Feb', occupancy: 91, income: 445.75, bookings: 29 },
    { month: 'Mar', occupancy: 88, income: 410.20, bookings: 27 },
    { month: 'Apr', occupancy: 94, income: 498.60, bookings: 31 },
    { month: 'May', occupancy: 92, income: 487.50, bookings: 30 },
    { month: 'Jun', occupancy: 95, income: 512.40, bookings: 32 }
  ];

  const maintenanceUpdates = [
    { date: '2024-06-10', type: 'Upgrade', description: 'Pool area renovation completed', cost: 8500, status: 'completed' },
    { date: '2024-05-15', type: 'Maintenance', description: 'HVAC system servicing', cost: 1200, status: 'completed' },
    { date: '2024-04-22', type: 'Repair', description: 'Roof leak repair', cost: 850, status: 'completed' },
    { date: '2024-07-01', type: 'Scheduled', description: 'Quarterly deep cleaning', cost: 600, status: 'scheduled' }
  ];

  const bookingCalendar = [
    { date: '2024-07-01', status: 'booked', rate: 185 },
    { date: '2024-07-02', status: 'booked', rate: 185 },
    { date: '2024-07-03', status: 'available', rate: 165 },
    { date: '2024-07-04', status: 'booked', rate: 210 },
    { date: '2024-07-05', status: 'booked', rate: 210 },
    { date: '2024-07-06', status: 'maintenance', rate: 0 },
    { date: '2024-07-07', status: 'available', rate: 165 }
  ];

  const amenities = [
    { icon: Waves, name: 'Private Beach Access' },
    { icon: Car, name: 'Parking' },
    { icon: Wifi, name: 'High-Speed WiFi' },
    { icon: Coffee, name: 'Kitchen Facilities' },
    { icon: Activity, name: 'Fitness Center' },
    { icon: Users, name: 'Concierge Service' }
  ];

  const tokenMetrics = {
    totalSupply: property.totalTokens,
    circulating: property.totalTokens - property.availableTokens,
    yourTokens: 10156,
    yourShare: ((10156 / property.totalTokens) * 100).toFixed(3),
    currentValue: (10156 * 0.152).toFixed(2),
    monthlyEarnings: ((10156 / property.totalTokens) * property.monthlyIncome).toFixed(2)
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Property ID: {property.id}
            </Badge>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              {property.occupancyRate}% Occupied
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {property.name}
          </h1>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>
        </div>

        {/* Image Gallery and Key Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {property.images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`${property.name} - View ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Investment Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Property Value</div>
                  <div className="text-xl font-bold">${property.price.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Share Price</div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">${property.sharePrice}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Annual Return</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">{property.yearlyReturn}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</div>
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">${property.monthlyIncome}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Position</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tokens Owned:</span>
                    <span className="font-semibold">{tokenMetrics.yourTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ownership Share:</span>
                    <span className="font-semibold">{tokenMetrics.yourShare}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Value:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">${tokenMetrics.currentValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Earnings:</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">${tokenMetrics.monthlyEarnings}</span>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                <DollarSign className="h-4 w-4 mr-2" />
                Buy More Tokens
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Property Details and Performance */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="calendar">Rental Calendar</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">{property.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Bed className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{property.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{property.bathrooms} Bathrooms</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{property.sqft} sqft</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Amenities</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <amenity.icon className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm">{amenity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Token Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Total Token Supply:</span>
                      <span className="font-semibold">{tokenMetrics.totalSupply.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Circulating Supply:</span>
                      <span className="font-semibold">{tokenMetrics.circulating.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Available for Purchase:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{property.availableTokens.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Supply Distribution</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full" 
                          style={{ width: `${(tokenMetrics.circulating / tokenMetrics.totalSupply) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Distributed: {((tokenMetrics.circulating / tokenMetrics.totalSupply) * 100).toFixed(1)}%</span>
                        <span>Available: {((property.availableTokens / tokenMetrics.totalSupply) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy & Income Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="occupancy" stroke="#3b82f6" name="Occupancy %" />
                        <Line yAxisId="right" type="monotone" dataKey="income" stroke="#10b981" name="Income $" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="#8b5cf6" name="Bookings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">$487.50</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Average Monthly Income</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">+8.5% vs last quarter</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">92%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Average Occupancy</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Above market average</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.8</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Guest Rating</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Booking Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookingCalendar.map((booking, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{booking.date}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{booking.status}</div>
                        </div>
                        <div className="text-right">
                          {booking.rate > 0 && (
                            <div className="font-semibold">${booking.rate}/night</div>
                          )}
                          <Badge variant={
                            booking.status === 'booked' ? 'default' : 
                            booking.status === 'available' ? 'secondary' : 
                            'destructive'
                          }>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Maintenance & Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceUpdates.map((update, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            update.status === 'completed' ? 'default' : 
                            update.status === 'scheduled' ? 'secondary' : 
                            'destructive'
                          }>
                            {update.type}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{update.date}</span>
                        </div>
                        <div className="font-medium mt-1">{update.description}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Cost: ${update.cost.toLocaleString()}</div>
                      </div>
                      <Badge variant={update.status === 'completed' ? 'default' : 'secondary'}>
                        {update.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$165</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Average Daily Rate</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">+12% vs last year</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">3.2</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Average Stay (days)</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Optimal length</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">68%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Repeat Guests</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">High satisfaction</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">7</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Days to Book</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Average lead time</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}