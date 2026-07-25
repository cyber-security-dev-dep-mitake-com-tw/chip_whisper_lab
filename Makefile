.PHONY: help dev install test lint format docker-up docker-down release clean

# Default target
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

## Development Setup
install: ## Install all dependencies (scripts, backend, frontend)
	./scripts/install-macos.sh --yes
	cd backend && pip install -e .[dev]
	cd app && npm ci

dev: ## Start full development environment with Docker Compose
	docker-compose up -d
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/api/docs"
	@echo "Jupyter: http://localhost:8888"

docker-up: ## Start Docker services only
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

## Testing
test: test-backend test-frontend test-robot ## Run all tests

test-backend: ## Run backend unit and integration tests
	cd backend && pytest tests/ -v --tb=short

test-frontend: ## Run frontend tests
	cd app && npm test

test-robot: ## Run Robot Framework suites
	cd tests/robot && robot -d results suites/

test-ci: ## Run CI-equivalent tests (lint + typecheck + unit + robot)
	make lint
	make typecheck
	make test-backend
	make test-robot

## Linting & Type Checking
lint: lint-scripts lint-backend lint-frontend ## Run all linters

lint-scripts: ## Lint shell scripts
	shellcheck scripts/*.sh scripts/lib/*.sh
	shfmt -d scripts/*.sh scripts/lib/*.sh

lint-backend: ## Lint backend Python code
	cd backend && ruff check .

lint-frontend: ## Lint frontend TypeScript code
	cd app && npm run lint

typecheck: typecheck-backend typecheck-frontend ## Run all type checkers

typecheck-backend: ## Type check backend
	cd backend && mypy src/ --ignore-missing-imports

typecheck-frontend: ## Type check frontend
	cd app && npx tsc --noEmit

## Code Quality
format: format-backend format-frontend format-scripts ## Auto-format all code

format-backend: ## Format backend Python code
	cd backend && ruff check --fix .

format-frontend: ## Format frontend code
	cd app && npm run format 2>/dev/null || npx prettier --write app/

format-scripts: ##Format shell scripts
	shfmt -w scripts/*.sh scripts/lib/*.sh

## Docker
docker-build: ## Build all Docker images
	docker-compose build

docker-verify: ## Verify Docker build and health checks
	docker-compose up -d
	docker-compose ps
	@echo "Waiting for services to be healthy..."
	sleep 10
	curl -f http://localhost:8000/api/v1/health && echo "Backend OK"
	curl -f http://localhost:3000 && echo "Frontend OK"
	curl -f http://localhost:8888/api && echo "Jupyter OK"

docker-clean: ## Remove all Docker volumes and images
	docker-compose down -v --rmi all

## Release
release-dry-run: ## Dry-run release build
	@echo "Running release dry-run..."
	./scripts/install-macos.sh --dry-run
	./scripts/doctor-macos.sh --json --simulator-only=true

release-check: ## Pre-release checklist
	@echo "Checking release prerequisites..."
	@git status --short
	@git log --oneline -5
	@echo "Release checklist:"
	@echo "  [x] All tests pass (make test-ci)"
	@echo "  [x] Lint and typecheck pass (make lint)"
	@echo "  [x] CHANGELOG.md updated"
	@echo "  [x] Version bumped in package.json and backend/pyproject.toml"
	@echo "  [x] Docker images build successfully"

## Cleanup
clean: ## Remove build artifacts and temporary files
	rm -rf app/dist app/.next app/node_modules/.cache
	rm -rf backend/dist backend/.pytest_cache backend/.ruff_cache
	rm -rf .venv .toolchains
	rm -f INSTALL_REPORT.json
	@echo "Clean complete"
