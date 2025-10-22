'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name || undefined,
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen cosmic-bg star-field flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Регистрация
          </h2>
          <p className="text-purple-200">
            Создайте аккаунт для доступа к астрологическим картам
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-purple-200 mb-2">
                Полное имя (необязательно)
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Минимум 8 символов"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-200 mb-2">
                Подтвердите пароль
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Повторите пароль"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <div className="text-center">
            <p className="text-purple-200">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Войти
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
