import { useApp } from "@/contexts/AppContext";
import HeroSection from "@/components/hero-section";
import InvestmentCalculator from "@/components/investment-calculator";
import PropertyShowcase from "@/components/property-showcase";
import StatsSection from "@/components/stats-section";

export default function Home() {
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <StatsSection />
      <InvestmentCalculator />
      <PropertyShowcase />
    </div>
  );
}