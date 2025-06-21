import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Wallet, 
  Building, 
  TrendingUp, 
  Shield,
  Users,
  Globe,
  CheckCircle,
  DollarSign
} from "lucide-react";

export default function HowItWorks() {
  const { t } = useApp();

  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description: "Connect your MetaMask wallet to get started with HKT investments.",
      color: "text-primary"
    },
    {
      icon: DollarSign,
      title: "Set Monthly Investment",
      description: "Choose your monthly investment amount starting from $100.",
      color: "text-secondary"
    },
    {
      icon: Building,
      title: "Automatic Property Investment",
      description: "Your funds are automatically invested in premium real estate properties.",
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      title: "Track Your Growth",
      description: "Monitor your portfolio growth with our comprehensive dashboard.",
      color: "text-primary"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Blockchain-based transparency with full property documentation."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of investors building wealth through real estate."
    },
    {
      icon: Globe,
      title: "Global Properties",
      description: "Access to premium properties across 25+ countries worldwide."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How HKT Works
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start investing in real estate with as little as $100 per month. 
            Our automated system handles everything from property selection to portfolio management.
          </p>
        </div>

        {/* Steps Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Simple 4-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow relative">
                  <CardContent className="p-8 text-center">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                      <IconComponent className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose HKT?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Investment Example */}
        <Card className="mb-16 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Investment Example
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                See how your investment grows over 3 years with HKT
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">$200/mo</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Monthly Investment</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary mb-2">$7,200</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Invested (36 months)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent mb-2">$10,368</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Portfolio Value</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">+44%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Return</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Investing?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of investors building wealth through real estate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy-hkt">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Start Investing Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/our-mission">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Learn More About HKT
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}