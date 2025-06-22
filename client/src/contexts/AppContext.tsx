import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, Translation } from '@/lib/i18n';

export type Theme = 'light' | 'dark' | 'crypto';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: Translation;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('hkt-language');
    return (saved as Language) || 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('hkt-theme');
    return (saved as Theme) || 'dark';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('hkt-language', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('hkt-theme', newTheme);
  };

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('dark', 'crypto');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'crypto') {
      document.documentElement.classList.add('crypto');
    }
  }, [theme]);

  useEffect(() => {
    // Apply RTL for Arabic
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const t = translations[language];

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}