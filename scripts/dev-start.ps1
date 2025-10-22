# ==============================================
# Development Start Script (PowerShell)
# ==============================================

Write-Host "🔧 Starting development environment..." -ForegroundColor Green

# Check if .env.development exists, copy if not
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.development") {
        Write-Host "📝 Copying .env.development to .env..." -ForegroundColor Cyan
        Copy-Item .env.development .env
    } else {
        Write-Host "⚠️  Warning: No .env file found. Using defaults." -ForegroundColor Yellow
    }
}

# Start services
Write-Host "🚀 Starting Docker containers..." -ForegroundColor Cyan
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Wait for database
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Run migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
docker-compose exec backend alembic upgrade head

# Show status
Write-Host "✅ Development environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
Write-Host "  - Frontend: http://localhost:3000"
Write-Host "  - Backend: http://localhost:8000"
Write-Host "  - API Docs: http://localhost:8000/docs"
Write-Host "  - PostgreSQL: localhost:5432"
Write-Host "  - Redis: localhost:6379"
Write-Host ""
Write-Host "To view logs: docker-compose logs -f [service_name]" -ForegroundColor Gray
Write-Host "To stop: docker-compose down" -ForegroundColor Gray
