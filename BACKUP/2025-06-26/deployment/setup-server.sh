#!/bin/bash

# HKT Platform - EC2 Server Setup Script
# Run this script on your fresh Ubuntu 22.04 EC2 instance

set -e

echo "Setting up HKT Platform on EC2..."

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
echo "Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# Install additional tools
echo "Installing additional tools..."
sudo apt install -y git curl wget htop unzip

# Configure firewall
echo "Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5000
sudo ufw --force enable

# Setup PostgreSQL database
echo "Setting up PostgreSQL database..."
sudo -u postgres psql << EOF
CREATE USER hktuser WITH PASSWORD 'hkt2025secure!';
CREATE DATABASE hktdb OWNER hktuser;
GRANT ALL PRIVILEGES ON DATABASE hktdb TO hktuser;
\q
EOF

# Create app directory
echo "Creating application directory..."
mkdir -p /home/ubuntu/apps
cd /home/ubuntu/apps

# Display completion message
echo "Server setup completed!"
echo ""
echo "Next steps:"
echo "1. Clone your repository: git clone https://github.com/homekrypto/hkt-platform.git"
echo "2. Run the deployment script: ./deploy-app.sh"
echo ""
echo "Database connection string:"
echo "DATABASE_URL=postgresql://hktuser:hkt2025secure!@localhost:5432/hktdb"