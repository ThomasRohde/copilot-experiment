#!/bin/bash

# Klondike Solitaire - Development Environment Init Script
# This script sets up and starts the development environment

set -e

echo "🃏 Klondike Solitaire - Development Setup"
echo "========================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

# Type check
echo "🔍 Running type check..."
npx tsc --noEmit

# Lint check
echo "🧹 Running linter..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm test -- --run

# Start dev server in background
echo ""
echo "🚀 Starting development server in background..."
echo "   The app will be available at http://localhost:5173"
echo ""

# Start dev server in background, redirect output to file
npm run dev > .dev-server.log 2>&1 &
DEV_PID=$!

# Wait a moment for the server to start
sleep 3

# Check if server started successfully
if kill -0 $DEV_PID 2>/dev/null; then
    echo "✓ Dev server started (PID: $DEV_PID)"
    echo "  To view output: tail -f .dev-server.log"
    echo "  To stop: kill $DEV_PID"
    echo $DEV_PID > .dev-server.pid
else
    echo "⚠ Dev server may have failed to start. Check .dev-server.log"
fi

echo ""
echo "✅ Environment ready! Dev server running in background."
