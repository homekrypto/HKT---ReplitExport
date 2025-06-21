import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/subscribe', { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about HKT and investment opportunities.",
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      subscribeMutation.mutate(email.trim());
    }
  };

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Investment Plans', href: '/buy-hkt' },
        { label: 'Property Portfolio', href: '/dashboard' },
        { label: 'Tokenomics', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Whitepaper', href: '#' },
        { label: 'Smart Contract', href: '#' },
        { label: 'Audit Reports', href: '#' },
        { label: 'FAQ', href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Risk Disclosure', href: '#' },
        { label: 'Contact Us', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
    { icon: 'fab fa-discord', href: '#', label: 'Discord' },
    { icon: 'fab fa-telegram', href: '#', label: 'Telegram' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">HKT</h3>
            <p className="text-gray-300">
              Revolutionizing real estate investment through blockchain technology.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Stay Updated</h4>
              <p className="text-sm text-gray-400">
                Get the latest HKT news and investment opportunities.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 flex-1"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={subscribeMutation.isPending}
                    className="bg-primary hover:bg-blue-700 text-white px-4"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <i className={`${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-300">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('#') ? (
                      <a href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Home Krypto Token (HKT). All rights reserved.</p>
          <p className="mt-2 text-sm">
            Smart Contract Address: 0x1234...abcd (Ethereum Network)
          </p>
        </div>
      </div>
    </footer>
  );
}
