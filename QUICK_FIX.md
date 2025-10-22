# ⚡ Quick Fix - Исправление ошибок сборки

## 🔧 Если Docker build не работает

### Проблема 1: npm ci requires package-lock.json

```bash
cd frontend
npm install
cd ..
```

### Проблема 2: Cannot find module 'autoprefixer'

```bash
cd frontend
npm install
cd ..
```

### Проблема 3: "/app/public": not found

```bash
mkdir -p frontend/public
touch frontend/public/.gitkeep
```

### Проблема 4: Port 8000 already in use

Порт изменен на 8001. Backend теперь на http://localhost:8001

### Проблема 5: Network not found

```bash
# Вариант A: Создать network
docker network create main-network

# Вариант B: Изменить docker-compose.yml
# Удалите или закомментируйте эти строки:
# external: true
# name: main-network
```

---

## ✅ После исправлений

```bash
# Соберите заново
docker-compose build --no-cache

# Запустите
docker-compose up -d

# Проверьте
docker-compose ps
docker-compose logs -f
```

---

## 🎯 Полное решение (все проблемы разом)

```bash
# 1. Установить зависимости и создать директории
cd frontend
npm install
cd ..
mkdir -p frontend/public

# 2. Создать network (если нужно)
docker network create main-network 2>/dev/null || true

# 3. Собрать образы
docker-compose build --no-cache

# 4. Запустить
docker-compose up -d

# 5. Применить миграции
sleep 10
docker-compose exec backend alembic upgrade head

# 6. Проверить
docker-compose ps
```

---

## 📚 Полная документация

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Все проблемы
- [START_HERE.md](START_HERE.md) - Быстрый старт
- [PRE_DEPLOY_CHECKLIST.md](PRE_DEPLOY_CHECKLIST.md) - Чеклист

---

Готово! 🎉
