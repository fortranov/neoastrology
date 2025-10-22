# ✅ Pre-Deployment Checklist

Контрольный список перед развертыванием астрологической платформы.

---

## 📋 Обязательные шаги перед первым запуском

### 1. Установка зависимостей

```bash
# ✅ Установите Docker Desktop и убедитесь, что он запущен
docker --version
docker-compose --version

# ✅ Клонируйте репозиторий (если еще не сделали)
git clone <repository-url>
cd astrology
```

### 2. Установите frontend зависимости (ВАЖНО!)

```bash
# ✅ Это обязательный шаг перед первой сборкой
cd frontend
npm install
cd ..

# Проверьте, что созданы:
# - frontend/package-lock.json
# - node_modules/autoprefixer
```

**Почему это важно?**
- Docker использует `npm ci` для установки зависимостей
- `npm ci` требует наличие `package-lock.json`
- Установит `autoprefixer` и другие dev-зависимости
- Без этого frontend не соберется

### 3. Настройте environment variables

```bash
# ✅ Для development
cp .env.example .env.development
# Или просто используйте .env.development как есть

# ✅ Для production
cp .env.example .env

# Отредактируйте .env:
nano .env  # Linux/Mac
notepad .env  # Windows
```

**Обязательные переменные для production:**

```env
# Генерация секретных ключей
SECRET_KEY=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)

# Сильный пароль БД
POSTGRES_PASSWORD=$(openssl rand -base64 24)

# Ваш домен
FRONTEND_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com

# Stripe (production ключи)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# OpenAI
OPENAI_API_KEY=sk-...

# Production режим
DEBUG=False
```

### 4. Проверьте Docker network (если изменяли docker-compose.yml)

Если вы сделали network external, создайте его:

```bash
# Проверьте docker-compose.yml
cat docker-compose.yml | grep -A 3 "networks:"

# Если там external: true, создайте network
docker network create main-network
```

**Или используйте стандартную конфигурацию** (рекомендуется):

```yaml
networks:
  astrology_network:
    driver: bridge
    # БЕЗ external: true
```

---

## 🚀 Development Deployment

### Checklist

- [ ] Docker Desktop установлен и запущен
- [ ] `frontend/package-lock.json` существует (запустите `cd frontend && npm install`)
- [ ] `.env` или `.env.development` настроен
- [ ] Network создан (если используется external)

### Запуск

```bash
# Вариант 1: Используя Makefile
make dev

# Вариант 2: Используя скрипт
./scripts/dev-start.sh        # Linux/Mac
.\scripts\dev-start.ps1       # Windows

# Вариант 3: Вручную
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker-compose exec backend alembic upgrade head
```

### Проверка

```bash
# Проверьте статус
docker-compose ps

# Проверьте логи
docker-compose logs -f

# Проверьте health
make health
# Или
curl http://localhost:8001/health
curl http://localhost:3001
```

### Доступ к сервисам

- ✅ Frontend: http://localhost:3001
- ✅ Backend API: http://localhost:8001
- ✅ API Docs: http://localhost:8001/docs
- ✅ PostgreSQL: localhost:5432
- ✅ Redis: localhost:6379

---

## 🏭 Production Deployment

### Checklist

#### Перед развертыванием

- [ ] Сервер подготовлен (Ubuntu 20.04+, Docker установлен)
- [ ] Домен настроен (DNS указывает на сервер)
- [ ] `frontend/package-lock.json` существует
- [ ] `.env` полностью настроен с production ключами
- [ ] Все секретные ключи сгенерированы
- [ ] Stripe настроен (production mode)
- [ ] OpenAI API ключ получен
- [ ] Backup стратегия определена

#### Безопасность

- [ ] SECRET_KEY - случайный 32+ символов
- [ ] NEXTAUTH_SECRET - случайный 32+ символов
- [ ] POSTGRES_PASSWORD - сильный пароль
- [ ] DEBUG=False установлен
- [ ] Firewall настроен (ufw или аналог)
- [ ] SSH ключи настроены (не используйте пароли)
- [ ] SSL сертификаты получены или готовы к получению

#### Infrastructure

- [ ] Достаточно места на диске (минимум 20GB)
- [ ] Достаточно RAM (минимум 4GB)
- [ ] Backup стратегия настроена
- [ ] Мониторинг настроен (опционально)

### Шаг 1: Подготовка сервера

```bash
# Подключитесь к серверу
ssh user@your-server-ip

# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установите Docker Compose
sudo apt install docker-compose-plugin

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker
```

### Шаг 2: Клонирование проекта

```bash
# Создайте директорию
sudo mkdir -p /var/www/astrology
cd /var/www/astrology

# Клонируйте репозиторий
git clone <repository-url> .

# Установите права
sudo chown -R $USER:$USER /var/www/astrology
```

### Шаг 3: Настройка

```bash
# Сгенерируйте package-lock.json (ВАЖНО!)
cd frontend
npm install
cd ..

# Создайте .env
cp .env.example .env

# Заполните .env (используйте nano или vim)
nano .env

# Генерация ключей
openssl rand -hex 32  # Для SECRET_KEY
openssl rand -hex 32  # Для NEXTAUTH_SECRET
openssl rand -base64 24  # Для POSTGRES_PASSWORD
```

### Шаг 4: Запуск

```bash
# Используя Makefile
make prod-deploy

# Или вручную
docker-compose build --no-cache
docker-compose up -d
docker-compose exec backend alembic upgrade head
```

### Шаг 5: SSL Setup (опционально, но рекомендуется)

```bash
# Автоматическая настройка
make ssl-setup domain=your-domain.com

# Или вручную
sudo apt install certbot python3-certbot-nginx
docker-compose stop nginx
sudo certbot certonly --standalone -d your-domain.com
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
docker-compose up -d nginx
```

### Шаг 6: Настройка firewall

```bash
# Установите ufw
sudo apt install ufw

# Разрешите SSH
sudo ufw allow 22/tcp

# Разрешите HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включите firewall
sudo ufw enable

# Проверьте статус
sudo ufw status
```

### Шаг 7: Настройка backups

```bash
# Добавьте в crontab
crontab -e

# Добавьте строку (backup каждый день в 2 утра)
0 2 * * * cd /var/www/astrology && make backup

# Опционально: загрузка в облако
0 3 * * * cd /var/www/astrology && aws s3 cp ./backups s3://your-bucket/backups/ --recursive
```

### Шаг 8: Проверка

```bash
# Проверьте статус
docker-compose ps

# Проверьте логи
docker-compose logs -f

# Проверьте health
make health

# Проверьте сайт
curl https://your-domain.com/health
curl https://your-domain.com/api/health
```

---

## 🎯 Post-Deployment

### Обязательно после деплоя

- [ ] Проверьте, что все сервисы работают (`docker-compose ps`)
- [ ] Проверьте health endpoints
- [ ] Создайте тестового пользователя через API
- [ ] Проверьте создание натальной карты
- [ ] Проверьте, что гороскопы генерируются
- [ ] Настройте Stripe webhooks
- [ ] Проверьте SSL сертификат (если настроен)
- [ ] Создайте первый backup
- [ ] Настройте мониторинг (опционально)

### Stripe Webhooks Configuration

```bash
# В Stripe Dashboard (dashboard.stripe.com):
1. Перейдите в Developers > Webhooks
2. Добавьте endpoint: https://your-domain.com/api/v1/webhooks/stripe
3. Выберите события:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
4. Скопируйте webhook secret в .env (STRIPE_WEBHOOK_SECRET)
5. Перезапустите backend: docker-compose restart backend
```

### Мониторинг (опционально)

```bash
# Sentry для error tracking
# Добавьте в .env:
SENTRY_DSN=https://...@sentry.io/...

# Перезапустите
docker-compose restart backend frontend
```

---

## 📊 Финальная проверка

### Development

```bash
✅ docker-compose ps показывает 4-5 UP сервисов
✅ http://localhost:3001 открывается
✅ http://localhost:8001/docs показывает API
✅ Можно создать пользователя через API
✅ Можно создать натальную карту
✅ Логи без критических ошибок
```

### Production

```bash
✅ docker-compose ps показывает все UP сервисы
✅ https://your-domain.com открывается
✅ SSL сертификат валидный
✅ https://your-domain.com/api/health возвращает 200
✅ Можно зарегистрироваться через frontend
✅ Stripe webhooks настроены
✅ Backups работают
✅ Firewall настроен
✅ Мониторинг работает (если настроен)
```

---

## 🆘 Если что-то пошло не так

### Быстрые команды для диагностики

```bash
# Проверить логи
docker-compose logs -f

# Проверить статус
docker-compose ps

# Проверить health
make health

# Перезапустить всё
docker-compose restart

# Полная перезагрузка
docker-compose down
docker-compose up -d
```

### Полная документация

- 📖 [README.md](README.md) - Основная документация
- 🚀 [QUICKSTART.md](QUICKSTART.md) - Быстрый старт
- 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Решение проблем
- 📦 [DEPLOYMENT.md](DEPLOYMENT.md) - Детальный deployment guide

---

## 🎉 Готово!

После выполнения всех пунктов чеклиста ваша астрологическая платформа готова к использованию!

**Удачного запуска!** 🚀
