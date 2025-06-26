#!/bin/bash

# HKT Platform - Fix Production Deployment
# Run this if you're getting build/path errors

set -e

echo "Fixing production deployment..."

cd /home/ubuntu/apps/hkt-platform

# Stop application
echo "Stopping application..."
pm2 stop hkt-platform

# Update PM2 configuration to use tsx directly
echo "Updating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'hkt-platform',
    script: 'node_modules/.bin/tsx',
    args: 'server/index.ts',
    cwd: '/home/ubuntu/apps/hkt-platform',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/home/ubuntu/logs/hkt-error.log',
    out_file: '/home/ubuntu/logs/hkt-out.log',
    log_file: '/home/ubuntu/logs/hkt-combined.log'
  }]
};
EOF

# Remove problematic dist directory
echo "Cleaning build artifacts..."
rm -rf dist/

# Restart with new configuration
echo "Starting application with new configuration..."
pm2 start ecosystem.config.js

# Check status
pm2 status

echo "Production fix completed!"
echo ""
echo "Application status:"
pm2 show hkt-platform