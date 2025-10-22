# Астрологическая Платформа - Backend

FastAPI приложение для астрологических расчетов.

## Запуск разработки

```bash
# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Настроить .env
cp .env.example .env
# Отредактировать .env

# Запустить миграции
alembic upgrade head

# Запустить сервер
uvicorn app.main:app --reload --port 8000
```

## Команды

### Сервер
```bash
# Development
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### База данных
```bash
# Создать миграцию
alembic revision --autogenerate -m "Description"

# Применить миграции
alembic upgrade head

# Откатить миграцию
alembic downgrade -1

# История миграций
alembic history
```

### Тесты
```bash
pytest
pytest --cov=app tests/
```

## Структура

```
app/
├── main.py           # FastAPI приложение
├── config.py         # Настройки
├── database.py       # SQLAlchemy setup
├── api/
│   └── v1/
│       └── endpoints/  # API endpoints
├── models/           # SQLAlchemy модели
├── schemas/          # Pydantic схемы
├── services/         # Бизнес-логика
│   ├── astro_calculator.py
│   └── interpretation_engine.py
└── utils/
    └── security.py   # Auth utilities

alembic/
└── versions/         # Миграции БД
```

## Основные сервисы

### AstroCalculatorService
Астрологические расчеты с использованием kerykeion:
- Генерация натальных карт
- Расчет транзитов
- Синастрия (совместимость)
- SVG визуализация

### InterpretationEngine
Генерация интерпретаций:
- Шаблонные интерпретации (Free tier)
- AI-powered интерпретации (GPT-4, Premium tier)
- Кэширование результатов

## API документация

После запуска сервера:
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Зависимости

### Основные
- **FastAPI** - веб-фреймворк
- **SQLAlchemy** - ORM
- **Alembic** - миграции
- **Kerykeion** - астрологические расчеты
- **OpenAI** - AI интерпретации
- **Stripe** - платежи

### Опциональные
- **Redis** - кэширование (production)
- **Sentry** - мониторинг ошибок

## Переменные окружения

```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/astrology
SECRET_KEY=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
REDIS_URL=redis://localhost:6379
```

## Лицензирование

⚠️ **Важно**: Kerykeion использует Swiss Ephemeris с AGPL-3.0 лицензией.

Для коммерческого использования:
1. Купить лицензию Swiss Ephemeris (€750)
2. Использовать API сервисы (Prokerala, FreeAstrologyAPI)
3. Использовать MIT-licensed альтернативу (astronomy-engine)
