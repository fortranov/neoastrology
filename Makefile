.PHONY: help build up down restart logs ps clean dev prod migrate backup restore test

# Colors for output
YELLOW := \033[1;33m
GREEN := \033[1;32m
CYAN := \033[1;36m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(CYAN)Astrology Platform - Make Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Development commands
dev: ## Start development environment
	@echo "$(YELLOW)Starting development environment...$(NC)"
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "$(GREEN)Development environment started!$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"

dev-down: ## Stop development environment
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

dev-logs: ## View development logs
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Production commands
prod: ## Start production environment
	@echo "$(YELLOW)Starting production environment...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)Production environment started!$(NC)"

prod-build: ## Build production images
	@echo "$(YELLOW)Building production images...$(NC)"
	@docker-compose build --no-cache

prod-deploy: ## Deploy to production (pull, build, up, migrate)
	@echo "$(YELLOW)Deploying to production...$(NC)"
	@git pull origin main
	@docker-compose build
	@docker-compose down
	@docker-compose up -d
	@$(MAKE) migrate
	@echo "$(GREEN)Deployment completed!$(NC)"

# Docker commands
build: ## Build all Docker images
	@docker-compose build

up: ## Start all services
	@docker-compose up -d

down: ## Stop all services
	@docker-compose down

restart: ## Restart all services
	@docker-compose restart

logs: ## View logs (use service=<name> for specific service)
	@docker-compose logs -f $(service)

ps: ## Show running containers
	@docker-compose ps

clean: ## Remove all containers, volumes, and images
	@echo "$(YELLOW)Warning: This will remove all containers, volumes, and images!$(NC)"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		docker system prune -af; \
		echo "$(GREEN)Cleanup completed!$(NC)"; \
	fi

# Database commands
migrate: ## Run database migrations
	@echo "$(YELLOW)Running database migrations...$(NC)"
	@docker-compose exec backend alembic upgrade head
	@echo "$(GREEN)Migrations completed!$(NC)"

migrate-create: ## Create new migration (use name=<migration_name>)
	@docker-compose exec backend alembic revision --autogenerate -m "$(name)"

migrate-down: ## Rollback last migration
	@docker-compose exec backend alembic downgrade -1

migrate-history: ## Show migration history
	@docker-compose exec backend alembic history

backup: ## Backup database
	@echo "$(YELLOW)Creating database backup...$(NC)"
	@bash scripts/backup-db.sh
	@echo "$(GREEN)Backup completed!$(NC)"

restore: ## Restore database from backup (use file=<path>)
	@bash scripts/restore-db.sh $(file)

# Database shell access
db-shell: ## Access PostgreSQL shell
	@docker-compose exec postgres psql -U astrology_user -d astrology

db-reset: ## Reset database (DANGER: deletes all data!)
	@echo "$(YELLOW)Warning: This will delete all database data!$(NC)"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		docker-compose up -d postgres; \
		sleep 5; \
		$(MAKE) migrate; \
		echo "$(GREEN)Database reset completed!$(NC)"; \
	fi

# Testing commands
test: ## Run backend tests
	@docker-compose exec backend pytest

test-cov: ## Run tests with coverage
	@docker-compose exec backend pytest --cov=app --cov-report=html

# Service-specific commands
backend-shell: ## Access backend container shell
	@docker-compose exec backend bash

frontend-shell: ## Access frontend container shell
	@docker-compose exec frontend sh

redis-cli: ## Access Redis CLI
	@docker-compose exec redis redis-cli

# Monitoring commands
health: ## Check health of all services
	@echo "$(CYAN)Checking service health...$(NC)"
	@curl -s http://localhost/health || echo "Nginx: $(YELLOW)DOWN$(NC)"
	@curl -s http://localhost:8000/health || echo "Backend: $(YELLOW)DOWN$(NC)"
	@curl -s http://localhost:3000 > /dev/null && echo "Frontend: $(GREEN)UP$(NC)" || echo "Frontend: $(YELLOW)DOWN$(NC)"

stats: ## Show Docker stats
	@docker stats --no-stream

# SSL commands
ssl-setup: ## Setup SSL certificate (use domain=<your-domain.com>)
	@bash scripts/ssl-setup.sh $(domain)

# Default target
.DEFAULT_GOAL := help
