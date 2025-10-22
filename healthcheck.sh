#!/bin/bash

# ==============================================
# Health Check Script for Monitoring
# ==============================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🏥 Astrology Platform Health Check"
echo "=================================="
echo ""

# Function to check HTTP endpoint
check_http() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}

    response_code=$(curl -s -o /dev/null -w "%{http_code}" $url 2>/dev/null)

    if [ "$response_code" = "$expected_code" ]; then
        echo -e "${GREEN}✓${NC} $name: OK (HTTP $response_code)"
        return 0
    else
        echo -e "${RED}✗${NC} $name: FAILED (HTTP $response_code, expected $expected_code)"
        return 1
    fi
}

# Function to check container
check_container() {
    local name=$1
    local container=$2

    if docker-compose ps $container | grep -q "Up"; then
        echo -e "${GREEN}✓${NC} $name: Running"
        return 0
    else
        echo -e "${RED}✗${NC} $name: Not running"
        return 1
    fi
}

# Check containers
echo "📦 Docker Containers:"
check_container "PostgreSQL" "postgres"
check_container "Redis" "redis"
check_container "Backend" "backend"
check_container "Frontend" "frontend"
check_container "Nginx" "nginx"
echo ""

# Check HTTP endpoints
echo "🌐 HTTP Endpoints:"
check_http "Nginx Health" "http://localhost/health"
check_http "Backend Health" "http://localhost:8000/health"
check_http "Frontend" "http://localhost:3000"
check_http "API Docs" "http://localhost:8000/docs"
echo ""

# Check database connection
echo "🗄️  Database:"
if docker-compose exec -T postgres pg_isready -U astrology_user > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} PostgreSQL: Ready"
else
    echo -e "${RED}✗${NC} PostgreSQL: Not ready"
fi

# Check Redis connection
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Redis: Responding"
else
    echo -e "${RED}✗${NC} Redis: Not responding"
fi
echo ""

# Check disk space
echo "💾 Disk Usage:"
df -h / | tail -1 | awk '{
    usage = substr($5, 1, length($5)-1)
    if (usage > 90)
        printf "\033[0;31m✗\033[0m Disk: %s (WARNING: Low space!)\n", $5
    else if (usage > 75)
        printf "\033[1;33m!\033[0m Disk: %s (Caution: Getting full)\n", $5
    else
        printf "\033[0;32m✓\033[0m Disk: %s used\n", $5
}'

# Docker disk usage
docker_df=$(docker system df --format "{{.Type}}\t{{.Size}}" | grep "Total" | awk '{print $2}')
echo -e "${GREEN}✓${NC} Docker: $docker_df used"
echo ""

# Memory usage
echo "💻 System Resources:"
free -h | grep "Mem:" | awk '{
    printf "Memory: %s / %s used (%.0f%%)\n", $3, $2, ($3/$2)*100
}'

# Container stats
echo ""
echo "📊 Container Statistics:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep -E "CONTAINER|astrology_"

echo ""
echo "=================================="
echo "Health check completed!"
