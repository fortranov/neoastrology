# Астрологическая Платформа - Frontend

Next.js 14 приложение с TypeScript и Tailwind CSS.

## Запуск разработки

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Команды

- `npm run dev` - запуск dev сервера
- `npm run build` - production build
- `npm run start` - запуск production сервера
- `npm run lint` - проверка кода

## Структура

```
app/
├── (marketing)/   # Публичные страницы
│   ├── page.tsx  # Лендинг
│   └── pricing/  # Тарифы
├── (dashboard)/   # Защищенные страницы
│   ├── natal-chart/
│   ├── daily-horoscope/
│   └── compatibility/
└── api/          # API routes
    ├── auth/
    └── webhooks/

components/
├── ui/           # shadcn/ui компоненты
├── dashboard/    # Компоненты dashboard
├── charts/       # Визуализация карт
└── forms/        # Формы

lib/
├── utils.ts      # Утилиты
├── api-client.ts # API клиент
└── auth.ts       # NextAuth config
```

## Технологии

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- NextAuth.js v5
- Stripe
- SWR для data fetching
- React Hook Form + Zod

## Переменные окружения

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```
