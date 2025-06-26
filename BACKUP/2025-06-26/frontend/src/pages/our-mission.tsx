import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Target, Users, Globe, Shield, TrendingUp, Building } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function OurMission() {
  const { t } = useApp();

  const missionValues = [
    {
      icon: Target,
      title: t.mission.accessibility.title,
      description: t.mission.accessibility.description,
      color: 'text-primary'
    },
    {
      icon: Shield,
      title: t.mission.transparency.title,
      description: t.mission.transparency.description,
      color: 'text-secondary'
    },
    {
      icon: Globe,
      title: t.mission.innovation.title,
      description: t.mission.innovation.description,
      color: 'text-accent'
    },
    {
      icon: TrendingUp,
      title: t.mission.returns.title,
      description: t.mission.returns.description,
      color: 'text-primary'
    },
    {
      icon: Users,
      title: t.mission.community.title,
      description: t.mission.community.description,
      color: 'text-secondary'
    },
    {
      icon: Building,
      title: t.mission.quality.title,
      description: t.mission.quality.description,
      color: 'text-accent'
    }
  ];



  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t.mission.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t.mission.subtitle}
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16 shadow-xl">
          <CardContent className="p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {t.mission.statement.title}
              </h2>
              <blockquote className="text-2xl text-gray-700 dark:text-gray-300 italic leading-relaxed">
                "{t.mission.statement.content}"
              </blockquote>
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t.mission.values.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missionValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-4">
                        <IconComponent className={`h-6 w-6 ${value.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {value.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Vision Section */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t.mission.vision.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {t.mission.vision.content}
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">{t.mission.vision.point1}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">{t.mission.vision.point2}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">{t.mission.vision.point3}</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$100M+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.mission.stats.properties}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">10,000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.mission.stats.investors}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">25+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.mission.stats.countries}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.mission.stats.returns}</div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">{t.mission.cta.title}</h2>
            <p className="text-xl mb-8 opacity-90">
              {t.mission.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy-hkt">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  {t.mission.cta.invest}
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  {t.mission.cta.learn}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}