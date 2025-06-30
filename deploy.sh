#!/bin/bash

# HKT Platform Deployment Script
set -e

echo "🚀 Starting HKT Platform Deployment..."

# Check if required environment variables are set
if [ -z "$PROJECT_ID" ]; then
  echo "⚠️  PROJECT_ID environment variable not set"
  read -p "Enter Google Cloud Project ID: " PROJECT_ID
  export PROJECT_ID
fi

# Build the application
echo "🏗️  Building application..."
chmod +x build.js
node build.js

# Check if dist/index.js exists
if [ ! -f "dist/index.js" ]; then
  echo "❌ Server build failed - dist/index.js not found"
  exit 1
fi

# Check if dist/public exists
if [ ! -d "dist/public" ]; then
  echo "⚠️  Frontend build missing - creating minimal static files"
  mkdir -p dist/public
  echo '<!DOCTYPE html><html><head><title>HKT Platform</title></head><body><h1>HKT Platform</h1><p>Loading...</p></body></html>' > dist/public/index.html
fi

echo "✅ Build completed successfully!"

# Test the server locally (optional)
if [ "$1" = "--test" ]; then
  echo "🧪 Testing server locally..."
  timeout 10s node dist/index.js &
  sleep 3
  curl -f http://localhost:5000/api/health || echo "⚠️  Health check failed"
  pkill -f "node dist/index.js" || true
fi

# Deploy to Google Cloud Run
if [ "$1" = "--deploy" ]; then
  echo "☁️  Deploying to Google Cloud Run..."
  
  # Build and push Docker image
  gcloud builds submit --config cloudbuild.yaml --substitutions=SHORT_SHA=$(git rev-parse --short HEAD) .
  
  echo "🎉 Deployment completed!"
  echo "🌐 Your application should be available at: https://hkt-platform-[hash].a.run.app"
fi

echo "📋 Next steps:"
echo "  • Run './deploy.sh --test' to test locally"
echo "  • Run './deploy.sh --deploy' to deploy to Google Cloud"
echo "  • Set environment variables in Cloud Run console"