#!/bin/bash

# HKT Platform - Application Deployment Script
# Run this after setup-server.sh completes

set -e

echo "Deploying HKT Platform..."

# Navigate to apps directory
cd /home/ubuntu/apps

# Clone repository (if not already cloned)
if [ ! -d "hkt-platform" ]; then
    echo "Cloning repository..."
    git clone https://github.com/homekrypto/hkt-platform.git
fi

cd hkt-platform

# Install dependencies
echo "Installing dependencies..."
npm install

# Create production environment file
echo "Creating production environment..."
cat > .env << EOF
NODE_ENV=production
DATABASE_URL=postgresql://hktuser:hkt2025secure!@localhost:5432/hktdb
PORT=5000
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
FRONTEND_URL=http://localhost:5000
EOF

# Skip build for now - use development server in production
echo "Skipping build - using development server..."

# Setup database schema
echo "Setting up database schema..."
npm run db:push

# Create PM2 ecosystem file
echo "Creating PM2 configuration..."
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

# Create logs directory
mkdir -p /home/ubuntu/logs

# Start application with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 startup ubuntu -u ubuntu --hp /home/ubuntu
pm2 save

# Configure Nginx
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/hkt-platform << EOF
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:5000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/hkt-platform /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

echo "Deployment completed successfully!"
echo ""
echo "Your HKT Platform is now live at:"
echo "   http://$SERVER_IP"
echo ""
echo "Management commands:"
echo "   pm2 status           - Check application status"
echo "   pm2 logs hkt-platform - View application logs"
echo "   pm2 restart hkt-platform - Restart application"
echo ""
echo "Application files located at:"
echo "   /home/ubuntu/apps/hkt-platform"
echo ""
echo "Logs located at:"
echo "   /home/ubuntu/logs/"