'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface Planet {
  sign: string;
  position: number;
  house: string;
  retrograde: boolean;
  abs_pos?: number;
}

interface House {
  house: number;
  sign: string;
  position: number;
  abs_pos?: number;
}

interface Aspect {
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
  applying: boolean;
}

interface ChartData {
  planets: {
    [key: string]: Planet;
  };
  houses: House[];
  aspects: Aspect[];
  calculation_date: string;
}

interface NatalChart {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_city: string;
  birth_country: string;
  birth_latitude: number;
  birth_longitude: number;
  birth_timezone: string;
  chart_data: ChartData;
  interpretation_text: string;
  svg_chart: string;
  is_primary: boolean;
  created_at: string;
}

const PLANET_NAMES: { [key: string]: string } = {
  sun: 'Солнце ☉',
  moon: 'Луна ☽',
  mercury: 'Меркурий ☿',
  venus: 'Венера ♀',
  mars: 'Марс ♂',
  jupiter: 'Юпитер ♃',
  saturn: 'Сатурн ♄',
  uranus: 'Уран ♅',
  neptune: 'Нептун ♆',
  pluto: 'Плутон ♇',
  north_node: 'Сев. Узел ☊',
  ascendant: 'Асцендент (AC)',
  midheaven: 'Середина Неба (MC)'
};

const SIGN_NAMES: { [key: string]: string } = {
  Ari: 'Овен ♈',
  Tau: 'Телец ♉',
  Gem: 'Близнецы ♊',
  Can: 'Рак ♋',
  Leo: 'Лев ♌',
  Vir: 'Дева ♍',
  Lib: 'Весы ♎',
  Sco: 'Скорпион ♏',
  Sag: 'Стрелец ♐',
  Cap: 'Козерог ♑',
  Aqu: 'Водолей ♒',
  Pis: 'Рыбы ♓'
};

export default function ChartDetailPage() {
  const router = useRouter();
  const params = useParams();
  const chartId = params?.id as string;
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'planets' | 'houses' | 'aspects' | 'interpretation'>('planets');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (token && chartId) {
      fetchChart();
    }
  }, [token, chartId]);

  const fetchChart = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/charts/${chartId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить карту');
      }

      const data = await response.json();
      setChart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen cosmic-bg star-field flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (error || !chart) {
    return (
      <div className="min-h-screen cosmic-bg star-field flex items-center justify-center">
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Ошибка</h3>
            <p className="text-purple-200 mb-6">{error || 'Карта не найдена'}</p>
            <Button onClick={() => router.push('/dashboard/charts')}>
              Вернуться к списку карт
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg star-field">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => router.push('/dashboard/charts')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            ← Назад к картам
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Chart Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {chart.name}
              {chart.is_primary && (
                <span className="ml-3 text-lg bg-purple-500/30 text-purple-200 px-3 py-1 rounded">
                  Основная карта
                </span>
              )}
            </h1>
            <p className="text-purple-200">
              {new Date(chart.birth_date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} в {chart.birth_time} • {chart.birth_city}, {chart.birth_country}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { key: 'planets', label: 'Планеты' },
              { key: 'houses', label: 'Дома' },
              { key: 'aspects', label: 'Аспекты' },
              { key: 'interpretation', label: 'Интерпретация' }
            ].map((tab) => (
              <Button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                variant={activeTab === tab.key ? 'default' : 'outline'}
                className={
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                    : 'border-white/20 text-white hover:bg-white/10'
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {activeTab === 'planets' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Положение планет</CardTitle>
                    <CardDescription>
                      Планеты в знаках зодиака и домах натальной карты
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(chart.chart_data.planets).map(([key, planet]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">
                              {PLANET_NAMES[key] || key}
                            </h4>
                            <p className="text-sm text-purple-200">
                              {SIGN_NAMES[planet.sign] || planet.sign} {planet.position.toFixed(2)}°
                              {planet.house && ` • Дом ${planet.house}`}
                              {planet.retrograde && ' • Ретроградна ℞'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'houses' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Дома</CardTitle>
                    <CardDescription>
                      Распределение домов натальной карты по знакам зодиака
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chart.chart_data.houses.map((house) => (
                        <div
                          key={house.house}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">
                              Дом {house.house}
                            </h4>
                            <p className="text-sm text-purple-200">
                              {SIGN_NAMES[house.sign] || house.sign} {house.position.toFixed(2)}°
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'aspects' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Аспекты</CardTitle>
                    <CardDescription>
                      Угловые взаимосвязи между планетами
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chart.chart_data.aspects.length > 0 ? (
                      <div className="space-y-4">
                        {chart.chart_data.aspects.map((aspect, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">
                                {aspect.planet1} {aspect.aspect} {aspect.planet2}
                              </h4>
                              <p className="text-sm text-purple-200">
                                Орб: {aspect.orb.toFixed(2)}° • {aspect.applying ? 'Сходящийся' : 'Расходящийся'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-purple-200 text-center py-8">
                        Аспекты не обнаружены или не рассчитаны
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'interpretation' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Интерпретация</CardTitle>
                    <CardDescription>
                      Астрологическая интерпретация вашей натальной карты
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <div
                        className="text-purple-100 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: chart.interpretation_text.replace(/\n/g, '<br />')
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о карте</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-purple-200 mb-1">Дата рождения</p>
                    <p className="font-semibold text-white">
                      {new Date(chart.birth_date).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200 mb-1">Время рождения</p>
                    <p className="font-semibold text-white">{chart.birth_time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200 mb-1">Место</p>
                    <p className="font-semibold text-white">
                      {chart.birth_city}, {chart.birth_country}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200 mb-1">Координаты</p>
                    <p className="font-semibold text-white">
                      {chart.birth_latitude.toFixed(4)}°, {chart.birth_longitude.toFixed(4)}°
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200 mb-1">Часовой пояс</p>
                    <p className="font-semibold text-white">{chart.birth_timezone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200 mb-1">Дата создания</p>
                    <p className="font-semibold text-white">
                      {new Date(chart.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* SVG Chart Placeholder */}
              {chart.svg_chart && chart.svg_chart !== '<svg><!-- Chart SVG placeholder --></svg>' && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Визуализация карты</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div dangerouslySetInnerHTML={{ __html: chart.svg_chart }} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
