# Makefile para desarrollo del CyberArena CTF Platform
# Uso: make server (Windows, Mac, Linux)

.PHONY: help install server dev test clean lint format

help:
	@echo "======================================================================"
	@echo "CyberArena CTF Platform - Makefile Commands"
	@echo "======================================================================"
	@echo ""
	@echo "Comandos disponibles:"
	@echo ""
	@echo "  make server    - Inicia el servidor (puerto automático)"
	@echo "  make dev       - Inicia en modo desarrollo con reload"
	@echo "  make install   - Instala dependencias"
	@echo "  make test      - Ejecuta tests"
	@echo "  make clean     - Limpia caché y archivos temporales"
	@echo "  make lint      - Ejecuta linting del código"
	@echo "  make format    - Formatea código con black"
	@echo ""
	@echo "Ejemplos:"
	@echo "  make server    # Inicia con puerto automático"
	@echo "  make install   # Instala pip packages"
	@echo "  make test      # Corre integration tests"
	@echo ""

install:
	@echo "Instalando dependencias..."
	pip install -q uvicorn fastapi sqlalchemy python-jose passlib python-dotenv bcrypt psutil requests
	@echo "✅ Dependencias instaladas"

server:
	@echo "Iniciando servidor CyberArena..."
	cd backend && python run_server.py

dev:
	@echo "Iniciando en modo desarrollo..."
	cd backend && uvicorn main:app --host 127.0.0.1 --port 8000 --reload

test:
	@echo "Ejecutando tests..."
	cd backend && python tests/integration_tests_sprint3.py

clean:
	@echo "Limpiando caché..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	@echo "✅ Limpieza completada"

lint:
	@echo "Ejecutando pylint..."
	pylint backend/app/ 2>/dev/null || echo "pylint no instalado"

format:
	@echo "Formateando código..."
	black backend/app/ backend/main.py 2>/dev/null || echo "black no instalado"

# Alias útiles
.PHONY: run start up
run: server
start: server
up: server

# Default
.DEFAULT_GOAL := help
