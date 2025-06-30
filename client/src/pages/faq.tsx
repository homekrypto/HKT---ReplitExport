import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'investment' | 'technical' | 'legal';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What is Home Krypto Token (HKT)?',
    answer: 'HKT is a blockchain-based token that represents fractional ownership in real estate properties. Each token gives you a share in premium properties, rental income, and potential appreciation.',
    category: 'general'
  },
  {
    id: '2',
    question: 'How much do I need to start investing?',
    answer: 'You can start investing with as little as $106.83 per month. Our platform is designed to make real estate investment accessible to everyone, regardless of your budget.',
    category: 'investment'
  },
  {
    id: '3',
    question: 'How does the 52-week ownership model work?',
    answer: 'In our pilot program, properties are divided into 52 shares representing weekly ownership. You can use your allocated week(s) for vacation or rent them out for income. This model provides both lifestyle benefits and investment returns.',
    category: 'investment'
  },
  {
    id: '4',
    question: 'What blockchain does HKT use?',
    answer: 'HKT is built on the Ethereum blockchain using the ERC-20 standard. This ensures security, transparency, and compatibility with existing DeFi infrastructure.',
    category: 'technical'
  },
  {
    id: '5',
    question: 'How do I buy HKT tokens?',
    answer: 'You can purchase HKT tokens through our integrated Uniswap widget. Simply connect your MetaMask wallet, choose the amount you want to invest, and complete the transaction.',
    category: 'general'
  },
  {
    id: '6',
    question: 'What returns can I expect?',
    answer: 'Our projections show approximately 15% annual token appreciation based on property performance. However, all investments carry risk and past performance does not guarantee future results.',
    category: 'investment'
  },
  {
    id: '7',
    question: 'How is rental income distributed?',
    answer: 'Rental income is distributed proportionally to token holders after deducting property management fees, maintenance costs, and platform fees. Distributions are typically made quarterly.',
    category: 'investment'
  },
  {
    id: '8',
    question: 'Can I sell my HKT tokens?',
    answer: 'Yes, HKT tokens can be traded on decentralized exchanges like Uniswap. We are also developing a secondary marketplace for easier trading between users.',
    category: 'technical'
  },
  {
    id: '9',
    question: 'What types of properties do you invest in?',
    answer: 'Currently, we focus on vacation rental properties in high-demand tourist destinations. We plan to expand to residential rentals, commercial properties, and international markets.',
    category: 'investment'
  },
  {
    id: '10',
    question: 'Is HKT regulated?',
    answer: 'We operate in compliance with applicable securities and cryptocurrency regulations. Our platform includes KYC/AML procedures and we work with legal experts to ensure compliance.',
    category: 'legal'
  },
  {
    id: '11',
    question: 'What are the risks of investing in HKT?',
    answer: 'Risks include market volatility, property-specific issues (vacancy, damage), regulatory changes, technology risks, and potential total loss of investment. Please read our risk disclosures carefully.',
    category: 'legal'
  },
  {
    id: '12',
    question: 'How do I connect my wallet?',
    answer: 'We currently support MetaMask wallet integration. Simply click "Connect Wallet" on our platform and follow the prompts to link your MetaMask wallet securely.',
    category: 'technical'
  },
  {
    id: '13',
    question: 'What fees does the platform charge?',
    answer: 'We charge a platform transaction fee, property management fees, and various operational expenses. All fees are transparently disclosed before any transaction.',
    category: 'general'
  },
  {
    id: '14',
    question: 'Can I use my property weeks for personal vacation?',
    answer: 'Yes! In our pilot model, you can book and use your allocated property weeks for personal vacation. This is one of the unique benefits of our ownership model.',
    category: 'investment'
  },
  {
    id: '15',
    question: 'How do you select properties?',
    answer: 'Our team identifies properties with strong investment potential, focusing on high-demand locations, vacation rental performance, and growth prospects. We conduct thorough due diligence on all properties.',
    category: 'investment'
  },
  {
    id: '16',
    question: 'What is Home Krypto?',
    answer: 'Home Krypto is a decentralized real estate investment and booking platform powered by the HKT token. Users can invest in properties, earn perks, and book vacation rentals using either fiat or crypto — all through blockchain technology.',
    category: 'general'
  },
  {
    id: '17',
    question: 'Can I invest in properties?',
    answer: 'Yes. Property NFTs represent fractional ownership. Investors earn a share of income and perks.',
    category: 'investment'
  },
  {
    id: '18',
    question: 'Is there a DAO or voting system?',
    answer: 'Yes. The GovernanceDAO contract allows token and NFT holders to vote on major platform decisions.',
    category: 'technical'
  },
  {
    id: '19',
    question: 'Who can I contact for help?',
    answer: 'You can reach our support team at support@homekrypto.com or through the contact form on the platform.',
    category: 'general'
  },
  {
    id: '20',
    question: 'Are there any risks?',
    answer: 'Yes. As with any crypto-related project, there are risks related to market volatility, technology, and regulation. Please read our Risk Disclaimer and Terms & Conditions.',
    category: 'legal'
  },
  {
    id: '21',
    question: 'Is the booking system fully reliable and robust now?',
    answer: 'Yes! The booking system is 100% complete with advanced edge case handling, including: Full date validation (no past or invalid date ranges; max 365 nights), Guest count limits tailored per property, Real-time HKT price validation with fallback logic, Network connectivity awareness with online/offline detection.',
    category: 'technical'
  },
  {
    id: '22',
    question: 'How does the system handle connectivity or server issues?',
    answer: 'It features an automatic retry system using exponential backoff (waiting longer between retries), plus request timeouts to prevent hanging requests. Users get clear error messages and retry counters for transparency.',
    category: 'technical'
  },
  {
    id: '23',
    question: 'What about wallet connections like MetaMask?',
    answer: 'Wallet connections are optimized with smooth state management and detailed error handling specifically for MetaMask or other wallets, ensuring a seamless user experience.',
    category: 'technical'
  },
  {
    id: '24',
    question: 'Does the UI show real-time updates?',
    answer: 'Yes, the booking UI includes: Real-time HKT price updates every 60 seconds, with timestamps, Connection status indicators (online/offline), Professional loading animations and color-coded booking terms, Automatic form resets after successful booking.',
    category: 'technical'
  },
  {
    id: '25',
    question: 'What happens if the system goes offline or encounters unexpected errors?',
    answer: 'The system gracefully degrades, providing clear feedback and preventing user frustration. It automatically recovers when services become available again.',
    category: 'technical'
  },
  {
    id: '26',
    question: 'How does this affect user experience?',
    answer: 'The enhanced error recovery, network resilience, and polished UI ensure a premium, professional-grade booking experience similar to top-tier platforms like Airbnb.',
    category: 'general'
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'investment', label: 'Investment' },
    { value: 'technical', label: 'Technical' },
    { value: 'legal', label: 'Legal' }
  ];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'investment': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'technical': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'legal': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Find answers to common questions about HKT and real estate investment
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="text-xs"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <Card className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No questions found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search terms or category filter.
              </p>
            </Card>
          ) : (
            filteredFAQs.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.question}
                        </h3>
                      </div>
                      <div className="ml-4">
                        {openItems.includes(item.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-lg mb-6">
              Our support team is here to help you with any questions about HKT investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Support
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Schedule a Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}