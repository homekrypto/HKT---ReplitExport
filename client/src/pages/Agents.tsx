import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SEO from '@/components/SEO';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Linkedin, 
  Building, 
  Award,
  Users,
  Search,
  Filter,
  Star,
  UserPlus
} from 'lucide-react';
import { useLocation } from 'wouter';

interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  city: string;
  country: string;
  bio: string;
  specializations: string[];
  yearsExperience: number;
  languagesSpoken: string[];
  profileImage: string;
  website: string;
  linkedIn: string;
  referralLink: string;
}

export default function Agents() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['/api/agents/approved'],
  });

  // Filter agents based on search criteria
  const filteredAgents = agents.filter((agent: Agent) => {
    const matchesSearch = !searchTerm || 
      `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = !selectedCountry || agent.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  // Get unique countries for filters
  const uniqueCountries = [...new Set(agents.map((agent: Agent) => agent.country))].sort();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading our professional agents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Find Real Estate Agents - Crypto Property Investment Specialists | HKT"
        description="Browse verified real estate agents specializing in cryptocurrency-funded property investments. Find licensed professionals in your area who understand blockchain and digital asset transactions."
        keywords="crypto real estate agents, blockchain property specialists, cryptocurrency property investment, real estate professionals, verified agents, property investment experts"
        url={`${window.location.origin}/agents`}
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            HomeKrypto Partner Agents
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Connect with licensed real estate professionals specializing in crypto property investments
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{agents.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Verified Agents</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{uniqueCountries.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Countries Covered</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">2.5%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Agent Commission</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Agent
            </CardTitle>
            <CardDescription>
              Search by name, city, or company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by name, city, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="">All Countries</option>
                  {uniqueCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agents Grid */}
        {filteredAgents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No agents found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search criteria or browse all agents.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCountry('');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent: Agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={agent.profileImage} alt={`${agent.firstName} ${agent.lastName}`} />
                      <AvatarFallback className="text-lg">
                        {agent.firstName[0]}{agent.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">
                    {agent.firstName} {agent.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {agent.city}, {agent.country}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {agent.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>{agent.company}</span>
                    </div>
                  )}
                  
                  {agent.yearsExperience && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span>{agent.yearsExperience} years experience</span>
                    </div>
                  )}

                  {agent.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {agent.bio}
                    </p>
                  )}

                  {agent.specializations && agent.specializations.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Specializations:</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.specializations.slice(0, 3).map(spec => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {agent.specializations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {agent.languagesSpoken && agent.languagesSpoken.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Languages:</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {agent.languagesSpoken.slice(0, 3).join(', ')}
                        {agent.languagesSpoken.length > 3 && ` +${agent.languagesSpoken.length - 3} more`}
                      </div>
                    </div>
                  )}

                  {/* Contact Options */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" className="flex-1" asChild>
                      <a href={`mailto:${agent.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </a>
                    </Button>
                    {agent.website && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={agent.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {agent.linkedIn && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={agent.linkedIn} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="text-center p-8">
            <h3 className="text-2xl font-bold mb-4">Are You a Licensed Real Estate Agent?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Join our network of professional agents and earn commissions on crypto real estate investments. 
              Get valuable SEO backlinks and access to high-value clients interested in blockchain-based property ownership.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setLocation('/agent-registration')}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Become a Partner Agent
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation('/properties')}
              >
                View Properties
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}