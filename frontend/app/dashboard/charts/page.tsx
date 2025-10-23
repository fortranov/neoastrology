'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface NatalChart {
  id: string;
  name: string;
  birth_date: string;
  birth_city: string;
  birth_country: string;
  is_primary: boolean;
  created_at: string;
}

export default function ChartsListPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [charts, setCharts] = useState<NatalChart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (token) {
      fetchCharts();
    }
  }, [token]);

  const fetchCharts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/charts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить карты');
      }

      const data = await response.json();
      setCharts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (chartId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту карту?')) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/charts/${chartId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить карту');
      }

      // Refresh the list
      fetchCharts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Произошла ошибка');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen cosmic-bg star-field flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg star-field">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            ← Назад к панели
          </Button>
          <Button
            onClick={() => router.push('/dashboard/charts/new')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            + Создать карту
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Мои натальные карты</h1>
            <p className="text-purple-200">
              Управляйте своими натальными картами и анализируйте астрологические данные
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {charts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  У вас пока нет натальных карт
                </h3>
                <p className="text-purple-200 mb-6">
                  Создайте свою первую натальную карту, чтобы начать астрологическое путешествие
                </p>
                <Button
                  onClick={() => router.push('/dashboard/charts/new')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Создать первую карту
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {charts.map((chart) => (
                <Card key={chart.id} className="hover:bg-white/15 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">
                          {chart.name}
                          {chart.is_primary && (
                            <span className="ml-2 text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                              Основная
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {new Date(chart.birth_date).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-purple-200">
                        <span className="font-semibold">Место:</span> {chart.birth_city}, {chart.birth_country}
                      </p>
                      <p className="text-xs text-purple-200/70">
                        Создана: {new Date(chart.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.push(`/dashboard/charts/${chart.id}`)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Открыть
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(chart.id);
                        }}
                        variant="outline"
                        className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                      >
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
