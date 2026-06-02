# 🚀 Opciones de Inicio del Servidor

## 3 Formas de Iniciar (Elige la que prefieras)

---

## ✅ OPCIÓN 1: Python (Recomendado)

**Mejor para:** Usuarios que prefieren Python, funciona en cualquier SO

```bash
# Desde cualquier carpeta:
python backend/run_server.py

# Con puerto personalizado:
python backend/run_server.py --port 8001
```

**Ventajas:**

- ✅ Funciona en Windows, Mac, Linux
- ✅ Más funcionalidades
- ✅ Manejo robusto de errores
- ✅ Mensajes detallados

**Desventajas:**

- Requiere Python en PATH

---

## ⚡ OPCIÓN 2: PowerShell (Windows)

**Mejor para:** Usuarios de Windows que conocen PowerShell

```powershell
# Desde la raíz del proyecto:
.\start_server.ps1

# Con puerto personalizado:
.\start_server.ps1 -Port 8001
```

**Ventajas:**

- ✅ Nativo de Windows
- ✅ Colorido y bonito
- ✅ Integración con Windows

**Desventajas:**

- ❌ Solo Windows
- Puede requerir permisos

**Si sale error de permisos:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🎯 OPCIÓN 3: Batch (Windows - Más Simple)

**Mejor para:** Usuarios sin experiencia técnica, solo Windows

```bash
# Desde la raíz del proyecto:
start_server.bat

# O simplemente hacer doble click en el archivo
```

**Ventajas:**

- ✅ Súper simple
- ✅ No requiere PowerShell
- ✅ Hacer doble click y listo

**Desventajas:**

- ❌ Solo Windows
- Menos funcionalidades

---

## 🏆 Comparación Rápida

| Característica     | Python | PowerShell | Batch |
| ------------------ | ------ | ---------- | ----- |
| Windows            | ✅     | ✅         | ✅    |
| Mac                | ✅     | ✅         | ❌    |
| Linux              | ✅     | ✅         | ❌    |
| Fácil de usar      | ✅     | ✅         | ✅    |
| Funcionalidades    | ✅✅✅ | ✅✅       | ✅    |
| Mensajes coloridos | ✅     | ✅         | ✅    |
| Doble click        | ❌     | ❌         | ✅    |

---

## 📍 Mi Recomendación

### Uso Normal:

```bash
python backend/run_server.py
```

### Uso Ocasional (Windows):

```bash
# Hacer doble click en start_server.bat
```

### Integración CI/CD:

```bash
python backend/run_server.py
```

---

## 🔄 ¿Qué Hacen Todos?

Cualquiera que elijas:

1. ✅ **Detecta** si el puerto está ocupado
2. ✅ **Mata** el proceso que lo usa
3. ✅ **Busca** puerto alternativo si es necesario
4. ✅ **Reinicia** el servidor
5. ✅ **Todo automático**, sin intervención manual

---

## 🆘 Troubleshooting

### Error: "Permission denied"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "Port still in use after 3 attempts"

```bash
# Matar todos los Python
taskkill /F /IM python.exe

# Intentar de nuevo
python backend/run_server.py --port 8001
```

### Error: "psutil not found"

```bash
pip install psutil
```

---

## ✨ Resumen

Ya no tienes que hacer esto:

```
❌ Buscar el puerto
❌ Encontrar el proceso
❌ Matar el proceso
❌ Esperar
❌ Reintentar manualmente
```

Ahora solo haces esto:

```
✅ python backend/run_server.py
```

**¡Eso es todo!** 🎉

---

**Documentación completa:** Ver [SMART_SERVER_GUIDE.md](./SMART_SERVER_GUIDE.md)
