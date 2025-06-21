import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useApp } from '@/contexts/AppContext';
import { Mail } from 'lucide-react';
import ThemeToggle from './theme-toggle';
import LanguageSelector from './language-selector';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const { t } = useApp();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/subscribe', { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t.toast.subscribeSuccess,
        description: t.toast.subscribeSuccessDesc,
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: t.toast.subscribeFailed,
        description: error.message || t.toast.subscribeFailedDesc,
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
      title: t.footer.product,
      links: [
        { label: t.footer.howItWorks, href: '/how-it-works' },
        { label: t.footer.investmentPlans, href: '/buy-hkt' },
        { label: 'Properties', href: '/properties' },
        { label: 'Pilot Properties', href: '/pilot-property-showcase' }
      ]
    },
    {
      title: t.footer.resources,
      links: [
        { label: t.footer.whitepaper, href: '/whitepaper' },
        { label: t.footer.faq, href: '/faq' },
        { label: 'Work With Us', href: '/work-with-us' },
        { label: 'Contact', href: '/contact' }
      ]
    },
    {
      title: t.footer.legal,
      links: [
        { label: 'Terms & Conditions', href: '/terms-and-conditions' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Our Mission', href: '/our-mission' },
        { label: 'For Developers', href: '/for-developers' }
      ]
    }
  ];

  const socialLinks = [
    { icon: 'fab fa-facebook', href: 'https://www.facebook.com/profile.php?id=61576090167804', label: 'Facebook' },
    { icon: 'fab fa-twitter', href: 'https://x.com/HomeKryptoToken', label: 'Twitter' },
    { icon: 'fab fa-instagram', href: 'https://www.instagram.com/homekryptotoken/', label: 'Instagram' },
    { icon: 'fab fa-telegram', href: 'http://t.me/homekryptotoken', label: 'Telegram' },
    { icon: 'fab fa-facebook', href: 'https://www.facebook.com/groups/1826127334876593', label: 'Facebook Group' }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">HKT</h3>
            <p className="text-gray-300 dark:text-gray-400">
              Democratizing real estate investment through blockchain technology
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Stay Updated</h4>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Get the latest HKT news and investment opportunities.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 dark:bg-gray-900 border-gray-600 dark:border-gray-700 text-white placeholder-gray-400 flex-1"
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
            
            {/* Theme and Language Controls */}
            <div className="flex flex-col space-y-3 pt-4">
              <ThemeToggle />
              <LanguageSelector />
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
        
        <div className="border-t border-gray-700 dark:border-gray-800 mt-12 pt-8 text-center text-gray-400 dark:text-gray-500">
          <p>&copy; 2025 Home Krypto Token. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Contract: 0x0de50324B6960B15A5ceD3D076aE314ac174Da2e
          </p>
        </div>
      </div>
    </footer>
  );
}
