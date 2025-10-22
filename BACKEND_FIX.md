# 🔧 Исправление Backend - Permission Denied для Alembic

## ❌ Проблема

При запуске backend контейнера возникает ошибка:
```
Waiting for database...
sh: 4: alembic: Permission denied
```

## 🔍 Причина

В Dockerfile backend:
1. Зависимости Python устанавливались в `/root/.local`
2. Потом создавался пользователь `appuser`
3. Пользователь `appuser` не имел доступа к файлам в `/root/.local`
4. Команда `alembic` не могла быть выполнена

## ✅ Решение

Изменен порядок операций в `backend/Dockerfile`:

**Было:**
```dockerfile
# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser
```

**Стало:**
```dockerfile
# Create non-root user first
RUN useradd -m -u 1000 appuser

# Copy Python dependencies to appuser home
COPY --from=builder /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH

# Copy application code
COPY . .

# Set correct ownership
RUN chown -R appuser:appuser /app /home/appuser/.local

USER appuser
```

## 🚀 Как применить исправление

### Вариант 1: Использовать готовый скрипт (рекомендуется)

**Windows (PowerShell):**
```powershell
.\rebuild-backend.ps1
```

**Linux/Mac:**
```bash
chmod +x rebuild-backend.sh
./rebuild-backend.sh
```

### Вариант 2: Вручную

```bash
# 1. Остановить backend
docker-compose stop backend

# 2. Удалить контейнер
docker-compose rm -f backend

# 3. Пересобрать образ
docker-compose build --no-cache backend

# 4. Запустить заново
docker-compose up -d backend

# 5. Проверить логи
docker-compose logs -f backend
```

## 🧪 Проверка

После пересборки в логах должно быть:

```
Waiting for database...
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Проверьте доступность API:

```bash
# Health check
curl http://localhost:8001/health

# Должен вернуть:
{"status":"healthy"}

# API docs
curl http://localhost:8001/docs
# Или откройте в браузере
```

## 📝 Что изменилось

1. ✅ Создаем пользователя `appuser` ДО копирования зависимостей
2. ✅ Копируем зависимости в `/home/appuser/.local` (не в `/root/.local`)
3. ✅ Устанавливаем PATH на `/home/appuser/.local/bin`
4. ✅ Явно устанавливаем права на `/app` и `/home/appuser/.local`
5. ✅ Переключаемся на `appuser`

## ⚠️ Важно

После применения исправления:

1. **Backend будет доступен на http://localhost:8001**
2. **Frontend ожидает API на этом адресе** (настроено в `NEXT_PUBLIC_API_URL`)
3. **Миграции alembic будут выполняться автоматически** при старте контейнера

## 🔄 Следующие шаги

После успешного запуска backend:

1. Проверьте health: `curl http://localhost:8001/health`
2. Откройте API docs: http://localhost:8001/docs
3. Запустите frontend: `cd frontend && npm run dev`
4. Откройте приложение: http://localhost:3001
5. Попробуйте зарегистрироваться: http://localhost:3001/register

## ✅ Готово!

Теперь backend должен работать корректно, и регистрация пользователей будет функционировать! 🎉
