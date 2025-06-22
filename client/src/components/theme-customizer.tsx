import { Moon, Sun, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ThemeCustomizer() {
  const { theme, setTheme, t } = useApp();

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      description: 'Clean and minimal design',
      icon: Sun,
      preview: 'bg-white border text-gray-900',
      colors: ['bg-blue-500', 'bg-green-500', 'bg-yellow-500']
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: Moon,
      preview: 'bg-black border-gray-800 text-white',
      colors: ['bg-blue-400', 'bg-green-400', 'bg-yellow-400']
    },
    {
      value: 'crypto' as const,
      label: 'Crypto Pro',
      description: 'Investment-focused experience',
      icon: Zap,
      preview: 'bg-slate-900 border-yellow-500/30 text-yellow-100',
      colors: ['bg-yellow-500', 'bg-green-400', 'bg-purple-400']
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Investment Theme Customization
        </CardTitle>
        <CardDescription>
          Choose your preferred theme for the best investment experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isActive = theme === themeOption.value;
            
            return (
              <button
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  isActive 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`w-full h-20 rounded-md mb-3 border ${themeOption.preview} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <div className="text-left">
                  <h3 className="font-semibold text-sm mb-1">{themeOption.label}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{themeOption.description}</p>
                  
                  <div className="flex gap-1">
                    {themeOption.colors.map((color, index) => (
                      <div key={index} className={`w-3 h-3 rounded-full ${color}`} />
                    ))}
                  </div>
                </div>
                
                {isActive && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current theme:</span>
            <span className="font-medium capitalize">{theme === 'crypto' ? 'Crypto Pro' : theme}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}