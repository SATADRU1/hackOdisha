# Clean Repository Script
# This script removes common generated files and directories
# Run this before committing to ensure a clean repository

Write-Host "🧹 Cleaning repository..." -ForegroundColor Green

# Remove node_modules directories
$nodeModules = Get-ChildItem -Path . -Name "node_modules" -Recurse -Directory -ErrorAction SilentlyContinue
if ($nodeModules) {
    Write-Host "Removing node_modules directories..." -ForegroundColor Yellow
    $nodeModules | ForEach-Object { 
        $path = Join-Path $PWD $_
        if (Test-Path $path) {
            Remove-Item -Recurse -Force $path
            Write-Host "  Removed: $path" -ForegroundColor Cyan
        }
    }
}

# Remove build directories
$buildDirs = @(".next", "build", "dist", "out", ".cache")
foreach ($dir in $buildDirs) {
    if (Test-Path $dir) {
        Write-Host "Removing $dir..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force $dir
        Write-Host "  Removed: $dir" -ForegroundColor Cyan
    }
}

# Remove Go binaries
$goBinaries = Get-ChildItem -Path . -Name "*.exe" -Recurse -File -ErrorAction SilentlyContinue
if ($goBinaries) {
    Write-Host "Removing Go binaries..." -ForegroundColor Yellow
    $goBinaries | ForEach-Object { 
        $path = Join-Path $PWD $_
        Remove-Item -Force $path
        Write-Host "  Removed: $path" -ForegroundColor Cyan
    }
}

# Remove log files
$logFiles = Get-ChildItem -Path . -Name "*.log" -Recurse -File -ErrorAction SilentlyContinue
if ($logFiles) {
    Write-Host "Removing log files..." -ForegroundColor Yellow
    $logFiles | ForEach-Object { 
        $path = Join-Path $PWD $_
        Remove-Item -Force $path
        Write-Host "  Removed: $path" -ForegroundColor Cyan
    }
}

# Remove package-lock.json files (they will be regenerated)
$packageLocks = Get-ChildItem -Path . -Name "package-lock.json" -Recurse -File -ErrorAction SilentlyContinue
if ($packageLocks) {
    Write-Host "Removing package-lock.json files..." -ForegroundColor Yellow
    $packageLocks | ForEach-Object { 
        $path = Join-Path $PWD $_
        Remove-Item -Force $path
        Write-Host "  Removed: $path" -ForegroundColor Cyan
    }
}

Write-Host "✅ Repository cleaned successfully!" -ForegroundColor Green
Write-Host "💡 Run 'npm install' and 'go mod tidy' to regenerate dependencies" -ForegroundColor Blue
