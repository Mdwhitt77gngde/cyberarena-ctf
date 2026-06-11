@echo off
REM start_server.bat
REM Script simple para iniciar el servidor en Windows sin PowerShell
REM Detecta y soluciona problemas de puertos automáticamente

setlocal enabledelayedexpansion
set PORT=8000
set HOST=127.0.0.1

echo.
echo ======================================================================
echo.
echo   CyberArena CTF Platform - Smart Server Launcher
echo.
echo ======================================================================
echo.

:check_port
echo [*] Verificando si puerto %PORT% esta disponible...

REM Buscar proceso en el puerto
for /f "tokens=1,2,3,4,5" %%a in ('netstat -ano ^| findstr ":%PORT%"') do (
    set PID=%%e
    if not "!PID!"=="" (
        echo [!] Puerto %PORT% esta ocupado. Proceso encontrado: PID !PID!
        echo.
        echo [+] Terminando proceso...
        taskkill /PID !PID! /F >nul 2>&1
        
        if !ERRORLEVEL! equ 0 (
            echo [+] Proceso terminado exitosamente.
            timeout /t 2 /nobreak
        ) else (
            echo [!] Error al terminar el proceso. Intentando con puerto alternativo...
            set /a PORT=!PORT!+1
            goto check_port
        )
    )
)

echo [+] Puerto %PORT% esta disponible.
echo.
echo [+] Iniciando servidor en http://%HOST%:%PORT%
echo.

cd /d "%~dp0backend" 2>nul

if not exist "main.py" (
    echo [!] Error: No se encontro main.py en el directorio backend
    echo [*] Asegurate de estar en el directorio correcto
    pause
    exit /b 1
)

echo [*] Instalando dependencias si es necesario...
python -m pip install -q uvicorn fastapi sqlalchemy python-jose passlib python-dotenv bcrypt psutil 2>nul

echo.
echo [*] Iniciando uvicorn...
echo.
echo ======================================================================
echo   API URL: http://%HOST%:%PORT%
echo   Docs: http://%HOST%:%PORT%/docs
echo   ReDoc: http://%HOST%:%PORT%/redoc
echo ======================================================================
echo.
echo [*] Presiona Ctrl+C para detener el servidor
echo.

python -m uvicorn main:app --host %HOST% --port %PORT% --reload

if !ERRORLEVEL! neq 0 (
    echo.
    echo [!] El servidor se cerro con error
    echo [*] Intenta con un puerto diferente
    pause
    exit /b 1
)

exit /b 0
