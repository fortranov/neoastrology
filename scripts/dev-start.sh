#!/bin/bash

# ==============================================
# Development Start Script
# ==============================================

set -e

echo "🔧 Starting development environment..."

# Check if .env.development exists, copy if not
if [ ! -f .env ]; then
    if [ -f .env.development ]; then
        echo "📝 Copying .env.development to .env..."
        cp .env.development .env
    else
        echo "⚠️  Warning: No .env file found. Using defaults."
    fi
fi

# Start services
echo "🚀 Starting Docker containers..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose exec backend alembic upgrade head

# Show status
echo "✅ Development environment is ready!"
echo ""
echo "Services:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "To view logs: docker-compose logs -f [service_name]"
echo "To stop: docker-compose down"
