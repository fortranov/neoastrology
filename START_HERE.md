# 🚀 START HERE - Первый запуск

## ⚡ Быстрый старт за 3 шага

### Шаг 1️⃣: Установите зависимости frontend

```bash
cd frontend
npm install
cd ..
```

**Почему это важно?**
- Создаст `package-lock.json` (нужен для Docker)
- Установит `autoprefixer` и другие зависимости
- Без этого frontend не соберется

### Шаг 2️⃣: Запустите проект

```bash
# Используя Makefile (рекомендуется)
make dev

# Или на Windows:
.\scripts\dev-start.ps1
```

### Шаг 3️⃣: Откройте в браузере

- 🌐 Frontend: http://localhost:3000
- 📚 API Docs: http://localhost:8001/docs
- 🔧 Backend: http://localhost:8001

---

## 📋 Если нужны детали

### Development
👉 [QUICKSTART.md](QUICKSTART.md) - Детальный быстрый старт

### Production
👉 [PRE_DEPLOY_CHECKLIST.md](PRE_DEPLOY_CHECKLIST.md) - Полный чеклист

### Проблемы?
👉 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Решение всех проблем

---

## 🎯 Основные команды

```bash
make dev          # Запустить development
make dev-down     # Остановить
make logs         # Посмотреть логи
make health       # Проверить статус
make help         # Все команды
```

---

## 🆘 Частые проблемы

**❌ npm ci requires package-lock.json**
```bash
cd frontend && npm install && cd ..
```

**❌ Port already in use**
```bash
docker-compose down
# Или измените порт в docker-compose.yml
```

**❌ Network not found**
```bash
docker network create main-network
# Или уберите "external: true" из docker-compose.yml
```

---

## 📚 Полная документация

| Документ | Описание |
|----------|----------|
| [README.md](README.md) | Основная документация проекта |
| [QUICKSTART.md](QUICKSTART.md) | Быстрый старт за 5 минут |
| [PRE_DEPLOY_CHECKLIST.md](PRE_DEPLOY_CHECKLIST.md) | Чеклист перед деплоем |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Решение проблем |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Техническая архитектура |

---

## ✅ Что дальше?

1. ✅ Запустите проект: `make dev`
2. 🧪 Протестируйте API: http://localhost:8000/docs
3. 🎨 Посмотрите landing: http://localhost:3000
4. 🔧 Начните разработку!

**Удачи!** 🎉
