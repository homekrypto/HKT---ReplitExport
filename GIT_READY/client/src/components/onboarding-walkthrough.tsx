import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Home, 
  Wallet, 
  Calculator, 
  TrendingUp,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  actionLink?: string;
  tips: string[];
  category: 'platform' | 'investment' | 'security' | 'features';
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Home Krypto Token',
    description: 'HKT revolutionizes real estate investment by allowing you to own fractional shares in premium properties through blockchain technology.',
    icon: <Home className="h-8 w-8" />,
    actionText: 'Get Started',
    category: 'platform',
    tips: [
      'Start investing with just $106.83/month',
      'Own shares in luxury properties worldwide',
      'Track your portfolio growth in real-time'
    ]
  },
  {
    id: 'investment-basics',
    title: 'How Property Investment Works',
    description: 'Learn how HKT tokens represent real property ownership and generate returns through rental income and appreciation.',
    icon: <TrendingUp className="h-8 w-8" />,
    actionText: 'Learn More',
    actionLink: '/how-it-works',
    category: 'investment',
    tips: [
      'Each HKT token represents fractional property ownership',
      'Earn from both rental income and property appreciation',
      'Average 15% annual returns on your investment'
    ]
  },
  {
    id: 'calculator',
    title: 'Calculate Your Returns',
    description: 'Use our investment calculator to see how your monthly contributions can grow over time with compound returns.',
    icon: <Calculator className="h-8 w-8" />,
    actionText: 'Try Calculator',
    category: 'features',
    tips: [
      'See projected returns for different investment amounts',
      'Understand the power of compound growth',
      'Plan your investment timeline effectively'
    ]
  },
  {
    id: 'wallet-setup',
    title: 'Connect Your Wallet',
    description: 'Securely connect your crypto wallet to start investing and manage your HKT tokens.',
    icon: <Wallet className="h-8 w-8" />,
    actionText: 'Connect Wallet',
    actionLink: '/cross-chain-wallets',
    category: 'security',
    tips: [
      'Supports MetaMask, WalletConnect, and more',
      'Multi-chain compatibility for flexibility',
      'Your private keys remain secure'
    ]
  },
  {
    id: 'security',
    title: 'Your Security Matters',
    description: 'Learn about our security measures and best practices to keep your investments safe.',
    icon: <Shield className="h-8 w-8" />,
    actionText: 'Security Guide',
    category: 'security',
    tips: [
      'Enable two-factor authentication',
      'Never share your private keys',
      'Use hardware wallets for large amounts'
    ]
  },
  {
    id: 'global-properties',
    title: 'Explore Global Properties',
    description: 'Discover premium properties in top tourist destinations around the world available for investment.',
    icon: <Globe className="h-8 w-8" />,
    actionText: 'View Properties',
    actionLink: '/properties',
    category: 'features',
    tips: [
      'Properties in Dominican Republic, Costa Rica, and more',
      'All properties are professionally managed',
      'Detailed analytics and performance tracking'
    ]
  }
];

interface OnboardingWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingWalkthrough({ isOpen, onClose, onComplete }: OnboardingWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [, setLocation] = useLocation();

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNext = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStepData.id));
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleActionClick = () => {
    if (currentStepData.actionLink) {
      setLocation(currentStepData.actionLink);
      onClose();
    } else {
      handleNext();
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStepData.id));
    localStorage.setItem('hkt-onboarding-completed', 'true');
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('hkt-onboarding-skipped', 'true');
    onClose();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'platform': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'investment': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'features': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {currentStepData.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    HKT Platform Tour
                  </h2>
                  <Badge className={getCategoryColor(currentStepData.category)}>
                    Step {currentStep + 1} of {onboardingSteps.length}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="flex h-[calc(90vh-200px)]">
            {/* Step Navigation Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tour Steps</h3>
              <div className="space-y-2">
                {onboardingSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : completedSteps.has(step.id)
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {completedSteps.has(step.id) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-current" />
                      )}
                      <span className="text-sm font-medium truncate">{step.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {currentStepData.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Tips Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentStepData.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Action Button */}
                <div className="pt-4">
                  <Button 
                    onClick={handleActionClick}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {currentStepData.actionText}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Tour
                </Button>
                
                <Button onClick={handleNext}>
                  {currentStep === onboardingSteps.length - 1 ? 'Complete Tour' : 'Next'}
                  {currentStep !== onboardingSteps.length - 1 && (
                    <ChevronRight className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}