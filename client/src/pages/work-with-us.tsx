import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Globe, 
  Heart, 
  Zap,
  MapPin,
  Mail,
  ExternalLink
} from 'lucide-react';

export default function WorkWithUs() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Competitive Compensation',
      description: 'Attractive salary packages with equity options and performance bonuses'
    },
    {
      icon: Globe,
      title: 'Remote-First Culture',
      description: 'Work from anywhere with flexible hours and global team collaboration'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs'
    },
    {
      icon: Zap,
      title: 'Professional Growth',
      description: 'Learning opportunities, conference attendance, and career development support'
    }
  ];

  const openPositions = [
    {
      title: 'Senior Blockchain Developer',
      location: 'Remote',
      type: 'Full-time',
      department: 'Engineering',
      description: 'Lead smart contract development and blockchain integration for our real estate tokenization platform.',
      requirements: ['5+ years Solidity experience', 'DeFi protocol knowledge', 'Security audit experience']
    },
    {
      title: 'Real Estate Investment Analyst',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      department: 'Investment',
      description: 'Analyze and evaluate investment opportunities, conduct due diligence on potential properties.',
      requirements: ['Real estate finance background', 'Property valuation skills', 'Market analysis experience']
    },
    {
      title: 'Product Marketing Manager',
      location: 'Remote',
      type: 'Full-time',
      department: 'Marketing',
      description: 'Drive product positioning, go-to-market strategies, and user acquisition campaigns.',
      requirements: ['Crypto/DeFi marketing experience', 'Growth hacking skills', 'Content creation abilities']
    },
    {
      title: 'Frontend Developer (React/TypeScript)',
      location: 'Remote',
      type: 'Full-time',
      department: 'Engineering',
      description: 'Build and maintain our user-facing platform with focus on Web3 integration and user experience.',
      requirements: ['React/TypeScript expertise', 'Web3 integration experience', 'UI/UX sensitivity']
    },
    {
      title: 'Community Manager',
      location: 'Remote',
      type: 'Full-time',
      department: 'Marketing',
      description: 'Build and engage our community across social platforms, manage investor relations.',
      requirements: ['Social media expertise', 'Crypto community experience', 'Content creation skills']
    },
    {
      title: 'Legal & Compliance Specialist',
      location: 'Remote',
      type: 'Full-time',
      department: 'Legal',
      description: 'Ensure regulatory compliance, manage legal documentation, work with regulatory bodies.',
      requirements: ['Securities law knowledge', 'Crypto regulation experience', 'Real estate law background']
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Work With Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join our mission to democratize real estate investment through blockchain technology. 
            We're building the future of property ownership and looking for passionate individuals to join our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Briefcase className="h-5 w-5 mr-2" />
              View Open Positions
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="h-5 w-5 mr-2" />
              Contact HR Team
            </Button>
          </div>
        </div>

        {/* Company Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Democratization</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Making real estate investment accessible to everyone, regardless of background or wealth.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Pushing boundaries with cutting-edge blockchain technology and creative solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Transparency</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Building trust through open communication and blockchain-based transparency.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Work With Us?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We offer more than just a job - we offer a career in the future of finance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join our growing team and help shape the future of real estate investment
            </p>
          </div>
          
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{position.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{position.department}</Badge>
                        <Badge variant="outline">{position.type}</Badge>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-1" />
                          {position.location}
                        </div>
                      </div>
                    </div>
                    <Button>
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{position.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Key Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Application Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Apply Online</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Submit your application through our career portal</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Initial Screening</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">HR review and initial phone/video call</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Technical Interview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Role-specific technical assessment and team interview</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Final Decision</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Reference check and job offer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Don't See Your Perfect Role?</h2>
            <p className="text-lg mb-6">
              We're always looking for talented individuals. Send us your resume and tell us how you'd like to contribute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Mail className="h-5 w-5 mr-2" />
                careers@homekrypto.com
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Submit General Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}