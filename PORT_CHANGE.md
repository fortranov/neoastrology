# ⚠️ Port Changes - Изменения портов

## 🔄 Изменения

**Backend порт изменен с 8000 на 8001**
**Frontend порт изменен с 3000 на 3001**

### Причина
Порты 8000 и 3000 уже используются другими проектами на вашей машине.

### Что изменилось

| Компонент | Старый URL | Новый URL |
|-----------|-----------|-----------|
| Frontend | http://localhost:3000 | http://localhost:3001 |
| Backend API | http://localhost:8000 | http://localhost:8001 |
| API Docs | http://localhost:8000/docs | http://localhost:8001/docs |
| API Health | http://localhost:8000/health | http://localhost:8001/health |

---

## 📝 Обновленные файлы

### Configuration:
1. ✅ `docker-compose.yml` - порт backend: `8001:8000`, порт frontend: `3001:3000`
2. ✅ `docker-compose.yml` - FRONTEND_URL, NEXTAUTH_URL
3. ✅ `.env.example` - NEXT_PUBLIC_API_URL
4. ✅ `.env.development` - NEXT_PUBLIC_API_URL
5. ✅ `frontend/.env.example` - NEXT_PUBLIC_API_URL

### Documentation (обновлено все ссылки):
- ✅ README.md
- ✅ QUICKSTART.md
- ✅ START_HERE.md
- ✅ DEPLOYMENT.md
- ✅ TROUBLESHOOTING.md
- ✅ PRE_DEPLOY_CHECKLIST.md
- ✅ PROJECT_SUMMARY.md
- ✅ CLAUDE.md
- ✅ backend/README.md
- ✅ frontend/README.md

---

## 🚀 Как использовать

### Новые URLs:

```bash
# Backend API
curl http://localhost:8001/health

# API Documentation
open http://localhost:8001/docs

# Frontend
open http://localhost:3001
```

### Environment Variables:

```env
# В .env или .env.development
NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

## ✅ Проверка

```bash
# Запустите проект
docker-compose up -d

# Проверьте backend на новом порту
curl http://localhost:8001/health

# Должен вернуть:
# {"status": "healthy"}
```

---

## 🔧 Если нужен другой порт

### Изменить порт Backend:

Измените в `docker-compose.yml`:
```yaml
backend:
  ports:
    - "ВАШ_ПОРТ:8000"  # Например: "8002:8000"
```

Затем обновите `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:ВАШ_ПОРТ
```

### Изменить порт Frontend:

Измените в `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "ВАШ_ПОРТ:3000"  # Например: "3002:3000"
```

Затем обновите FRONTEND_URL и NEXTAUTH_URL в `docker-compose.yml`

---

## 📊 Внутренние порты (в Docker network)

| Сервис | External (Host) | Internal (Container) |
|--------|----------------|---------------------|
| Frontend | **3001** | 3000 |
| Backend | **8001** | 8000 |
| PostgreSQL | 5432 | 5432 |
| Redis | 6379 | 6379 |

**Важно**: Внутри Docker network сервисы общаются по внутренним портам:
- Frontend → Backend: `http://backend:8000`
- Backend → PostgreSQL: `postgres:5432`
- Backend → Redis: `redis:6379`

---

## ✨ Готово!

**Frontend** теперь доступен на **http://localhost:3001** 🎉
**Backend** теперь доступен на **http://localhost:8001** 🎉

Все документы обновлены автоматически.
