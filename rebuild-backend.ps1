# PowerShell script для Windows

Write-Host "🔄 Остановка backend контейнера..." -ForegroundColor Yellow
docker-compose stop backend

Write-Host "🗑️ Удаление старого контейнера..." -ForegroundColor Yellow
docker-compose rm -f backend

Write-Host "🔨 Пересборка backend образа..." -ForegroundColor Cyan
docker-compose build --no-cache backend

Write-Host "🚀 Запуск backend..." -ForegroundColor Green
docker-compose up -d backend

Write-Host "⏳ Ожидание запуска backend (10 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "📋 Логи backend:" -ForegroundColor Cyan
docker-compose logs --tail=50 backend

Write-Host "`n✅ Готово! Backend должен быть доступен на http://localhost:8001" -ForegroundColor Green
