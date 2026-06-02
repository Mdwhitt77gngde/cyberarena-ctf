#!/usr/bin/env python3
"""
Sistema de verificación de dependencias
Comprueba que todo está instalado y configurado correctamente
"""

import sys
import subprocess
import socket
from pathlib import Path

def check_python_version():
    """Verifica versión de Python"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python 3.8+ requerido (tienes {version.major}.{version.minor})")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_package(package_name, import_name=None):
    """Verifica si un paquete está instalado"""
    if import_name is None:
        import_name = package_name
    
    try:
        __import__(import_name)
        print(f"✅ {package_name}")
        return True
    except ImportError:
        print(f"❌ {package_name} (no instalado)")
        return False

def check_all_packages():
    """Verifica todas las dependencias"""
    print("\n📦 Verificando dependencias...")
    
    packages = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"),
        ("sqlalchemy", "sqlalchemy"),
        ("pydantic", "pydantic"),
        ("python-jose", "jose"),
        ("passlib", "passlib"),
        ("python-dotenv", "dotenv"),
        ("psutil", "psutil"),
        ("requests", "requests"),
    ]
    
    all_ok = True
    for package, import_name in packages:
        if not check_package(package, import_name):
            all_ok = False
    
    return all_ok

def check_port_available(port=8000):
    """Verifica si el puerto está disponible"""
    print(f"\n🔌 Verificando puerto {port}...")
    
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(('127.0.0.1', port))
        sock.close()
        print(f"✅ Puerto {port} disponible")
        return True
    except OSError:
        print(f"⚠️  Puerto {port} ocupado (se usará alternativo)")
        return False

def check_files():
    """Verifica que los archivos necesarios existen"""
    print("\n📁 Verificando archivos...")
    
    files = [
        "backend/main.py",
        "backend/app/models.py",
        "backend/app/security.py",
        "backend/app/routers/challenges.py",
        "backend/app/routers/hints.py",
    ]
    
    all_ok = True
    for file_path in files:
        if Path(file_path).exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} (no encontrado)")
            all_ok = False
    
    return all_ok

def check_scripts():
    """Verifica que los scripts están disponibles"""
    print("\n🚀 Verificando scripts...")
    
    scripts = [
        ("backend/run_server.py", "Python"),
        ("start_server.ps1", "PowerShell"),
        ("start_server.bat", "Batch"),
    ]
    
    all_ok = True
    for script_path, script_type in scripts:
        if Path(script_path).exists():
            print(f"✅ {script_type}: {script_path}")
        else:
            print(f"⚠️  {script_type}: {script_path} (no encontrado)")
    
    return all_ok

def main():
    """Ejecuta todas las verificaciones"""
    print("\n" + "="*70)
    print("🔍 Sistema de Verificación - CyberArena CTF Platform")
    print("="*70)
    
    # Verificaciones
    checks = [
        ("Python", check_python_version),
        ("Dependencias", check_all_packages),
        ("Puerto", check_port_available),
        ("Archivos", check_files),
        ("Scripts", check_scripts),
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"❌ Error en {name}: {e}")
            results.append((name, False))
    
    # Resumen
    print("\n" + "="*70)
    print("📋 RESUMEN")
    print("="*70)
    
    all_passed = all(result for _, result in results)
    
    for name, result in results:
        status = "✅ OK" if result else "❌ FALLO"
        print(f"{status}: {name}")
    
    print("="*70)
    
    if all_passed:
        print("\n🎉 ¡TODO ESTÁ LISTO!")
        print("\n👉 Ahora puedes iniciar el servidor con:")
        print("   python backend/run_server.py")
        print("\n📚 Documentación: QUICK_START_SERVER.md")
        return 0
    else:
        print("\n⚠️  Hay problemas que resolver:")
        print("\n1. Instala dependencias faltantes:")
        print("   pip install -r requirements.txt")
        print("\n2. Verifica que los archivos del backend existan")
        print("\n3. Intenta de nuevo:")
        print("   python verify_setup.py")
        return 1

if __name__ == "__main__":
    sys.exit(main())
