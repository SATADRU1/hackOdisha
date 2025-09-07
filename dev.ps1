# Development Environment Management Script for HackOdisha

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "help"
)

$DevComposeFile = "docker-compose.dev.yml"
$ProdComposeFile = "docker-compose.yml"

function Show-Help {
    Write-Host "🚀 HackOdisha Development Environment Manager" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev.ps1 [action]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor Green
    Write-Host "  start       - Start development environment with live reload"
    Write-Host "  stop        - Stop development environment"
    Write-Host "  restart     - Restart development environment"
    Write-Host "  logs        - Show logs from all services"
    Write-Host "  studio-logs - Show studio service logs"
    Write-Host "  frontend-logs - Show frontend service logs"
    Write-Host "  build       - Build development images"
    Write-Host "  clean       - Clean up development containers and volumes"
    Write-Host "  status      - Show status of all services"
    Write-Host "  help        - Show this help message"
    Write-Host ""
    Write-Host "Development Features:" -ForegroundColor Magenta
    Write-Host "  ✅ Live reload on file changes"
    Write-Host "  ✅ Hot module replacement"
    Write-Host "  ✅ Auto-restart services"
    Write-Host "  ✅ Volume mounts for source code"
    Write-Host "  ✅ All ports exposed for direct access"
    Write-Host ""
}

function Start-DevEnvironment {
    Write-Host "🚀 Starting development environment..." -ForegroundColor Green
    Write-Host "This will start all services with live reload enabled!" -ForegroundColor Yellow
    Write-Host ""
    
    # Stop production containers if running
    Write-Host "Stopping any production containers..." -ForegroundColor Yellow
    docker-compose -f $ProdComposeFile down 2>$null
    
    # Start development environment
    docker-compose -f $DevComposeFile up -d --build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Development environment started successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Access your application:" -ForegroundColor Cyan
        Write-Host "  Frontend: http://localhost:3000 (with hot reload)"
        Write-Host "  Studio API: http://localhost:3001"
        Write-Host "  Nginx Proxy: http://localhost"
        Write-Host "  Database: localhost:5432"
        Write-Host ""
        Write-Host "🔍 Monitor logs with: .\dev.ps1 logs" -ForegroundColor Yellow
        Write-Host "📝 Any file changes will trigger automatic reloads!" -ForegroundColor Magenta
    } else {
        Write-Host "❌ Failed to start development environment" -ForegroundColor Red
    }
}

function Stop-DevEnvironment {
    Write-Host "🛑 Stopping development environment..." -ForegroundColor Yellow
    docker-compose -f $DevComposeFile down
    Write-Host "✅ Development environment stopped" -ForegroundColor Green
}

function Restart-DevEnvironment {
    Write-Host "🔄 Restarting development environment..." -ForegroundColor Yellow
    Stop-DevEnvironment
    Start-DevEnvironment
}

function Show-Logs {
    Write-Host "📋 Showing logs from all development services..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to exit log viewing" -ForegroundColor Yellow
    docker-compose -f $DevComposeFile logs -f
}

function Show-StudioLogs {
    Write-Host "📋 Showing Studio service logs..." -ForegroundColor Cyan
    docker-compose -f $DevComposeFile logs -f studio
}

function Show-FrontendLogs {
    Write-Host "📋 Showing Frontend service logs..." -ForegroundColor Cyan
    docker-compose -f $DevComposeFile logs -f frontend
}

function Build-DevImages {
    Write-Host "🔨 Building development images..." -ForegroundColor Yellow
    docker-compose -f $DevComposeFile build --no-cache
    Write-Host "✅ Development images built successfully" -ForegroundColor Green
}

function Clean-DevEnvironment {
    Write-Host "🧹 Cleaning up development environment..." -ForegroundColor Yellow
    Write-Host "This will remove containers, networks, and volumes!" -ForegroundColor Red
    $confirmation = Read-Host "Are you sure? (y/N)"
    
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        docker-compose -f $DevComposeFile down -v --remove-orphans
        Write-Host "✅ Development environment cleaned" -ForegroundColor Green
    } else {
        Write-Host "❌ Cleanup cancelled" -ForegroundColor Yellow
    }
}

function Show-Status {
    Write-Host "📊 Development Environment Status:" -ForegroundColor Cyan
    docker-compose -f $DevComposeFile ps
}

# Main script logic
switch ($Action.ToLower()) {
    "start" { Start-DevEnvironment }
    "stop" { Stop-DevEnvironment }
    "restart" { Restart-DevEnvironment }
    "logs" { Show-Logs }
    "studio-logs" { Show-StudioLogs }
    "frontend-logs" { Show-FrontendLogs }
    "build" { Build-DevImages }
    "clean" { Clean-DevEnvironment }
    "status" { Show-Status }
    "help" { Show-Help }
    default { Show-Help }
}
