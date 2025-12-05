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

# Start dev server
echo ""
echo "🚀 Starting development server..."
echo "   The app will be available at http://localhost:5173"
echo ""
npm run dev
