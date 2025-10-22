# 🚀 Deployment Guide

Полное руководство по развертыванию астрологической платформы в production.

## 📋 Содержание

- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Production развертывание](#production-развертывание)
- [SSL сертификаты](#ssl-сертификаты)
- [Мониторинг](#мониторинг)
- [Резервное копирование](#резервное-копирование)
- [Масштабирование](#масштабирование)

## Требования

### Минимальные требования к серверу

- **CPU**: 2 cores
- **RAM**: 4 GB
- **Disk**: 20 GB SSD
- **OS**: Ubuntu 20.04+ / Debian 11+
- **Docker**: 20.10+
- **Docker Compose**: 2.0+

### Для production

- **CPU**: 4+ cores
- **RAM**: 8+ GB
- **Disk**: 50+ GB SSD
- **Домен**: с настроенным DNS
- **SSL**: Let's Encrypt или коммерческий сертификат

## Быстрый старт

### Локальная разработка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd astrology

# Запустить development окружение
make dev

# Или вручную
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Сервисы будут доступны:
- Frontend: http://localhost:3001
- Backend: http://localhost:8001
- API Docs: http://localhost:8001/docs

## Production развертывание

### 1. Подготовка сервера

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установить Docker Compose
sudo apt install docker-compose-plugin

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Клонирование проекта

```bash
# Создать директорию для проекта
sudo mkdir -p /var/www/astrology
cd /var/www/astrology

# Клонировать репозиторий
git clone <repository-url> .

# Установить права доступа
sudo chown -R $USER:$USER /var/www/astrology
```

### 3. Настройка окружения

```bash
# Создать .env файл
cp .env.example .env

# Отредактировать .env
nano .env
```

**Обязательно измените следующие переменные:**

```env
# Генерация случайных ключей
SECRET_KEY=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)

# Сильные пароли базы данных
POSTGRES_PASSWORD=$(openssl rand -base64 24)

# Ваш домен
FRONTEND_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com

# Production Stripe ключи
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# OpenAI API ключ
OPENAI_API_KEY=sk-...

# Отключить debug режим
DEBUG=False
```

### 4. Запуск приложения

#### Используя Makefile (рекомендуется)

```bash
# Развернуть в production
make prod-deploy

# Или пошагово:
make prod-build  # Собрать образы
make up          # Запустить контейнеры
make migrate     # Применить миграции
```

#### Используя скрипты

**Linux/macOS:**
```bash
chmod +x scripts/*.sh
./scripts/deploy.sh
```

**Windows (PowerShell):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\deploy.ps1
```

#### Вручную

```bash
# Собрать образы
docker-compose build --no-cache

# Запустить контейнеры
docker-compose up -d

# Применить миграции
docker-compose exec backend alembic upgrade head

# Проверить статус
docker-compose ps
```

### 5. Проверка развертывания

```bash
# Проверить здоровье сервисов
make health

# Или вручную
curl http://localhost/health
curl http://localhost/api/health

# Посмотреть логи
make logs

# Или для конкретного сервиса
docker-compose logs -f backend
```

## SSL сертификаты

### Автоматическая настройка (Let's Encrypt)

```bash
# Запустить скрипт настройки SSL
make ssl-setup domain=your-domain.com

# Или вручную
chmod +x scripts/ssl-setup.sh
./scripts/ssl-setup.sh your-domain.com admin@your-domain.com
```

### Ручная настройка SSL

1. Получить сертификаты:

```bash
# Используя certbot
sudo certbot certonly --standalone \
    -d your-domain.com \
    --email admin@your-domain.com \
    --agree-tos
```

2. Скопировать сертификаты:

```bash
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
```

3. Обновить nginx конфигурацию:

Раскомментировать HTTPS server блок в `nginx/conf.d/default.conf` и заменить `your-domain.com` на ваш домен.

4. Перезапустить nginx:

```bash
docker-compose restart nginx
```

### Автообновление сертификатов

Добавить в crontab:

```bash
# Открыть crontab
crontab -e

# Добавить строку (проверка каждый день в 3 утра)
0 3 * * * certbot renew --quiet --deploy-hook "docker-compose restart nginx"
```

## Мониторинг

### Логи приложения

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Последние 100 строк
docker-compose logs --tail=100 backend
```

### Метрики Docker

```bash
# Использование ресурсов
make stats

# Или
docker stats
```

### Health checks

```bash
# Проверить здоровье всех сервисов
make health

# API health endpoint
curl http://localhost/api/health
```

### Интеграция с Sentry (опционально)

Добавьте в `.env`:

```env
SENTRY_DSN=https://...@sentry.io/...
```

## Резервное копирование

### Автоматическое резервное копирование

```bash
# Создать backup
make backup

# Или вручную
./scripts/backup-db.sh
```

Backups сохраняются в `./backups/` с timestamp в имени файла.

### Восстановление из backup

```bash
# Восстановить из backup
make restore file=./backups/astrology_backup_20240101_120000.sql.gz

# Или вручную
./scripts/restore-db.sh ./backups/astrology_backup_20240101_120000.sql.gz
```

### Настройка автоматических backups

Добавить в crontab:

```bash
# Backup каждый день в 2 утра
0 2 * * * cd /var/www/astrology && make backup
```

### Резервирование в облако

#### AWS S3

```bash
# Установить AWS CLI
sudo apt install awscli

# Настроить credentials
aws configure

# Добавить в crontab после backup
0 2 * * * cd /var/www/astrology && make backup && aws s3 cp ./backups s3://your-bucket/backups/ --recursive
```

#### Google Cloud Storage

```bash
# Установить gsutil
curl https://sdk.cloud.google.com | bash

# Настроить
gcloud init

# Добавить в crontab
0 2 * * * cd /var/www/astrology && make backup && gsutil -m rsync -r ./backups gs://your-bucket/backups/
```

## Обновление приложения

### Zero-downtime обновление

```bash
# 1. Создать backup
make backup

# 2. Получить последние изменения
git pull origin main

# 3. Пересобрать и перезапустить
make prod-deploy

# 4. Проверить здоровье
make health
```

### Откат к предыдущей версии

```bash
# 1. Откатить код
git reset --hard <previous-commit>

# 2. Пересобрать
make prod-build

# 3. Перезапустить
make restart

# 4. Откатить миграции (если нужно)
make migrate-down
```

## Масштабирование

### Вертикальное масштабирование

Увеличить ресурсы в `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

### Горизонтальное масштабирование

```bash
# Запустить несколько реплик backend
docker-compose up -d --scale backend=3

# Nginx автоматически распределит нагрузку
```

### Использование с Docker Swarm

```bash
# Инициализировать swarm
docker swarm init

# Развернуть stack
docker stack deploy -c docker-compose.yml astrology

# Масштабировать
docker service scale astrology_backend=3
```

## Безопасность

### Firewall настройки

```bash
# Установить ufw
sudo apt install ufw

# Разрешить SSH
sudo ufw allow 22/tcp

# Разрешить HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включить firewall
sudo ufw enable
```

### Автоматические обновления безопасности

```bash
# Установить unattended-upgrades
sudo apt install unattended-upgrades

# Настроить
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Защита от DDoS

Настроить rate limiting в nginx (уже включен в конфигурации).

## Полезные команды

```bash
# Посмотреть все доступные команды
make help

# Перезапустить конкретный сервис
docker-compose restart backend

# Войти в контейнер
make backend-shell
make frontend-shell

# Доступ к базе данных
make db-shell

# Проверить использование диска
df -h
docker system df

# Очистить неиспользуемые образы и контейнеры
docker system prune -a
```

## Troubleshooting

### Контейнер не запускается

```bash
# Проверить логи
docker-compose logs <service-name>

# Проверить состояние
docker-compose ps

# Пересоздать контейнер
docker-compose up -d --force-recreate <service-name>
```

### Проблемы с подключением к БД

```bash
# Проверить, что БД запущена
docker-compose ps postgres

# Проверить логи БД
docker-compose logs postgres

# Проверить подключение
docker-compose exec postgres pg_isready
```

### Медленная работа

```bash
# Проверить использование ресурсов
docker stats

# Проверить логи на ошибки
docker-compose logs | grep -i error

# Очистить логи
truncate -s 0 $(docker inspect --format='{{.LogPath}}' <container-id>)
```

## Поддержка

Для получения помощи:
- Создайте issue в репозитории
- Проверьте логи: `make logs`
- Проверьте документацию в `README.md`

---

🌟 Успешного развертывания!
