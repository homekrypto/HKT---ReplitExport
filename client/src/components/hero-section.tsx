import { Button } from '@/components/ui/button';
import { INVESTMENT_PLAN_DATA } from '@/lib/constants';
import { useApp } from '@/contexts/AppContext';
import InvestmentCalculator from './investment-calculator';

export default function HeroSection() {
  const { t } = useApp();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary to-blue-800 text-white py-20">
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {t.hero.title.split('Blockchain')[0]}
              <span className="text-accent">Blockchain</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollToSection('buy-hkt')}
                className="bg-accent hover:bg-yellow-500 text-gray-900 px-8 py-4 text-lg font-semibold"
              >
                {t.hero.startInvesting}
              </Button>
              <Button
                onClick={() => scrollToSection('how-it-works')}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
              >
                {t.hero.learnMore}
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">
                  ${INVESTMENT_PLAN_DATA.totalInvested.toLocaleString()}
                </div>
                <div className="text-sm text-blue-200">{t.hero.totalInvestment}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">
                  ${INVESTMENT_PLAN_DATA.finalPortfolioValue.toLocaleString()}
                </div>
                <div className="text-sm text-blue-200">{t.hero.finalValue}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {INVESTMENT_PLAN_DATA.roi}%
                </div>
                <div className="text-sm text-blue-200">{t.hero.roiIn3Years}</div>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    </section>
  );
}
