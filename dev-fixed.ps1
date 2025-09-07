param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "help"
)

$DevComposeFile = "docker-compose.dev.yml"
$ProdComposeFile = "docker-compose.yml"

function Show-Help {
    Write-Host "HackOdisha Development Environment Manager" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev-fixed.ps1 [action]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor Green
    Write-Host "  start       - Start development environment with live reload"
    Write-Host "  stop        - Stop development environment"
    Write-Host "  logs        - Show logs from all services"
    Write-Host "  status      - Show status of all services"
    Write-Host "  help        - Show this help message"
    Write-Host ""
    Write-Host "Development Features:" -ForegroundColor Magenta
    Write-Host "  - Live reload on file changes"
    Write-Host "  - Hot module replacement"
    Write-Host "  - Auto-restart services"
    Write-Host "  - Volume mounts for source code"
    Write-Host ""
}

function Start-DevEnvironment {
    Write-Host "Starting development environment..." -ForegroundColor Green
    Write-Host "This will start all services with live reload enabled!" -ForegroundColor Yellow
    
    docker-compose -f $DevComposeFile up -d --build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Development environment started successfully!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Studio API: http://localhost:3001" -ForegroundColor Cyan
        Write-Host "Nginx Proxy: http://localhost" -ForegroundColor Cyan
    } else {
        Write-Host "Failed to start development environment" -ForegroundColor Red
    }
}

function Stop-DevEnvironment {
    Write-Host "Stopping development environment..." -ForegroundColor Yellow
    docker-compose -f $DevComposeFile down
    Write-Host "Development environment stopped" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "Showing logs from all development services..." -ForegroundColor Cyan
    docker-compose -f $DevComposeFile logs -f
}

function Show-Status {
    Write-Host "Development Environment Status:" -ForegroundColor Cyan
    docker-compose -f $DevComposeFile ps
}

switch ($Action.ToLower()) {
    "start" { Start-DevEnvironment }
    "stop" { Stop-DevEnvironment }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "help" { Show-Help }
    default { Show-Help }
}
