import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Moon,
  Star,
  Heart,
  TrendingUp,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="cosmic-bg star-field min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-4">
            <Sparkles className="w-16 h-16 text-purple-400 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Откройте тайны звезд
          </h1>

          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto">
            AI-powered астрология нового поколения. Точные расчеты, глубокие интерпретации, персональные прогнозы.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="cosmic-gradient text-white text-lg px-8 py-6">
                Создать карту бесплатно
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8 py-6">
                Посмотреть тарифы
              </Button>
            </Link>
          </div>

          <div className="mt-12 text-purple-300">
            <p className="text-sm">✨ Более 10,000 карт создано</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Возможности платформы
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Star className="w-12 h-12 text-purple-600" />}
              title="Точные натальные карты"
              description="Расчеты с точностью NASA JPL ephemeris. Планеты, дома, аспекты с точностью до 0.001 угловой секунды."
            />

            <FeatureCard
              icon={<Moon className="w-12 h-12 text-purple-600" />}
              title="Ежедневные прогнозы"
              description="Персонализированные гороскопы на основе вашей полной натальной карты, а не только знака Солнца."
            />

            <FeatureCard
              icon={<Heart className="w-12 h-12 text-purple-600" />}
              title="Совместимость"
              description="Детальная синастрия и композитные карты для глубокого понимания отношений."
            />

            <FeatureCard
              icon={<TrendingUp className="w-12 h-12 text-purple-600" />}
              title="Транзиты в реальном времени"
              description="Отслеживайте влияние текущих планетных позиций на вашу натальную карту."
            />

            <FeatureCard
              icon={<Sparkles className="w-12 h-12 text-purple-600" />}
              title="AI-интерпретации"
              description="Уникальные персонализированные чтения, созданные с помощью GPT-4."
            />

            <FeatureCard
              icon={<Zap className="w-12 h-12 text-purple-600" />}
              title="Мгновенные результаты"
              description="Все расчеты выполняются менее чем за 3 секунды с красивой визуализацией."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Как это работает
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <StepCard
                number="1"
                title="Введите данные рождения"
                description="Дата, время и место рождения для точных расчетов"
              />

              <StepCard
                number="2"
                title="Получите натальную карту"
                description="Мгновенный расчет всех планетных позиций и аспектов"
              />

              <StepCard
                number="3"
                title="Изучайте интерпретации"
                description="Глубокие AI-powered объяснения каждого элемента карты"
              />

              <StepCard
                number="4"
                title="Отслеживайте транзиты"
                description="Получайте прогнозы и отслеживайте космические влияния"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 cosmic-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Начните свое космическое путешествие сегодня
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам пользователей, открывающих тайны своей судьбы
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
              Начать бесплатно
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Астро Платформа</h3>
              <p className="text-gray-400">
                Профессиональная астрология с AI
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pricing">Тарифы</Link></li>
                <li><Link href="/features">Возможности</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">О нас</Link></li>
                <li><Link href="/contact">Контакты</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Правовая информация</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy">Конфиденциальность</Link></li>
                <li><Link href="/terms">Условия использования</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Астрологическая Платформа. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-full cosmic-gradient flex items-center justify-center text-white font-bold text-xl">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
