param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "help"
)

function Show-Help {
    Write-Host "HackOdisha Local Development Environment" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev-local.ps1 [action]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor Green
    Write-Host "  start-db    - Start only database services in Docker"
    Write-Host "  start-studio - Start studio service locally"
    Write-Host "  start-frontend - Start frontend locally"
    Write-Host "  start-all   - Start all services (DB in Docker, others local)"
    Write-Host "  stop-db     - Stop database services"
    Write-Host "  help        - Show this help message"
    Write-Host ""
    Write-Host "Development Features:" -ForegroundColor Magenta
    Write-Host "  - Instant reload on file changes"
    Write-Host "  - Hot module replacement"
    Write-Host "  - Local debugging support"
    Write-Host "  - Fastest development experience"
    Write-Host ""
    Write-Host "Requirements:" -ForegroundColor Yellow
    Write-Host "  - Node.js 18+ installed locally"
    Write-Host "  - npm packages installed in both frontend and studio"
    Write-Host ""
}

function Start-DatabaseServices {
    Write-Host "Starting database services in Docker..." -ForegroundColor Green
    
    # Create a minimal docker-compose for just databases
    $dbCompose = @"
services:
  postgres:
    image: postgres:15-alpine
    container_name: hackodisha-postgres-local
    environment:
      POSTGRES_DB: hackodisha
      POSTGRES_USER: hackodisha
      POSTGRES_PASSWORD: hackodisha123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data_local:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: hackodisha-redis-local
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data_local:/data

volumes:
  postgres_data_local:
  redis_data_local:
"@
    
    $dbCompose | Out-File -FilePath "docker-compose.db-only.yml" -Encoding UTF8
    
    try {
        docker compose -f docker-compose.db-only.yml up -d
        Write-Host "Database services started successfully!" -ForegroundColor Green
        Write-Host "PostgreSQL: localhost:5432" -ForegroundColor Cyan
        Write-Host "Redis: localhost:6379" -ForegroundColor Cyan
    } catch {
        Write-Host "Failed to start database services: $_" -ForegroundColor Red
    }
}

function Start-StudioService {
    Write-Host "Starting Studio service locally..." -ForegroundColor Green
    Write-Host "Navigate to services/studio directory and run npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands to run in a new terminal:" -ForegroundColor Cyan
    Write-Host "cd services/studio" -ForegroundColor White
    Write-Host "npm install" -ForegroundColor White
    Write-Host "npx prisma db push" -ForegroundColor White
    Write-Host "npm run dev" -ForegroundColor White
    Write-Host ""
}

function Start-FrontendService {
    Write-Host "Starting Frontend service locally..." -ForegroundColor Green
    Write-Host "Run npm run dev in the project root" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands to run in a new terminal:" -ForegroundColor Cyan
    Write-Host "npm install" -ForegroundColor White
    Write-Host "npm run dev" -ForegroundColor White
    Write-Host ""
}

function Start-AllServices {
    Write-Host "Starting complete local development environment..." -ForegroundColor Green
    Start-DatabaseServices
    Start-StudioService
    Start-FrontendService
    
    Write-Host ""
    Write-Host "Development Environment Setup:" -ForegroundColor Cyan
    Write-Host "1. Database services are running in Docker" -ForegroundColor Green
    Write-Host "2. Open 2 new terminals and run the studio and frontend commands shown above" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Access your application:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  Studio API: http://localhost:3001" -ForegroundColor White
    Write-Host ""
}

function Stop-DatabaseServices {
    Write-Host "Stopping database services..." -ForegroundColor Yellow
    try {
        if (Test-Path "docker-compose.db-only.yml") {
            docker compose -f docker-compose.db-only.yml down
            Write-Host "Database services stopped" -ForegroundColor Green
        } else {
            Write-Host "No database services found" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Failed to stop database services: $_" -ForegroundColor Red
    }
}

switch ($Action.ToLower()) {
    "start-db" { Start-DatabaseServices }
    "start-studio" { Start-StudioService }
    "start-frontend" { Start-FrontendService }
    "start-all" { Start-AllServices }
    "stop-db" { Stop-DatabaseServices }
    "help" { Show-Help }
    default { Show-Help }
}
