import { useQuery } from '@tanstack/react-query';
import { INVESTMENT_PLAN_DATA } from '@/lib/constants';

export default function StatsSection() {
  const { data: hktStats } = useQuery({
    queryKey: ['/api/hkt-stats'],
  });

  const stats = [
    {
      value: hktStats ? `$${parseFloat(hktStats.currentPrice).toFixed(3)}` : '$0.152',
      label: 'Current HKT Price',
      sublabel: '+15% YoY Growth',
      textColor: 'text-primary'
    },
    {
      value: INVESTMENT_PLAN_DATA.totalHktAccumulated.toLocaleString(),
      label: 'HKT Tokens Earned',
      sublabel: 'Over 36 Months',
      textColor: 'text-secondary'
    },
    {
      value: '$106.83',
      label: 'Monthly Investment',
      sublabel: 'For 36 Months',
      textColor: 'text-accent'
    },
    {
      value: `$${INVESTMENT_PLAN_DATA.totalProfit.toLocaleString()}`,
      label: 'Total Profit',
      sublabel: `+${INVESTMENT_PLAN_DATA.roi}% ROI`,
      textColor: 'text-green-500'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl font-bold mb-2 ${stat.textColor}`}>
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
              <div className={`text-sm mt-1 ${
                stat.textColor === 'text-primary' ? 'text-secondary' :
                stat.textColor === 'text-green-500' ? 'text-green-500' : 'text-gray-500'
              }`}>
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
