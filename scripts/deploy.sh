#!/bin/bash

# ==============================================
# Production Deployment Script
# ==============================================

set -e  # Exit on error

echo "🚀 Starting production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy .env.example to .env and configure it"
    exit 1
fi

# Pull latest code
echo "📦 Pulling latest code..."
git pull origin main

# Build and start containers
echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo "🔄 Starting services..."
docker-compose down
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if services are running
echo "✅ Checking service status..."
docker-compose ps

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T backend alembic upgrade head

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=50

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "Services:"
echo "  - Frontend: http://localhost (via nginx)"
echo "  - Backend API: http://localhost/api"
echo "  - API Docs: http://localhost/docs"
echo ""
echo "To view logs: docker-compose logs -f [service_name]"
echo "To stop: docker-compose down"
