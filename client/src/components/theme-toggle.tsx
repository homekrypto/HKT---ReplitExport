import { Moon, Sun } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function ThemeToggle() {
  const { theme, setTheme, t } = useApp();

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600 dark:text-gray-300">{t.footer.theme}</span>
      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4 text-gray-400" />
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            theme === 'dark' ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <Moon className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}