#!/bin/bash

# Netlify Build Script
echo "Starting Netlify build..."

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps --no-audit --no-fund

# Build the application
echo "Building application..."
npm run build

echo "Build completed!"
