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
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 mb-8 shadow-xl shadow-purple-900/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Добро пожаловать, {user.full_name || 'пользователь'}!
            </h2>
            <p className="text-purple-200 mb-6">
              Это ваш личный кабинет. Здесь вы можете создавать натальные карты,
              просматривать гороскопы и анализировать транзиты.
            </p>

            {/* Subscription Info */}
            <div className="bg-purple-900/30 border border-purple-500/40 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Ваш тариф</p>
                  <p className="text-xl font-bold text-white capitalize">
                    {user.subscription_tier}
                  </p>
                </div>
                {user.subscription_tier === 'free' && (
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
              className="bg-slate-900/95 backdrop-blur-md rounded-xl border border-purple-500/30 p-6 hover:bg-slate-800/95 hover:border-purple-400/50 transition-all cursor-pointer shadow-lg hover:shadow-purple-500/20"
            >
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Натальная карта
              </h3>
              <p className="text-purple-300">
                Создайте свою персональную натальную карту
              </p>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 transition-all cursor-not-allowed opacity-60">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">
                Гороскоп на сегодня
              </h3>
              <p className="text-slate-400">
                Скоро доступно
              </p>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 transition-all cursor-not-allowed opacity-60">
              <div className="text-4xl mb-4">💫</div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">
                Транзиты
              </h3>
              <p className="text-slate-400">
                Скоро доступно (Premium)
              </p>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 transition-all cursor-not-allowed opacity-60">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">
                Совместимость
              </h3>
              <p className="text-slate-400">
                Скоро доступно
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-8 bg-slate-900/95 backdrop-blur-md rounded-xl border border-purple-500/30 p-6 shadow-xl shadow-purple-900/20">
            <h3 className="text-xl font-bold text-white mb-4">
              Информация об аккаунте
            </h3>
            <div className="space-y-2 text-purple-200">
              <p><span className="font-semibold text-purple-300">Email:</span> {user.email}</p>
              <p><span className="font-semibold text-purple-300">Имя:</span> {user.full_name || 'Не указано'}</p>
              <p><span className="font-semibold text-purple-300">Статус:</span> {user.is_active ? 'Активен' : 'Неактивен'}</p>
              <p><span className="font-semibold text-purple-300">Верификация:</span> {user.is_verified ? 'Подтвержден' : 'Не подтвержден'}</p>
              <p><span className="font-semibold text-purple-300">Дата регистрации:</span> {new Date(user.created_at).toLocaleDateString('ru-RU')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
