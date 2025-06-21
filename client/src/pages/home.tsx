import HeroSection from '@/components/hero-section';
import StatsSection from '@/components/stats-section';
import PropertyShowcase from '@/components/property-showcase';
import InvestmentCalculator from '@/components/investment-calculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <StatsSection />
      <PropertyShowcase />
      <InvestmentCalculator />
    </div>
  );
}
