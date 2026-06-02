#!/usr/bin/env python3
"""
Smart Server Runner - Maneja automáticamente puertos ocupados
Detecta, limpia y reinicia sin intervención manual
"""

import os
import sys
import socket
import subprocess
import time
import signal
import psutil
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración
DEFAULT_HOST = os.getenv("API_HOST", "127.0.0.1")
DEFAULT_PORT = int(os.getenv("API_PORT", 8000))
MAX_RETRIES = 3
RETRY_DELAY = 2


class ServerRunner:
    """Gestor automático del servidor"""
    
    def __init__(self, host=DEFAULT_HOST, port=DEFAULT_PORT):
        self.host = host
        self.port = port
        self.original_port = port
        self.process = None
        self.attempt = 0
        
    def print_header(self):
        """Imprime encabezado decorativo"""
        print("\n" + "="*70)
        print("🚀 CyberArena CTF Platform - Smart Server Runner")
        print("="*70)
        
    def print_status(self, message, status="INFO", color_code=36):
        """
        Imprime mensajes formateados
        color_code: 32=verde, 33=amarillo, 31=rojo, 36=cian
        """
        symbols = {
            "INFO": "ℹ️",
            "SUCCESS": "✅",
            "WARNING": "⚠️",
            "ERROR": "❌",
            "LOADING": "⏳"
        }
        symbol = symbols.get(status, "•")
        timestamp = time.strftime("%H:%M:%S")
        print(f"[{timestamp}] {symbol} {message}")
    
    def is_port_available(self, port):
        """Verifica si un puerto está disponible"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind((self.host, port))
            sock.close()
            return True
        except OSError:
            return False
    
    def find_process_using_port(self, port):
        """Encuentra el proceso que está usando un puerto específico"""
        try:
            for proc in psutil.process_iter(['pid', 'name', 'connections']):
                try:
                    for conn in proc.connections():
                        if conn.laddr.port == port:
                            return proc
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.TimeoutExpired):
                    pass
        except:
            pass
        return None
    
    def kill_process_on_port(self, port):
        """Mata el proceso que está usando el puerto"""
        proc = self.find_process_using_port(port)
        
        if proc:
            self.print_status(
                f"Puerto {port} ocupado por proceso: {proc.name} (PID: {proc.pid})",
                "WARNING"
            )
            
            try:
                self.print_status(f"Terminando proceso {proc.name}...", "LOADING")
                proc.terminate()
                time.sleep(1)
                
                # Si no se cerró, forzar
                if proc.is_running():
                    proc.kill()
                    time.sleep(1)
                
                self.print_status(f"Proceso {proc.name} terminado exitosamente", "SUCCESS")
                return True
            except Exception as e:
                self.print_status(f"Error al terminar proceso: {e}", "ERROR")
                return False
        return False
    
    def find_available_port(self, start_port):
        """Encuentra un puerto disponible a partir de start_port"""
        port = start_port
        while port < start_port + 20:  # Intentar 20 puertos
            if self.is_port_available(port):
                return port
            port += 1
        return None
    
    def prepare_port(self):
        """Prepara el puerto limpiando si es necesario"""
        self.print_status(f"Verificando disponibilidad del puerto {self.port}...", "INFO")
        
        # Si el puerto está disponible, perfecto
        if self.is_port_available(self.port):
            self.print_status(f"Puerto {self.port} está disponible ✓", "SUCCESS")
            return True
        
        # Si no, intentar limpiar
        self.print_status(f"Puerto {self.port} está ocupado, intentando limpiar...", "WARNING")
        
        if self.kill_process_on_port(self.port):
            time.sleep(RETRY_DELAY)
            
            # Verificar si quedó disponible
            if self.is_port_available(self.port):
                self.print_status(f"Puerto {self.port} ahora está disponible ✓", "SUCCESS")
                return True
        
        # Si aún no está disponible, buscar alternativo
        self.print_status(f"Buscando puerto alternativo...", "WARNING")
        alt_port = self.find_available_port(self.port + 1)
        
        if alt_port:
            self.print_status(
                f"Usando puerto alternativo: {alt_port}",
                "WARNING"
            )
            self.port = alt_port
            return True
        
        self.print_status("No se encontró puerto disponible", "ERROR")
        return False
    
    def start_server(self):
        """Inicia el servidor uvicorn"""
        self.print_status(f"Iniciando servidor en {self.host}:{self.port}...", "LOADING")
        
        try:
            # Obtener la ruta del directorio backend
            backend_dir = Path(__file__).parent.absolute()
            
            self.process = subprocess.Popen(
                [
                    sys.executable, "-m", "uvicorn",
                    "main:app",
                    "--host", self.host,
                    "--port", str(self.port),
                    "--reload"
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=str(backend_dir)
            )
            
            # Esperar un poco para verificar que inició correctamente
            time.sleep(2)
            
            if self.process.poll() is None:  # El proceso sigue corriendo
                self.print_status(
                    f"Servidor iniciado exitosamente en http://{self.host}:{self.port}",
                    "SUCCESS"
                )
                print("\n" + "="*70)
                print(f"📍 API URL: http://{self.host}:{self.port}")
                print(f"📚 Swagger UI: http://{self.host}:{self.port}/docs")
                print(f"📖 ReDoc: http://{self.host}:{self.port}/redoc")
                print("="*70)
                print("\n⌨️  Presiona Ctrl+C para detener el servidor\n")
                return True
            else:
                # El proceso terminó, obtener el error
                stdout, stderr = self.process.communicate()
                error_msg = stderr if stderr else stdout
                self.print_status(f"El servidor se cerró inesperadamente: {error_msg}", "ERROR")
                return False
        except Exception as e:
            self.print_status(f"Error al iniciar servidor: {e}", "ERROR")
            return False
    
    def run(self):
        """Ejecuta el servidor con reintentos automáticos"""
        self.print_header()
        self.attempt = 0
        
        while self.attempt < MAX_RETRIES:
            self.attempt += 1
            self.print_status(f"Intento {self.attempt}/{MAX_RETRIES}", "INFO")
            
            if not self.prepare_port():
                self.print_status("No se pudo preparar el puerto", "ERROR")
                if self.attempt < MAX_RETRIES:
                    self.print_status(f"Reintentando en {RETRY_DELAY}s...", "WARNING")
                    time.sleep(RETRY_DELAY)
                continue
            
            if self.start_server():
                # El servidor está corriendo, esperar a que termine
                try:
                    self.process.wait()
                except KeyboardInterrupt:
                    self.print_status("Deteniendo servidor...", "WARNING")
                    self.process.terminate()
                    try:
                        self.process.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        self.process.kill()
                    self.print_status("Servidor detenido", "SUCCESS")
                    break
            else:
                if self.attempt < MAX_RETRIES:
                    self.print_status(f"Reintentando en {RETRY_DELAY}s...", "WARNING")
                    time.sleep(RETRY_DELAY)
        
        if self.attempt >= MAX_RETRIES:
            self.print_status("No se pudo iniciar el servidor después de varios intentos", "ERROR")
            sys.exit(1)


def main():
    """Punto de entrada"""
    try:
        runner = ServerRunner(DEFAULT_HOST, DEFAULT_PORT)
        runner.run()
    except Exception as e:
        print(f"\n❌ Error fatal: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
