# 🔧 Troubleshooting Guide

Решения распространенных проблем при работе с астрологической платформой.

---

## 📦 Docker Build Errors

### ❌ Frontend: `npm ci` requires package-lock.json

**Ошибка:**
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

**Причина:** Отсутствует файл `package-lock.json` во frontend директории.

**Решение:**

```bash
# Перейти в frontend директорию
cd frontend

# Сгенерировать package-lock.json
npm install

# Вернуться в корень проекта
cd ..

# Теперь можно собрать Docker образы
docker-compose build frontend
```

**Или** добавьте package-lock.json в git:
```bash
git add frontend/package-lock.json
git commit -m "Add package-lock.json"
```

---

### ❌ Frontend: Cannot find module 'autoprefixer'

**Ошибка:**
```
Failed to compile.
app/layout.tsx
An error occurred in `next/font`.
Error: Cannot find module 'autoprefixer'
```

**Причина:** Отсутствует зависимость `autoprefixer` в devDependencies.

**Решение:**

```bash
cd frontend

# Установить autoprefixer
npm install --save-dev autoprefixer

# Или переустановить все зависимости
npm install

cd ..

# Пересобрать frontend
docker-compose build frontend
```

**Проверка:** Убедитесь, что в `frontend/package.json` есть:
```json
"devDependencies": {
  "autoprefixer": "^10.4.20",
  ...
}
```

---

### ❌ Frontend: "/app/public": not found

**Ошибка:**
```
COPY --from=builder /app/public ./public
"/app/public": not found
```

**Причина:** Отсутствует директория `public` в frontend.

**Решение:**

```bash
# Создать директорию public
mkdir -p frontend/public

# Добавить .gitkeep чтобы Git отслеживал пустую директорию
touch frontend/public/.gitkeep

# Пересобрать
docker-compose build frontend
```

**Альтернатива:** Dockerfile уже исправлен и создает директорию автоматически, просто пересоберите:
```bash
docker-compose build --no-cache frontend
```

---

### ❌ Backend: ModuleNotFoundError

**Ошибка:**
```
ModuleNotFoundError: No module named 'X'
```

**Решение:**

1. Проверьте, что все зависимости в `backend/requirements.txt`
2. Пересоберите образ:
```bash
docker-compose build --no-cache backend
```

---

### ❌ Database connection refused

**Ошибка:**
```
could not connect to server: Connection refused
```

**Решение:**

1. Проверьте, что PostgreSQL запущен:
```bash
docker-compose ps postgres
```

2. Подождите, пока БД полностью стартует:
```bash
# Посмотрите логи
docker-compose logs postgres

# Подождите 5-10 секунд
sleep 10

# Попробуйте снова
docker-compose restart backend
```

3. Проверьте DATABASE_URL в .env файле

---

## 🌐 Network Errors

### ❌ Network not found

**Ошибка:**
```
ERROR: Network main-network declared as external, but could not be found
```

**Решение:**

Если вы изменили docker-compose.yml и сделали network external, создайте его:

```bash
docker network create main-network
```

**Или** используйте стандартную конфигурацию (уберите `external: true`):

```yaml
networks:
  astrology_network:
    driver: bridge
```

---

### ❌ Port already in use

**Ошибка:**
```
Bind for 0.0.0.0:3000 failed: port is already allocated
```

**Решение:**

**Вариант 1:** Остановите процесс на порту
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**Вариант 2:** Измените порт в docker-compose.yml
```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Изменить с 3000 на 3001
```

---

## 🗄️ Database Issues

### ❌ Migration failed

**Ошибка:**
```
sqlalchemy.exc.ProgrammingError: relation does not exist
```

**Решение:**

1. Проверьте, что миграции применены:
```bash
docker-compose exec backend alembic current
```

2. Примените все миграции:
```bash
docker-compose exec backend alembic upgrade head
```

3. Если не помогло, пересоздайте БД:
```bash
# ВНИМАНИЕ: Удалит все данные!
docker-compose down -v
docker-compose up -d postgres
sleep 5
docker-compose exec backend alembic upgrade head
```

---

### ❌ Permission denied for schema

**Ошибка:**
```
permission denied for schema public
```

**Решение:**

Подключитесь к БД и дайте права:
```bash
docker-compose exec postgres psql -U astrology_user -d astrology -c "GRANT ALL ON SCHEMA public TO astrology_user;"
```

---

## 🔐 Authentication Issues

### ❌ JWT decode error

**Ошибка:**
```
Could not validate credentials
```

**Решение:**

1. Проверьте, что SECRET_KEY одинаковый везде
2. Проверьте срок действия токена (7 дней по умолчанию)
3. Перелогиньтесь (получите новый токен)

---

### ❌ CORS error in browser

**Ошибка:**
```
Access to fetch has been blocked by CORS policy
```

**Решение:**

Проверьте ALLOWED_ORIGINS в backend/.env:
```env
FRONTEND_URL=http://localhost:3001
ALLOWED_ORIGINS=["http://localhost:3001"]
```

И в backend/app/config.py убедитесь, что CORS настроен правильно.

---

## 📝 Environment Variables

### ❌ Environment variable not found

**Решение:**

1. Проверьте наличие .env файла:
```bash
ls -la .env
```

2. Скопируйте из примера:
```bash
cp .env.example .env
```

3. Заполните все обязательные переменные:
```env
# Минимально необходимые
DATABASE_URL=postgresql+asyncpg://...
SECRET_KEY=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:8001
```

4. Перезапустите контейнеры:
```bash
docker-compose down
docker-compose up -d
```

---

## 🚀 Deployment Issues

### ❌ SSL certificate error

**Ошибка:**
```
Certificate verification failed
```

**Решение:**

1. Проверьте, что сертификаты в правильной директории:
```bash
ls -la nginx/ssl/
```

2. Проверьте права доступа:
```bash
chmod 644 nginx/ssl/*.pem
```

3. Убедитесь, что домен указан правильно в nginx/conf.d/default.conf

---

### ❌ 502 Bad Gateway

**Причины и решения:**

**1. Backend не запущен:**
```bash
docker-compose ps backend
docker-compose logs backend
docker-compose restart backend
```

**2. Backend не отвечает:**
```bash
# Проверьте health endpoint
curl http://localhost:8001/health

# Проверьте логи
docker-compose logs -f backend
```

**3. Неправильный upstream в nginx:**
Проверьте nginx/conf.d/default.conf:
```nginx
upstream backend {
    server backend:8000;  # Должен быть имя сервиса из docker-compose
}
```

---

### ❌ Static files not loading (404)

**Решение:**

1. Для development - убедитесь, что Next.js запущен:
```bash
docker-compose logs frontend
```

2. Для production - проверьте, что build прошел успешно:
```bash
docker-compose exec frontend ls -la .next
```

3. Проверьте nginx конфигурацию для static files caching

---

## 🔍 Debugging Commands

### Проверка статуса всех сервисов
```bash
docker-compose ps
```

### Просмотр логов
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

### Проверка здоровья сервисов
```bash
# Использовать make команду
make health

# Или вручную
curl http://localhost/health
curl http://localhost:8001/health
docker-compose exec postgres pg_isready
docker-compose exec redis redis-cli ping
```

### Вход в контейнер
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh

# PostgreSQL
docker-compose exec postgres psql -U astrology_user -d astrology

# Redis
docker-compose exec redis redis-cli
```

### Проверка переменных окружения
```bash
docker-compose exec backend env | grep DATABASE_URL
docker-compose exec frontend env | grep NEXT_PUBLIC
```

### Проверка использования ресурсов
```bash
docker stats
```

### Очистка системы
```bash
# Остановить и удалить контейнеры
docker-compose down

# Удалить volumes (ОСТОРОЖНО: удалит БД!)
docker-compose down -v

# Удалить неиспользуемые образы
docker system prune -a

# Полная очистка
make clean
```

---

## 🐛 Common Backend Errors

### ❌ kerykeion import error

**Ошибка:**
```
ImportError: cannot import name 'AstrologicalSubject' from 'kerykeion'
```

**Решение:**

Проверьте версию kerykeion в requirements.txt и обновите:
```bash
docker-compose exec backend pip install --upgrade kerykeion
```

---

### ❌ OpenAI API error

**Ошибка:**
```
openai.error.AuthenticationError: Incorrect API key provided
```

**Решение:**

1. Проверьте OPENAI_API_KEY в .env
2. Убедитесь, что ключ активен на platform.openai.com
3. Проверьте баланс аккаунта

---

## 🎨 Frontend Issues

### ❌ Hydration error in Next.js

**Ошибка:**
```
Error: Hydration failed because the initial UI does not match
```

**Решение:**

1. Очистите .next директорию:
```bash
docker-compose exec frontend rm -rf .next
docker-compose restart frontend
```

2. Проверьте, что не используется localStorage/window в server components

---

### ❌ Module not found in Next.js

**Решение:**

1. Пересоберите образ:
```bash
docker-compose build --no-cache frontend
```

2. Проверьте импорты (используйте @ alias для путей)

---

## 🔄 Performance Issues

### ❌ Slow response times

**Диагностика:**

1. Проверьте использование CPU/RAM:
```bash
docker stats
```

2. Проверьте логи на ошибки:
```bash
docker-compose logs | grep -i error
```

3. Проверьте подключение к БД:
```bash
docker-compose exec backend python -c "from app.database import engine; print('DB OK')"
```

**Решение:**

1. Увеличьте ресурсы в docker-compose.yml
2. Включите Redis кэширование
3. Оптимизируйте запросы к БД (добавьте индексы)

---

## 📞 Getting Help

Если проблема не решена:

1. ✅ Проверьте эту документацию
2. ✅ Посмотрите логи: `docker-compose logs -f`
3. ✅ Проверьте health: `make health`
4. ✅ Пересоздайте контейнеры: `docker-compose down && docker-compose up -d`
5. ✅ Проверьте GitHub Issues
6. ✅ Создайте новый Issue с описанием проблемы и логами

---

## 📚 Useful Links

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Совет:** Всегда начинайте с проверки логов командой `docker-compose logs -f [service]`
