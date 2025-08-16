#!/bin/bash

# Netlify Build Script
echo "Starting Netlify build..."

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm ci --legacy-peer-deps --no-audit --no-fund

# Install missing dependencies explicitly
echo "Installing missing dependencies..."
npm install sourcemap-codec@^1.4.8 --legacy-peer-deps

# Build the application
echo "Building application..."
npm run build

echo "Build completed!"
