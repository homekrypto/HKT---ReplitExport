#!/bin/bash

# HKT Platform - SSL Certificate Setup
# Run this script to enable HTTPS with Let's Encrypt

set -e

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: ./ssl-setup.sh your-domain.com"
    echo "Example: ./ssl-setup.sh homekrypto.com"
    exit 1
fi

DOMAIN=$1

echo "Setting up SSL certificate for $DOMAIN..."

# Install Certbot
echo "Installing Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Update Nginx configuration with domain
echo "Updating Nginx configuration..."
sudo sed -i "s/server_name _;/server_name $DOMAIN www.$DOMAIN;/" /etc/nginx/sites-available/hkt-platform
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
echo "Obtaining SSL certificate..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email support@$DOMAIN

# Setup auto-renewal
echo "Setting up automatic renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "SSL setup completed successfully!"
echo ""
echo "Your HKT Platform is now secure at:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo ""
echo "Certificate will auto-renew every 60 days"