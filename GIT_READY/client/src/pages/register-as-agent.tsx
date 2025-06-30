import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Globe,
  Upload,
  CheckCircle,
  Star
} from 'lucide-react';

export default function RegisterAsAgent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    licenseNumber: '',
    experience: '',
    specializations: [] as string[],
    portfolio: '',
    references: '',
    agreeTerms: false,
    agreeMarketing: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, specialization]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specializations: prev.specializations.filter(s => s !== specialization)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted Successfully",
        description: "We'll review your application and contact you within 3-5 business days.",
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        licenseNumber: '',
        experience: '',
        specializations: [],
        portfolio: '',
        references: '',
        agreeTerms: false,
        agreeMarketing: false
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Commission',
      description: 'Earn up to 3% commission on successful property tokenizations'
    },
    {
      icon: Users,
      title: 'Global Network',
      description: 'Access to international investors and high-net-worth clients'
    },
    {
      icon: TrendingUp,
      title: 'Recurring Income',
      description: 'Ongoing revenue from property management fees and renewals'
    },
    {
      icon: Shield,
      title: 'Platform Support',
      description: 'Full marketing, legal, and technical support from our team'
    }
  ];

  const specializations = [
    'Vacation Rentals',
    'Residential Properties',
    'Commercial Real Estate',
    'Luxury Properties',
    'International Markets',
    'Development Projects',
    'REITs Management',
    'Property Valuation'
  ];

  const requirements = [
    'Valid real estate license in your jurisdiction',
    'Minimum 2 years of real estate experience',
    'Track record of successful property sales',
    'Professional references from clients or colleagues',
    'Understanding of cryptocurrency and blockchain basics',
    'Commitment to HKT platform standards and values'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Register as a Real Estate Agent
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join our network of professional real estate agents and help democratize property investment 
            through blockchain technology. Earn competitive commissions while expanding your client base globally.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Registration Form */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Agent Registration Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          placeholder="Your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          placeholder="Your last name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company">Company/Brokerage</Label>
                        <Input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Your real estate company"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="licenseNumber">Real Estate License Number *</Label>
                        <Input
                          id="licenseNumber"
                          type="text"
                          value={formData.licenseNumber}
                          onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                          required
                          placeholder="Your license number"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="experience">Years of Experience *</Label>
                        <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2-5">2-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10-15">10-15 years</SelectItem>
                            <SelectItem value="15+">15+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Specializations</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {specializations.map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={spec}
                            checked={formData.specializations.includes(spec)}
                            onCheckedChange={(checked) => handleSpecializationChange(spec, checked as boolean)}
                          />
                          <Label htmlFor={spec} className="text-sm">{spec}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio & References */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Portfolio & References</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="portfolio">Portfolio/Track Record</Label>
                        <Textarea
                          id="portfolio"
                          value={formData.portfolio}
                          onChange={(e) => handleInputChange('portfolio', e.target.value)}
                          placeholder="Describe your key achievements, notable sales, and areas of expertise..."
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="references">Professional References</Label>
                        <Textarea
                          id="references"
                          value={formData.references}
                          onChange={(e) => handleInputChange('references', e.target.value)}
                          placeholder="Provide contact information for 2-3 professional references..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Agreement Checkboxes */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                        required
                      />
                      <Label htmlFor="agreeTerms" className="text-sm">
                        I agree to the <a href="/terms-and-conditions" className="text-primary hover:underline">Terms and Conditions</a> and 
                        <a href="/privacy-policy" className="text-primary hover:underline ml-1">Privacy Policy</a> *
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeMarketing"
                        checked={formData.agreeMarketing}
                        onCheckedChange={(checked) => handleInputChange('agreeMarketing', checked as boolean)}
                      />
                      <Label htmlFor="agreeMarketing" className="text-sm">
                        I agree to receive marketing communications and updates about new opportunities
                      </Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>Submitting Application...</>
                    ) : (
                      <>
                        <Building className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Benefits and Requirements */}
          <div className="space-y-8">
            
            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Agent Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Process Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Submit Application</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Complete and submit the registration form</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Review & Verification</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">We verify your credentials and references (3-5 days)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Interview & Onboarding</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Video interview and platform training session</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Start Earning</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Access agent dashboard and begin listing properties</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Questions?</h3>
                <p className="text-sm mb-4">
                  Contact our agent relations team for more information
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  agents@homekrypto.com
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}