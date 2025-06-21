import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Github, 
  Book, 
  Zap, 
  Shield, 
  Database,
  Network,
  Terminal,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

export default function ForDevelopers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sdkExamples = {
    javascript: `// Install HKT SDK
npm install @homekrypto/sdk

// Initialize SDK
import { HKTClient } from '@homekrypto/sdk';

const client = new HKTClient({
  network: 'mainnet', // or 'testnet'
  apiKey: 'your-api-key'
});

// Get token price
const price = await client.getTokenPrice();
console.log('HKT Price:', price);

// Get property data
const properties = await client.getProperties();
console.log('Available properties:', properties);

// Purchase tokens
const transaction = await client.purchaseTokens({
  amount: 100, // USD amount
  propertyId: 'property-123'
});`,
    
    python: `# Install HKT Python SDK
pip install homekrypto-sdk

# Initialize client
from homekrypto import HKTClient

client = HKTClient(
    network='mainnet',
    api_key='your-api-key'
)

# Get token price
price = client.get_token_price()
print(f"HKT Price: {price}")

# Get property data
properties = client.get_properties()
print(f"Available properties: {properties}")

# Purchase tokens
transaction = client.purchase_tokens(
    amount=100,  # USD amount
    property_id='property-123'
)`,

    solidity: `// HKT Token Contract Interface
pragma solidity ^0.8.19;

interface IHKT {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function getPropertyShares(address investor) external view returns (uint256[]);
    function claimRentalIncome() external;
}

// Example integration
contract PropertyInvestment {
    IHKT public hktToken;
    
    constructor(address _hktToken) {
        hktToken = IHKT(_hktToken);
    }
    
    function investInProperty(uint256 amount, uint256 propertyId) external {
        // Transfer HKT tokens for property investment
        require(hktToken.transfer(address(this), amount), "Transfer failed");
        
        // Your investment logic here
        _processInvestment(msg.sender, amount, propertyId);
    }
}`
  };

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/token/price',
      description: 'Get current HKT token price',
      response: '{ "price": 0.152, "change24h": 2.5 }'
    },
    {
      method: 'GET',
      endpoint: '/api/properties',
      description: 'List available properties',
      response: '{ "properties": [...], "total": 25 }'
    },
    {
      method: 'POST',
      endpoint: '/api/invest',
      description: 'Create investment transaction',
      response: '{ "txHash": "0x...", "status": "pending" }'
    },
    {
      method: 'GET',
      endpoint: '/api/portfolio/{address}',
      description: 'Get investor portfolio',
      response: '{ "totalValue": 5000, "properties": [...] }'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Architecture',
      description: 'Built on Ethereum with audited smart contracts and enterprise-grade security'
    },
    {
      icon: Database,
      title: 'Comprehensive APIs',
      description: 'RESTful APIs and GraphQL endpoints for all platform functionality'
    },
    {
      icon: Network,
      title: 'Multi-chain Support',
      description: 'Ethereum mainnet with planned expansion to Layer 2 solutions'
    },
    {
      icon: Zap,
      title: 'Real-time Data',
      description: 'WebSocket connections for live price feeds and transaction updates'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Developer Resources
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Build powerful applications with the HKT ecosystem. Access our APIs, SDKs, 
            and developer tools to integrate real estate investment features into your platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Code className="h-5 w-5 mr-2" />
              Get API Key
            </Button>
            <Button size="lg" variant="outline">
              <Github className="h-5 w-5 mr-2" />
              View on GitHub
            </Button>
            <Button size="lg" variant="outline">
              <Book className="h-5 w-5 mr-2" />
              Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">SDK Examples</h2>
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="solidity">Solidity</TabsTrigger>
                </TabsList>
                
                {Object.entries(sdkExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang}>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                        <code>{code}</code>
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-4 right-4"
                        onClick={() => copyToClipboard(code, lang)}
                      >
                        {copiedCode === lang ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* API Reference */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">API Reference</h2>
          <div className="space-y-4">
            {apiEndpoints.map((api, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={api.method === 'GET' ? 'secondary' : 'default'}
                        className="font-mono"
                      >
                        {api.method}
                      </Badge>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        {api.endpoint}
                      </code>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300">{api.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Example Response:</h4>
                    <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                      <code>{api.response}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Smart Contract Addresses */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Smart Contracts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mainnet Contracts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">HKT Token Contract</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs flex-1">
                      0x0de50324B6960B15A5ceD3D076aE314ac174Da2e
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard('0x0de50324B6960B15A5ceD3D076aE314ac174Da2e', 'mainnet-token')}
                    >
                      {copiedCode === 'mainnet-token' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-semibold">Property Registry</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs flex-1">
                      0x1234567890123456789012345678901234567890
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard('0x1234567890123456789012345678901234567890', 'mainnet-registry')}
                    >
                      {copiedCode === 'mainnet-registry' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Testnet Contracts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">HKT Token Contract (Sepolia)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs flex-1">
                      0xabcdef1234567890abcdef1234567890abcdef12
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard('0xabcdef1234567890abcdef1234567890abcdef12', 'testnet-token')}
                    >
                      {copiedCode === 'testnet-token' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Developer Community */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Developer Community</h2>
            <p className="text-lg mb-6">
              Connect with other developers building on the HKT ecosystem
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Github className="h-5 w-5 mr-2" />
                GitHub Discussions
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Terminal className="h-5 w-5 mr-2" />
                Developer Discord
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <ExternalLink className="h-5 w-5 mr-2" />
                API Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}