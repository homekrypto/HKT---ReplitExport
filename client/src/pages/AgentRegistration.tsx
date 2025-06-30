import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import SEO from '@/components/SEO';
import { 
  UserPlus, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Award,
  Languages,
  Briefcase,
  CheckCircle
} from 'lucide-react';

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
  'Portugal', 'Australia', 'New Zealand', 'Japan', 'Singapore', 'Hong Kong', 'United Arab Emirates',
  'Switzerland', 'Austria', 'Belgium', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland',
  'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Costa Rica', 'Panama', 'Dominican Republic',
  'India', 'Thailand', 'Malaysia', 'Philippines', 'Indonesia', 'South Korea', 'Taiwan', 'Israel',
  'South Africa', 'Turkey', 'Greece', 'Cyprus', 'Malta', 'Monaco', 'Luxembourg', 'Liechtenstein'
];

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese (Mandarin)',
  'Chinese (Cantonese)', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi', 'Dutch'
];

export default function AgentRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    licenseNumber: '',
    city: '',
    country: 'United States',
    website: '',
    linkedIn: '',
    bio: '',
    yearsExperience: '',
    languagesSpoken: [] as string[],
    seoBacklinkUrl: '',
    agreeToTerms: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/agents/register', data);
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast({
        title: 'Registration Submitted!',
        description: 'Your agent registration has been submitted for review.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please check your information and try again.',
        variant: 'destructive'
      });
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: checked 
        ? [...prev.languagesSpoken, language]
        : prev.languagesSpoken.filter(l => l !== language)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate email is required - everything else is optional
    if (!formData.email || formData.email.trim() === '') {
      toast({
        title: 'Email Required',
        description: 'Please provide your email address to submit your registration.',
        variant: 'destructive'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }

    const submitData = {
      ...formData,
      yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : 0
    };

    registerMutation.mutate(submitData);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Registration Submitted!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thank you for your interest in becoming a HomeKrypto partner agent. Your application has been submitted and will be reviewed within 1-2 business days.
              </p>
              
              {/* SEO Backlink Instructions */}
              <div className="space-y-4 text-left bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Boost Your Approval Chances
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Add a link to HomeKrypto from your website to improve your approval chances and increase your visibility:
                </p>
                <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    {'<a href="https://homekrypto.com" target="_blank" rel="dofollow">Proud Partner of HomeKrypto</a>'}
                  </code>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-500">
                  Place this code in your website footer, About page, or anywhere visible to visitors. This helps with faster approval and better search rankings.
                </p>
              </div>

              <div className="space-y-4 text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                <h3 className="font-semibold">What happens next:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Our team will verify your license and credentials</li>
                  <li>• You'll receive an approval notification via email</li>
                  <li>• Once approved, you'll get your custom referral link</li>
                  <li>• Your profile will go live on our platform</li>
                  <li>• You'll gain access to the agent dashboard</li>
                </ul>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setLocation('/')}>
                  Return Home
                </Button>
                <Button variant="outline" onClick={() => setLocation('/agents')}>
                  View Our Agents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Become a HomeKrypto Real Estate Agent - Join Our Network | HKT"
        description="Join HomeKrypto's network of certified real estate agents specializing in crypto-funded property investments. Get your professional agent profile, earn commissions, and connect with crypto-savvy clients."
        keywords="real estate agent registration, crypto real estate, blockchain property investment, agent network, real estate careers, property investment professional"
        url={`${window.location.origin}/agent-registration`}
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Become a HomeKrypto Partner Agent
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Join our network of professional real estate agents and earn commissions on crypto real estate investments
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Premium Commission</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Earn 2.5% commission on all successful investments</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <Globe className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">SEO Benefits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get valuable backlinks to boost your website ranking</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <UserPlus className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Lead Generation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Access to high-value crypto-savvy clients</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic contact and professional details. Only email is required - everything else helps us create a better profile for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name <span className="text-gray-500">(optional)</span></Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name <span className="text-gray-500">(optional)</span></Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Your last name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="your@email.com (required for contact)"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number <span className="text-gray-500">(optional)</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="company">Company/Brokerage</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Optional - Your real estate company or brokerage"
                />
              </div>
            </CardContent>
          </Card>

          {/* License Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                License Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Brief description of your experience and expertise..."
                  rows={4}
                />
              </div>
              


              <div>
                <Label>Languages Spoken</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {LANGUAGES.map(lang => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={lang}
                        checked={formData.languagesSpoken.includes(lang)}
                        onCheckedChange={(checked) => handleLanguageChange(lang, checked as boolean)}
                      />
                      <Label htmlFor={lang} className="text-sm">{lang}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Online Presence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Online Presence & SEO
              </CardTitle>
              <CardDescription>
                Help us promote your business and improve your SEO ranking
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://your-website.com"
                />
                <p className="text-sm text-gray-500 mt-1">We'll include a backlink to your website from your agent profile</p>
              </div>
              <div>
                <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                <Input
                  id="linkedIn"
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>
              <div>
                <Label htmlFor="seoBacklinkUrl">SEO Backlink Target URL</Label>
                <Input
                  id="seoBacklinkUrl"
                  type="url"
                  value={formData.seoBacklinkUrl}
                  onChange={(e) => handleInputChange('seoBacklinkUrl', e.target.value)}
                  placeholder="https://specific-page-you-want-to-rank.com"
                />
                <p className="text-sm text-gray-500 mt-1">Specific page you want us to link to for SEO purposes (can be different from main website)</p>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2 mb-6">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the terms and conditions of the HomeKrypto Agent Partnership Program and confirm that all provided information is accurate.
                </Label>
              </div>

              <Alert className="mb-6">
                <AlertDescription>
                  All agent applications are reviewed manually. You will receive an email notification within 1-2 business days regarding your application status.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={registerMutation.isPending || !formData.agreeToTerms}
              >
                {registerMutation.isPending ? 'Submitting...' : 'Submit Agent Registration'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
    </>
  );
}