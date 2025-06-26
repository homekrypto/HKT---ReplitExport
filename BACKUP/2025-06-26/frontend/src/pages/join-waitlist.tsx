import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Mail, CheckCircle, Users, Bell } from 'lucide-react';

export default function JoinWaitlist() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    interests: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const waitlistMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/waitlist', data);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Welcome to the Waitlist!",
        description: "You'll receive exclusive updates about HKT and early access opportunities.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    waitlistMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">You're In!</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Welcome to the Home Krypto waitlist. You'll be among the first to know about:
              </p>
              <div className="space-y-2 text-left mb-6">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-sm">Platform development updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-sm">Cap Cana pilot property launch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-sm">HKT token news and opportunities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-sm">Early access to new features</span>
                </div>
              </div>
              <Button asChild className="w-full">
                <a href="/">Return to Homepage</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Join the Home Krypto Waitlist
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Be the first to access our revolutionary real estate investment platform. Get exclusive updates, early access, and special opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Join Our Exclusive Waitlist</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">What interests you most? (Optional)</Label>
                  <Input
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    placeholder="Real estate investing, crypto, passive income..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={waitlistMutation.isPending}
                >
                  {waitlistMutation.isPending ? 'Joining...' : 'Join Waitlist'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Why Join Early?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Exclusive Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Be among the first to invest in our Cap Cana pilot property and future opportunities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Early Bird Benefits</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Special pricing, bonus tokens, and priority access to premium properties.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Platform Updates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get insider updates on development progress and new features.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Community Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Join our exclusive community of early investors and real estate enthusiasts.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2 text-primary">What to Expect</h4>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• Monthly platform development updates</li>
                  <li>• Exclusive investment opportunities</li>
                  <li>• Educational content about tokenized real estate</li>
                  <li>• Early access to new properties and features</li>
                  <li>• Community events and webinars</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}