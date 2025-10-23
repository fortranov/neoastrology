'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen cosmic-bg star-field flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen cosmic-bg star-field">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Астрологическая Платформа
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-purple-200">
              {user.email}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Добро пожаловать, {user.full_name || 'пользователь'}!
            </h2>
            <p className="text-purple-200 mb-6">
              Это ваш личный кабинет. Здесь вы можете создавать натальные карты,
              просматривать гороскопы и анализировать транзиты.
            </p>

            {/* Subscription Info */}
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-200">Ваш тариф</p>
                  <p className="text-xl font-bold text-white capitalize">
                    {user.subscription_tier}
                  </p>
                </div>
                {user.subscription_tier === 'free' && (
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Улучшить тариф
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={() => router.push('/dashboard/charts')}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Натальная карта
              </h3>
              <p className="text-purple-200">
                Создайте свою персональную натальную карту
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer opacity-50">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Гороскоп на сегодня
              </h3>
              <p className="text-purple-200">
                Скоро доступно
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer opacity-50">
              <div className="text-4xl mb-4">💫</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Транзиты
              </h3>
              <p className="text-purple-200">
                Скоро доступно (Premium)
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer opacity-50">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Совместимость
              </h3>
              <p className="text-purple-200">
                Скоро доступно
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Информация об аккаунте
            </h3>
            <div className="space-y-2 text-purple-200">
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Имя:</span> {user.full_name || 'Не указано'}</p>
              <p><span className="font-semibold">Статус:</span> {user.is_active ? 'Активен' : 'Неактивен'}</p>
              <p><span className="font-semibold">Верификация:</span> {user.is_verified ? 'Подтвержден' : 'Не подтвержден'}</p>
              <p><span className="font-semibold">Дата регистрации:</span> {new Date(user.created_at).toLocaleDateString('ru-RU')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
