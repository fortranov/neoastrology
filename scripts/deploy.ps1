# ==============================================
# Production Deployment Script (PowerShell)
# ==============================================

Write-Host "🚀 Starting production deployment..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found" -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and configure it" -ForegroundColor Yellow
    exit 1
}

# Pull latest code
Write-Host "📦 Pulling latest code..." -ForegroundColor Cyan
git pull origin main

# Build and start containers
Write-Host "🔨 Building Docker images..." -ForegroundColor Cyan
docker-compose build --no-cache

Write-Host "🔄 Starting services..." -ForegroundColor Cyan
docker-compose down
docker-compose up -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Check if services are running
Write-Host "✅ Checking service status..." -ForegroundColor Cyan
docker-compose ps

# Run database migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
docker-compose exec -T backend alembic upgrade head

# Show logs
Write-Host "📋 Recent logs:" -ForegroundColor Cyan
docker-compose logs --tail=50

Write-Host ""
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
Write-Host "  - Frontend: http://localhost (via nginx)"
Write-Host "  - Backend API: http://localhost/api"
Write-Host "  - API Docs: http://localhost/docs"
Write-Host ""
Write-Host "To view logs: docker-compose logs -f [service_name]" -ForegroundColor Gray
Write-Host "To stop: docker-compose down" -ForegroundColor Gray
