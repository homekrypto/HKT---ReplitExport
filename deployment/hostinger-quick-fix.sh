#!/bin/bash

# HKT Platform - Hostinger VPS Quick Fix
# Fixes common Hostinger VPS deployment issues

set -e

echo "Applying Hostinger VPS fixes..."

# Ensure we're in the right directory
cd /home/ubuntu/apps/hkt-platform 2>/dev/null || cd /root/vps\ hostinger 2>/dev/null || cd ~

# Stop any running processes
pkill -f "node" 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Create proper ecosystem config for Hostinger
echo "Creating Hostinger-optimized PM2 config..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'hkt-platform',
    script: 'npx',
    args: 'tsx server/index.ts',
    cwd: process.cwd(),
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Set proper environment
export NODE_ENV=production
export PORT=5000

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Remove problematic dist directory
rm -rf dist/ 2>/dev/null || true

# Start with PM2
echo "Starting HKT Platform..."
pm2 start ecosystem.config.js

# Setup PM2 startup
pm2 startup
pm2 save

# Check if port 5000 is accessible
echo "Configuring firewall..."
ufw allow 5000 2>/dev/null || iptables -A INPUT -p tcp --dport 5000 -j ACCEPT 2>/dev/null || true

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo ""
echo "✅ Hostinger VPS deployment fixed!"
echo ""
echo "🌐 Your HKT Platform should be accessible at:"
echo "   http://$SERVER_IP:5000"
echo ""
echo "📊 Management commands:"
echo "   pm2 status"
echo "   pm2 logs hkt-platform"
echo "   pm2 restart hkt-platform"
echo ""
echo "🔧 If still having issues, check:"
echo "   - Port 5000 is open in Hostinger firewall"
echo "   - Database connection is working"
echo "   - All dependencies are installed"