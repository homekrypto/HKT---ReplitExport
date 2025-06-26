# HKT Platform - Hostinger VPS Deployment Guide

## Hostinger VPS Setup for HKT Platform

### Step 1: Access Your Hostinger VPS

```bash
# SSH to your Hostinger VPS
ssh root@your-hostinger-ip
```

### Step 2: Initial Server Setup

```bash
# Update system
apt update && apt upgrade -y

# Create non-root user (recommended)
adduser ubuntu
usermod -aG sudo ubuntu
su - ubuntu
```

### Step 3: Deploy HKT Platform

```bash
# Download and run server setup
curl -sSL https://raw.githubusercontent.com/homekrypto/hkt-platform/main/deployment/setup-server.sh | bash

# Deploy application
curl -sSL https://raw.githubusercontent.com/homekrypto/hkt-platform/main/deployment/deploy-app.sh | bash
```

### Step 4: Fix Production Issues (If Needed)

If you encounter the `ERR_INVALID_ARG_TYPE` error:

```bash
cd /home/ubuntu/apps/hkt-platform
curl -sSL https://raw.githubusercontent.com/homekrypto/hkt-platform/main/deployment/fix-production.sh | bash
```

## Hostinger-Specific Configuration

### Domain Configuration

1. **Point your domain to Hostinger VPS:**
   - In Hostinger control panel, update DNS A record
   - Point your domain to your VPS IP address

2. **Setup SSL certificate:**
```bash
./ssl-setup.sh your-domain.com
```

### Hostinger VPS Plans Recommended

- **VPS 1**: 1 vCPU, 4GB RAM (~$4/month) - Good for testing
- **VPS 2**: 2 vCPU, 8GB RAM (~$8/month) - Recommended for production
- **VPS 3**: 4 vCPU, 16GB RAM (~$16/month) - For high traffic

### Performance Optimization for Hostinger

```bash
# Optimize for Hostinger's infrastructure
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'net.core.rmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 134217728' >> /etc/sysctl.conf
sysctl -p
```

## Database Configuration

Your HKT platform uses local PostgreSQL on Hostinger VPS:

```bash
# Database connection (automatically configured)
DATABASE_URL=postgresql://hktuser:hkt2025secure!@localhost:5432/hktdb
```

## Monitoring & Management

```bash
# Check application status
pm2 status

# View logs
pm2 logs hkt-platform

# Monitor system resources
htop

# Check disk usage
df -h
```

## Backup Strategy for Hostinger

```bash
# Setup daily database backups
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * /home/ubuntu/apps/hkt-platform/deployment/backup-database.sh
```

## Security for Hostinger VPS

```bash
# Change default SSH port (optional)
sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
systemctl restart ssh

# Update firewall rules if port changed
ufw delete allow 22
ufw allow 2222
```

## Cost Comparison

| Hostinger VPS | Monthly Cost | Recommended For |
|---------------|--------------|-----------------|
| VPS 1 (4GB)   | ~$4          | Development/Testing |
| VPS 2 (8GB)   | ~$8          | Production (Recommended) |
| VPS 3 (16GB)  | ~$16         | High Traffic |

**Much cheaper than AWS EC2!**

## Hostinger Advantages

- **Lower cost** than AWS EC2
- **Easy management** via Hostinger panel
- **Good performance** in Europe/Asia
- **24/7 support** included
- **Backup options** available

## Application Access

After deployment, your HKT platform will be available at:
- `http://your-hostinger-ip:5000`
- `https://your-domain.com` (after SSL setup)

## Troubleshooting

### Common Hostinger VPS Issues

1. **Port 5000 blocked:**
```bash
sudo ufw allow 5000
iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
```

2. **Memory issues on VPS 1:**
```bash
# Add swap space
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

3. **Database connection issues:**
```bash
sudo systemctl restart postgresql
sudo systemctl enable postgresql
```

Your HKT platform is now optimized for Hostinger VPS hosting with professional deployment practices and cost-effective hosting solution.