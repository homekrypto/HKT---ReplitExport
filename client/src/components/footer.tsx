import { Link } from 'wouter';

export default function Footer() {
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
