import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, TrendingUp, Shield, Users, Globe } from 'lucide-react';

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Home Krypto Token Whitepaper
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Democratizing Real Estate Investment Through Blockchain Technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </Button>
            <Button size="lg" variant="outline">
              <FileText className="h-5 w-5 mr-2" />
              Technical Documentation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">15% Annual Growth</h3>
              <p className="text-gray-600 dark:text-gray-300">Projected token appreciation based on real estate performance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-10 w-10 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Blockchain Security</h3>
              <p className="text-gray-600 dark:text-gray-300">Transparent ownership records on Ethereum blockchain</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fractional Ownership</h3>
              <p className="text-gray-600 dark:text-gray-300">Start investing with as little as $106.83/month</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="mr-3">1</Badge>
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Home Krypto Token (HKT) represents a revolutionary approach to real estate investment, leveraging blockchain technology to democratize access to premium properties. Our platform enables fractional ownership through digital tokens, allowing investors to participate in real estate markets previously accessible only to high-net-worth individuals. With a focus on vacation rental properties and a proven 52-week sharing model, HKT provides both investment returns and lifestyle benefits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="mr-3">2</Badge>
                Market Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-lg font-semibold">Real Estate Market Size</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Global real estate market valued at $3.7 trillion annually</li>
                <li>Vacation rental market growing at 7.9% CAGR</li>
                <li>Limited accessibility for retail investors</li>
                <li>High barriers to entry with traditional real estate</li>
              </ul>
              
              <h4 className="text-lg font-semibold mt-6">Blockchain Adoption</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>$2.3 billion in real estate tokenization by 2025</li>
                <li>Increased transparency and liquidity</li>
                <li>Smart contract automation reducing costs</li>
                <li>Growing institutional acceptance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="mr-3">3</Badge>
                HKT Token Economics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Token Details</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Standard:</strong> ERC-20</li>
                    <li><strong>Current Price:</strong> $0.152</li>
                    <li><strong>Supply:</strong> Limited and deflationary</li>
                    <li><strong>Network:</strong> Ethereum</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3">Value Drivers</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Property appreciation</li>
                    <li>Rental income distribution</li>
                    <li>Token scarcity mechanisms</li>
                    <li>Platform growth and adoption</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="mr-3">4</Badge>
                Technology Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-lg font-semibold">Blockchain Infrastructure</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Ethereum blockchain for security and transparency</li>
                <li>Smart contracts for automated distributions</li>
                <li>IPFS for decentralized document storage</li>
                <li>Multi-signature wallets for fund security</li>
              </ul>
              
              <h4 className="text-lg font-semibold mt-6">Platform Features</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Real-time portfolio tracking</li>
                <li>Automated rental income distribution</li>
                <li>Property management dashboard</li>
                <li>Secondary market for token trading</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="mr-3">5</Badge>
                Investment Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-lg font-semibold">Pilot Program: 52-Week Ownership</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Our initial focus centers on vacation rental properties divided into 52 shares, representing weekly ownership rights. This model provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Guaranteed vacation weeks for personal use</li>
                <li>Rental income when not occupied by owner</li>
                <li>Professional property management</li>
                <li>Potential for property value appreciation</li>
              </ul>
              
              <h4 className="text-lg font-semibold mt-6">Expansion Plans</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Residential rental properties</li>
                <li>Commercial real estate</li>
                <li>International property markets</li>
                <li>Real estate development projects</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="mr-3">6</Badge>
                Roadmap & Future Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold">Q1 2025 - Platform Launch</h4>
                  <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                    <li>Initial token offering and platform deployment</li>
                    <li>First pilot property tokenization</li>
                    <li>KYC/AML compliance implementation</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold">Q2-Q3 2025 - Expansion</h4>
                  <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                    <li>Additional property acquisitions</li>
                    <li>Secondary market development</li>
                    <li>Mobile application launch</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold">Q4 2025 - Scale</h4>
                  <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                    <li>International market entry</li>
                    <li>Institutional investor partnerships</li>
                    <li>Advanced DeFi integrations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="mr-3">7</Badge>
                Risk Factors & Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                  ⚠️ Important Investment Warning
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                  Cryptocurrency and real estate investments carry significant risks. Past performance does not guarantee future results.
                </p>
              </div>
              
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Market volatility and regulatory uncertainty</li>
                <li>Property-specific risks including vacancy and maintenance</li>
                <li>Technology risks related to blockchain infrastructure</li>
                <li>Liquidity risks in secondary markets</li>
                <li>Potential for total loss of investment</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8">
              <Globe className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Join the Future of Real Estate</h3>
              <p className="text-lg mb-6">
                Start your journey with HKT and be part of the real estate revolution
              </p>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Get Started Today
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}