import HeroSection from '@/components/hero-section';
import StatsSection from '@/components/stats-section';
import PropertyShowcase from '@/components/property-showcase';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <PropertyShowcase />
    </div>
  );
}
