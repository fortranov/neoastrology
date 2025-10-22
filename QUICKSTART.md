# ⚡ Quick Start Guide

Быстрый запуск астрологической платформы за 5 минут.

## 🚀 Локальная разработка

### Предварительные требования

- Docker Desktop установлен и запущен
- Git установлен

### Шаг 1: Клонировать репозиторий

```bash
git clone <repository-url>
cd astrology
```

### Шаг 2: Запустить development окружение

**Linux/macOS:**
```bash
# Используя Makefile (рекомендуется)
make dev

# Или используя скрипт
chmod +x scripts/dev-start.sh
./scripts/dev-start.sh
```

**Windows (PowerShell):**
```powershell
# Используя скрипт
.\scripts\dev-start.ps1

# Или вручную
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker-compose exec backend alembic upgrade head
```

### Шаг 3: Открыть приложение

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Шаг 4: Создать первого пользователя

Откройте http://localhost:8001/docs и используйте endpoint `/api/v1/auth/register`

Или через curl:

```bash
curl -X POST "http://localhost:8001/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "full_name": "Test User"
  }'
```

## 🎯 Production развертывание

### Быстрое развертывание

```bash
# 1. Настроить .env
cp .env.example .env
nano .env  # Заполнить все переменные

# 2. Запустить
make prod-deploy

# Готово! 🎉
```

Подробнее: [DEPLOYMENT.md](DEPLOYMENT.md)

## 📦 Основные команды

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
make prod-deploy  # Полное развертывание
```

### Database

```bash
make migrate            # Применить миграции
make migrate-create     # Создать миграцию
make backup             # Создать backup
make restore file=...   # Восстановить backup
make db-shell           # Открыть PostgreSQL shell
```

### Docker

```bash
make up           # Запустить контейнеры
make down         # Остановить контейнеры
make restart      # Перезапустить контейнеры
make logs         # Посмотреть логи
make ps           # Статус контейнеров
make clean        # Очистить всё
```

### Monitoring

```bash
make health       # Проверить здоровье сервисов
make stats        # Показать статистику Docker
```

## 🔧 Конфигурация

### Минимальная .env конфигурация для development

```env
POSTGRES_DB=astrology_dev
POSTGRES_USER=astrology_dev
POSTGRES_PASSWORD=dev_password

SECRET_KEY=dev-secret-key-not-for-production
DEBUG=True

NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Production .env (обязательные поля)

```env
# Database
POSTGRES_DB=astrology
POSTGRES_USER=astrology_user
POSTGRES_PASSWORD=<strong-password>

# Security
SECRET_KEY=<generate-with-openssl-rand-hex-32>
NEXTAUTH_SECRET=<generate-with-openssl-rand-hex-32>

# URLs
FRONTEND_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# OpenAI
OPENAI_API_KEY=sk-...

# Production mode
DEBUG=False
```

## 🐛 Troubleshooting

### Контейнеры не запускаются

```bash
# Проверить логи
docker-compose logs

# Пересоздать контейнеры
docker-compose down -v
docker-compose up -d
```

### Ошибка подключения к БД

```bash
# Проверить, что PostgreSQL запущен
docker-compose ps postgres

# Перезапустить БД
docker-compose restart postgres

# Подождать 5 секунд и применить миграции
sleep 5
make migrate
```

### Порты заняты

Если порты 3000, 8000, 5432 или 6379 заняты, измените их в `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Изменить с 3000 на 3001
```

### Frontend не собирается

```bash
# Очистить кэш и пересобрать
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

## 📚 Дополнительная документация

- [README.md](README.md) - Общая информация о проекте
- [DEPLOYMENT.md](DEPLOYMENT.md) - Полное руководство по развертыванию
- [backend/README.md](backend/README.md) - Backend документация
- [frontend/README.md](frontend/README.md) - Frontend документация

## ✅ Checklist первого запуска

- [ ] Docker Desktop установлен и запущен
- [ ] Репозиторий склонирован
- [ ] `.env` файл настроен (или используется development режим)
- [ ] `make dev` выполнен успешно
- [ ] Все сервисы запущены (`make ps`)
- [ ] Миграции применены (`make migrate`)
- [ ] Frontend открывается на http://localhost:3001
- [ ] Backend API доступен на http://localhost:8001
- [ ] API документация открывается на http://localhost:8001/docs
- [ ] Создан тестовый пользователь

## 🎓 Следующие шаги

1. **Изучите API**: http://localhost:8001/docs
2. **Создайте первую натальную карту**: `POST /api/v1/charts`
3. **Настройте Stripe**: Добавьте тестовые ключи в `.env`
4. **Настройте OpenAI**: Добавьте API ключ для AI интерпретаций
5. **Кастомизируйте frontend**: Измените цвета и тексты в `frontend/app`

## 🆘 Нужна помощь?

- Проверьте логи: `make logs`
- Посмотрите [DEPLOYMENT.md](DEPLOYMENT.md)
- Создайте issue в репозитории

---

Успешной разработки! 🚀
