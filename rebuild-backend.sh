#!/bin/bash

echo "🔄 Остановка backend контейнера..."
docker-compose stop backend

echo "🗑️ Удаление старого контейнера..."
docker-compose rm -f backend

echo "🔨 Пересборка backend образа..."
docker-compose build --no-cache backend

echo "🚀 Запуск backend..."
docker-compose up -d backend

echo "⏳ Ожидание запуска backend (10 секунд)..."
sleep 10

echo "📋 Логи backend:"
docker-compose logs --tail=50 backend

echo "✅ Готово! Backend должен быть доступен на http://localhost:8001"
