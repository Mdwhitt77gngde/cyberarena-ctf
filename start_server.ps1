# start_server.ps1
# Smart Server Runner para Windows PowerShell
# Maneja automáticamente puertos ocupados

param(
    [int]$Port = 8000,
    [string]$Host = "127.0.0.1",
    [int]$MaxRetries = 3
)

# Configuración de colores
$Colors = @{
    Success = 'Green'
    Warning = 'Yellow'
    Error = 'Red'
    Info = 'Cyan'
    Loading = 'Magenta'
}

function Write-Status {
    param(
        [string]$Message,
        [ValidateSet('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'LOADING')]
        [string]$Status = 'INFO',
        [switch]$NoNewline
    )
    
    $symbols = @{
        'INFO' = 'ℹ️'
        'SUCCESS' = '✅'
        'WARNING' = '⚠️'
        'ERROR' = '❌'
        'LOADING' = '⏳'
    }
    
    $symbol = $symbols[$Status]
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = $Colors[$Status]
    
    Write-Host "[$timestamp] $symbol $Message" -ForegroundColor $color -NoNewline:$NoNewline
}

function Print-Header {
    Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
    Write-Host "🚀 CyberArena CTF Platform - Smart Server Runner" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor Cyan
}

function Test-PortAvailable {
    param([int]$Port)
    
    try {
        $socket = New-Object System.Net.Sockets.TcpListener($Host, $Port)
        $socket.Start()
        $socket.Stop()
        return $true
    }
    catch {
        return $false
    }
}

function Get-ProcessOnPort {
    param([int]$Port)
    
    try {
        $netstat = netstat -ano | Select-String ":$Port"
        
        if ($netstat) {
            $parts = $netstat -split '\s+' | Where-Object { $_ }
            $pid = $parts[-1]
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            return $process
        }
    }
    catch {}
    
    return $null
}

function Kill-ProcessOnPort {
    param([int]$Port)
    
    $process = Get-ProcessOnPort -Port $Port
    
    if ($process) {
        Write-Status "Puerto $Port ocupado por: $($process.Name) (PID: $($process.Id))" -Status WARNING
        
        try {
            Write-Status "Terminando proceso $($process.Name)..." -Status LOADING
            Stop-Process -Id $process.Id -Force -ErrorAction Stop
            Start-Sleep -Seconds 2
            Write-Status "Proceso terminado exitosamente" -Status SUCCESS
            return $true
        }
        catch {
            Write-Status "Error al terminar proceso: $_" -Status ERROR
            return $false
        }
    }
    
    return $false
}

function Find-AvailablePort {
    param([int]$StartPort)
    
    $testPort = $StartPort
    $maxPort = $StartPort + 20
    
    while ($testPort -lt $maxPort) {
        if (Test-PortAvailable -Port $testPort) {
            return $testPort
        }
        $testPort++
    }
    
    return $null
}

function Prepare-Port {
    Write-Status "Verificando disponibilidad del puerto $Port..." -Status INFO
    
    if (Test-PortAvailable -Port $Port) {
        Write-Status "Puerto $Port está disponible ✓" -Status SUCCESS
        return $true
    }
    
    Write-Status "Puerto $Port está ocupado, intentando limpiar..." -Status WARNING
    
    if (Kill-ProcessOnPort -Port $Port) {
        Start-Sleep -Seconds 2
        
        if (Test-PortAvailable -Port $Port) {
            Write-Status "Puerto $Port ahora está disponible ✓" -Status SUCCESS
            return $true
        }
    }
    
    Write-Status "Buscando puerto alternativo..." -Status WARNING
    $altPort = Find-AvailablePort -StartPort ($Port + 1)
    
    if ($altPort) {
        Write-Status "Usando puerto alternativo: $altPort" -Status WARNING
        $global:Port = $altPort
        return $true
    }
    
    Write-Status "No se encontró puerto disponible" -Status ERROR
    return $false
}

function Start-APIServer {
    Write-Status "Iniciando servidor en ${Host}:${Port}..." -Status LOADING
    
    try {
        # Cambiar al directorio backend
        Push-Location (Split-Path -Parent $PSCommandPath)
        
        # Iniciar uvicorn
        $process = Start-Process -FilePath python `
            -ArgumentList "-m", "uvicorn", "main:app", "--host", $Host, "--port", $Port, "--reload" `
            -PassThru `
            -NoNewWindow
        
        Start-Sleep -Seconds 3
        
        if ($process -and -not $process.HasExited) {
            Write-Status "Servidor iniciado exitosamente en http://${Host}:${Port}" -Status SUCCESS
            
            Write-Host "`n" + ("=" * 70)
            Write-Host "📍 API URL: http://${Host}:${Port}" -ForegroundColor Green
            Write-Host "📚 Swagger UI: http://${Host}:${Port}/docs" -ForegroundColor Green
            Write-Host "📖 ReDoc: http://${Host}:${Port}/redoc" -ForegroundColor Green
            Write-Host ("=" * 70)
            Write-Host "`n⌨️  Presiona Ctrl+C para detener el servidor`n"
            
            # Esperar a que el proceso termine
            $process.WaitForExit()
            
            return $true
        }
        else {
            Write-Status "El servidor se cerró inesperadamente" -Status ERROR
            return $false
        }
    }
    catch {
        Write-Status "Error al iniciar servidor: $_" -Status ERROR
        return $false
    }
    finally {
        Pop-Location
    }
}

function Main {
    Print-Header
    
    $attempt = 0
    
    while ($attempt -lt $MaxRetries) {
        $attempt++
        Write-Status "Intento $attempt/$MaxRetries" -Status INFO
        
        if (-not (Prepare-Port)) {
            Write-Status "No se pudo preparar el puerto" -Status ERROR
            if ($attempt -lt $MaxRetries) {
                Write-Status "Reintentando en 2s..." -Status WARNING
                Start-Sleep -Seconds 2
            }
            continue
        }
        
        if (Start-APIServer) {
            break
        }
        else {
            if ($attempt -lt $MaxRetries) {
                Write-Status "Reintentando en 2s..." -Status WARNING
                Start-Sleep -Seconds 2
            }
        }
    }
    
    if ($attempt -ge $MaxRetries) {
        Write-Status "No se pudo iniciar el servidor después de varios intentos" -Status ERROR
        exit 1
    }
}

# Ejecutar
Main
