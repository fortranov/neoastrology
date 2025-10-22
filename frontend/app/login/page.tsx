'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
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
            Вход
          </h2>
          <p className="text-purple-200">
            Войдите в свой аккаунт
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
                placeholder="Введите пароль"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-purple-200">
              Нет аккаунта?{' '}
              <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
                Зарегистрироваться
              </Link>
            </p>
            <p className="text-purple-300 text-sm">
              <Link href="/" className="hover:text-purple-200">
                ← Вернуться на главную
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
