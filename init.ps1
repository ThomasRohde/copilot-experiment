# Klondike Solitaire - Development Environment Init Script
# This script sets up and starts the development environment

$ErrorActionPreference = "Stop"

Write-Host "🃏 Klondike Solitaire - Development Setup" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
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

# Start dev server
Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "   The app will be available at http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
npm run dev
