# Астрологическая Платформа

Полнофункциональная платформа для астрологических расчетов с AI-интерпретациями, созданная по детальному техническому плану.

## 🌟 Возможности

- ✨ **Натальные карты** с точностью NASA JPL ephemeris
- 🌙 **Ежедневные гороскопы** для всех знаков зодиака
- ❤️ **Совместимость** (синастрия)
- 📈 **Транзиты** в реальном времени (Premium)
- 🤖 **AI-интерпретации** на базе GPT-4
- 💳 **Freemium модель** с Stripe платежами

## 🏗 Архитектура

### Frontend
- **Next.js 14** с TypeScript
- **Tailwind CSS** + shadcn/ui компоненты
- **NextAuth.js v5** для аутентификации
- **Stripe** для платежей

### Backend
- **FastAPI** (Python 3.11+)
- **PostgreSQL** с SQLAlchemy ORM
- **Kerykeion** для астрологических расчетов
- **OpenAI GPT-4** для интерпретаций
- **Redis** для кэширования

## 📁 Структура проекта

```
astrology/
├── frontend/           # Next.js приложение
│   ├── app/           # App Router
│   ├── components/    # React компоненты
│   └── lib/          # Утилиты
├── backend/           # FastAPI приложение
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   ├── models/   # SQLAlchemy модели
│   │   ├── schemas/  # Pydantic схемы
│   │   ├── services/ # Бизнес-логика
│   │   └── utils/    # Утилиты
│   └── alembic/      # Миграции БД
└── docs/             # Документация
```

## 🚀 Быстрый старт

### Требования
- **Docker Desktop** 20.10+ (рекомендуется)
- Или: Node.js 18+, Python 3.11+, PostgreSQL 14+, Redis

### С использованием Docker (рекомендуется)

```bash
# 1. Клонировать репозиторий
git clone <repository-url>
cd astrology

# 2. Запустить development окружение
make dev

# Или на Windows:
.\scripts\dev-start.ps1

# Готово! 🎉
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

Подробнее: [QUICKSTART.md](QUICKSTART.md)

### Без Docker (ручная установка)

<details>
<summary>Развернуть инструкции</summary>

#### Backend

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Настроить окружение
cp .env.example .env
# Отредактировать .env с вашими настройками

# Запустить миграции
alembic upgrade head

# Запустить сервер
uvicorn app.main:app --reload --port 8000
```

API будет доступно на `http://localhost:8000`
Документация: `http://localhost:8000/docs`

#### Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Настроить окружение
cp .env.example .env.local
# Отредактировать .env.local

# Запустить dev сервер
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

</details>

## 📊 База данных

### Создание миграции

```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

### Основные модели

- **User** - пользователи и подписки
- **NatalChart** - натальные карты
- **Subscription** - история подписок
- **HoroscopeCache** - кэш гороскопов

## 🔑 API Endpoints

### Аутентификация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `GET /api/v1/auth/me` - Текущий пользователь

### Натальные карты
- `POST /api/v1/charts` - Создать карту
- `GET /api/v1/charts` - Список карт
- `GET /api/v1/charts/{id}` - Получить карту
- `DELETE /api/v1/charts/{id}` - Удалить карту
- `POST /api/v1/charts/{id}/transits` - Транзиты (Premium)

### Гороскопы
- `GET /api/v1/horoscopes/daily` - Дневной гороскоп
- `GET /api/v1/horoscopes/all-signs` - Все знаки

## 💎 Уровни подписки

### Free
- 1 натальная карта
- Ежедневные гороскопы по знаку Солнца
- Базовая совместимость
- Шаблонные интерпретации

### Basic ($9.99/мес)
- Неограниченные карты
- Детальные интерпретации
- Weekly/monthly прогнозы
- 10 AI-чтений/месяц
- Без рекламы

### Premium ($14.99/мес) ⭐
- Всё из Basic +
- Транзиты в реальном времени
- Unlimited AI-чтения (GPT-4)
- Прогрессии и дирекции
- Solar return карты
- API access

## 🔧 Конфигурация

### Переменные окружения

#### Backend (.env)
```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/astrology
SECRET_KEY=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
REDIS_URL=redis://localhost:6379
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

## 🐳 Docker команды

### Development

```bash
make dev          # Запустить dev окружение
make dev-down     # Остановить dev окружение
make dev-logs     # Посмотреть логи
```

### Production

```bash
make prod         # Запустить production
make prod-build   # Собрать образы
make prod-deploy  # Полное развертывание (pull, build, migrate)
```

### Database

```bash
make migrate            # Применить миграции
make migrate-create     # Создать новую миграцию
make backup             # Создать backup БД
make restore file=...   # Восстановить из backup
make db-shell           # PostgreSQL shell
```

### Utility

```bash
make logs         # Посмотреть логи всех сервисов
make health       # Проверить здоровье сервисов
make stats        # Показать статистику Docker
make clean        # Очистить всё (контейнеры, volumes, images)
make help         # Показать все команды
```

## 📦 Развертывание

### Docker (рекомендуется)

```bash
# 1. Настроить production .env
cp .env.example .env
nano .env  # Заполнить все переменные

# 2. Развернуть
make prod-deploy

# 3. Настроить SSL (опционально)
make ssl-setup domain=your-domain.com
```

**Полное руководство**: [DEPLOYMENT.md](DEPLOYMENT.md)

### Cloud платформы

#### Backend (Railway/Render)
1. Подключить GitHub репозиторий
2. Добавить PostgreSQL addon
3. Настроить environment variables
4. Deploy автоматически

#### Frontend (Vercel/Netlify)
1. Подключить GitHub репозиторий
2. Настроить environment variables
3. Deploy автоматически

### VPS/Dedicated Server

```bash
# На сервере
git clone <repository-url>
cd astrology
cp .env.example .env
# Настроить .env
make prod-deploy
```

Подробнее см. в [DEPLOYMENT.md](DEPLOYMENT.md)

## 📝 Лицензия

Проект использует следующие библиотеки:
- **Kerykeion** (AGPL-3.0) - для коммерческого использования требуется лицензия €750
- Альтернатива: использовать API сервисы (Prokerala, FreeAstrologyAPI)

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📞 Контакты

Вопросы и предложения: [создайте issue](../../issues)

---

🌟 Создано по детальному техническому плану из `compass_artifact_wf-*.md`
