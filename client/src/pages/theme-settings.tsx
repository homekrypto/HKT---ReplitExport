import { useApp } from '@/contexts/AppContext';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import ThemeCustomizer from '@/components/theme-customizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Eye, TrendingUp, Zap } from 'lucide-react';

export default function ThemeSettings() {
  const { theme } = useApp();

  const themeFeatures = {
    light: [
      'Clean and minimal design',
      'High contrast for clarity',
      'Reduced eye strain in bright environments',
      'Professional appearance'
    ],
    dark: [
      'Easy on the eyes in low light',
      'Reduced blue light exposure',
      'Better battery life on OLED screens',
      'Modern sleek appearance'
    ],
    crypto: [
      'Investment-focused color scheme',
      'Gold accents for premium feel',
      'Enhanced chart visibility',
      'Professional trading interface'
    ]
  };

  const currentFeatures = themeFeatures[theme] || themeFeatures.light;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Palette className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Theme Customization</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personalize your investment experience with themes designed for optimal trading and portfolio management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Theme Selector */}
            <div className="lg:col-span-2">
              <ThemeCustomizer />
              
              {/* Theme Benefits */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Current Theme Benefits
                  </CardTitle>
                  <CardDescription>
                    Why the {theme === 'crypto' ? 'Crypto Pro' : theme} theme enhances your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {currentFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Theme Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Investment Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Our themes are specifically designed for real estate investment tracking and analysis.
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chart Visibility</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (theme === 'crypto' ? 5 : theme === 'dark' ? 4 : 3)
                                ? 'bg-primary'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Readability</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (theme === 'crypto' ? 5 : 4)
                                ? 'bg-primary'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Professional Look</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (theme === 'light' ? 5 : 4)
                                ? 'bg-primary'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>• Switch themes anytime using the theme selector in the navigation</p>
                  <p>• Crypto Pro theme is optimized for extended trading sessions</p>
                  <p>• Dark theme reduces eye strain during late-night portfolio reviews</p>
                  <p>• Light theme provides best contrast for detailed document reading</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}