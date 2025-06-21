import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { Language, languageNames } from '@/lib/i18n';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-sm font-medium"
          >
            {languageNames[language]}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {Object.entries(languageNames).map(([lang, name]) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang as Language)}
              className={`cursor-pointer ${
                language === lang ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}