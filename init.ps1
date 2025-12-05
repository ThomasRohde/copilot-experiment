# Klondike Solitaire - Development Environment Init Script
# This script sets up and starts the development environment

$ErrorActionPreference = "Stop"

Write-Host "🃏 Klondike Solitaire - Development Setup" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}
else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

# Type check
Write-Host "🔍 Running type check..." -ForegroundColor Yellow
npx tsc --noEmit

# Lint check
Write-Host "🧹 Running linter..." -ForegroundColor Yellow
npm run lint

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npm test -- --run

# Start dev server in background
Write-Host ""
Write-Host "🚀 Starting development server in background..." -ForegroundColor Green
Write-Host "   The app will be available at http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

# Start dev server as a background job
$devJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev 2>&1
}

# Wait a moment for the server to start
Start-Sleep -Seconds 3

# Check if server started successfully
$jobState = Get-Job -Id $devJob.Id | Select-Object -ExpandProperty State
if ($jobState -eq "Running") {
    Write-Host "✓ Dev server started (Job ID: $($devJob.Id))" -ForegroundColor Green
    Write-Host "  To view output: Receive-Job -Id $($devJob.Id)" -ForegroundColor Gray
    Write-Host "  To stop: Stop-Job -Id $($devJob.Id); Remove-Job -Id $($devJob.Id)" -ForegroundColor Gray
}
else {
    Write-Host "⚠ Dev server may have failed to start. Check with: Receive-Job -Id $($devJob.Id)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Environment ready! Dev server running in background." -ForegroundColor Green
