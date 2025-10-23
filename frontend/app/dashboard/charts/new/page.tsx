'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface NatalChartFormData {
  name: string;
  birth_date: string;
  birth_time: string;
  birth_city: string;
  birth_country: string;
  birth_latitude: string;
  birth_longitude: string;
  birth_timezone: string;
  is_primary: boolean;
}

export default function NewNatalChartPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NatalChartFormData>({
    name: '',
    birth_date: '',
    birth_time: '',
    birth_city: '',
    birth_country: '',
    birth_latitude: '',
    birth_longitude: '',
    birth_timezone: 'Europe/Moscow',
    is_primary: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCitySearch = async () => {
    // Placeholder for geocoding API integration
    // В production можно использовать Google Maps Geocoding API или OpenStreetMap Nominatim
    alert('Функция поиска города будет реализована с интеграцией геокодинга');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const payload = {
        name: formData.name,
        birth_date: formData.birth_date,
        birth_time: formData.birth_time,
        birth_city: formData.birth_city,
        birth_country: formData.birth_country,
        birth_latitude: parseFloat(formData.birth_latitude),
        birth_longitude: parseFloat(formData.birth_longitude),
        birth_timezone: formData.birth_timezone,
        is_primary: formData.is_primary
      };

      console.log('Sending request to:', `${apiUrl}/api/v1/charts`);
      console.log('Payload:', payload);

      const response = await fetch(`${apiUrl}/api/v1/charts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Не удалось создать натальную карту';

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } else {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          errorMessage = `Ошибка сервера (${response.status}): ${errorText.substring(0, 100)}`;
        }

        throw new Error(errorMessage);
      }

      const chart = await response.json();
      console.log('Chart created successfully:', chart.id);
      router.push(`/dashboard/charts/${chart.id}`);
    } catch (err) {
      console.error('Error creating chart:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen cosmic-bg star-field">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            ← Назад
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Создать натальную карту</CardTitle>
              <CardDescription>
                Заполните данные о рождении для создания вашей персональной натальной карты
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Chart Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Название карты *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Моя натальная карта"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Birth Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Дата рождения *</Label>
                    <Input
                      id="birth_date"
                      name="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_time">Время рождения (ЧЧ:ММ) *</Label>
                    <Input
                      id="birth_time"
                      name="birth_time"
                      type="time"
                      value={formData.birth_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birth_city">Город рождения *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="birth_city"
                        name="birth_city"
                        placeholder="Москва"
                        value={formData.birth_city}
                        onChange={handleInputChange}
                        required
                      />
                      <Button
                        type="button"
                        onClick={handleCitySearch}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
                      >
                        Найти
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_country">Страна *</Label>
                    <Input
                      id="birth_country"
                      name="birth_country"
                      placeholder="Россия"
                      value={formData.birth_country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birth_latitude">Широта *</Label>
                    <Input
                      id="birth_latitude"
                      name="birth_latitude"
                      type="number"
                      step="0.0001"
                      placeholder="55.7558"
                      value={formData.birth_latitude}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-purple-200/70">Пример: 55.7558 (Москва)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_longitude">Долгота *</Label>
                    <Input
                      id="birth_longitude"
                      name="birth_longitude"
                      type="number"
                      step="0.0001"
                      placeholder="37.6173"
                      value={formData.birth_longitude}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-purple-200/70">Пример: 37.6173 (Москва)</p>
                  </div>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <Label htmlFor="birth_timezone">Часовой пояс *</Label>
                  <Input
                    id="birth_timezone"
                    name="birth_timezone"
                    placeholder="Europe/Moscow"
                    value={formData.birth_timezone}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-purple-200/70">
                    Формат: Region/City (например, Europe/Moscow, Asia/Tokyo)
                  </p>
                </div>

                {/* Primary Chart Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_primary"
                    name="is_primary"
                    checked={formData.is_primary}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <Label htmlFor="is_primary" className="cursor-pointer">
                    Сделать основной картой
                  </Label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-200">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? 'Создание карты...' : 'Создать натальную карту'}
                </Button>

                <p className="text-xs text-purple-200/70 text-center">
                  Расчет натальной карты займет несколько секунд. Точность данных влияет на качество интерпретации.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
