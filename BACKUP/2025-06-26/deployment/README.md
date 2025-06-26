# HKT Platform - Simple EC2 Deployment

Deploy your complete HKT platform (frontend + backend + database) to Amazon EC2 VPS in minutes.

## Quick Setup

### 1. Launch EC2 Instance
**Recommended Configuration:**
- Instance Type: `t3.medium` (2 vCPU, 4GB RAM)
- Operating System: Ubuntu 22.04 LTS
- Storage: 20GB SSD (gp3)
- Security Group: Allow ports 22, 80, 443, 5000

### 2. Connect to Server
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Run Setup Script
```bash
# Download and run server setup
curl -sSL https://raw.githubusercontent.com/homekrypto/hkt-platform/main/deployment/setup-server.sh | bash
```

### 4. Deploy Application
```bash
# Download and run deployment script
curl -sSL https://raw.githubusercontent.com/homekrypto/hkt-platform/main/deployment/deploy-app.sh | bash
```

**That's it!** Your HKT platform is now live at `http://your-ec2-ip`

## Optional: Custom Domain + SSL

```bash
# Setup SSL certificate for your domain
curl -sSL https://raw.githubusercontent.com/homekrypto/hkt-platform/main/deployment/ssl-setup.sh | bash -s your-domain.com
```

## What Gets Installed

- **Node.js 20** - Runtime environment
- **PostgreSQL** - Database with HKT schema
- **PM2** - Process manager (auto-restart, logging)
- **Nginx** - Reverse proxy with security headers
- **UFW Firewall** - Basic security configuration

## Architecture

```
Internet → Nginx (Port 80/443) → HKT App (Port 5000) → PostgreSQL (Port 5432)
```

## Management Commands

```bash
# Check application status
pm2 status

# View real-time logs
pm2 logs hkt-platform

# Restart application
pm2 restart hkt-platform

# Update to latest version
cd /home/ubuntu/apps/hkt-platform
git pull && npm install && pm2 restart hkt-platform
```

## Monthly Cost Estimate
- **EC2 t3.medium**: ~$30
- **20GB EBS Storage**: ~$2  
- **Data Transfer**: ~$5
- **Total**: ~$37/month

## Features Included
- Automated deployment and updates
- Process management with auto-restart
- Nginx reverse proxy with compression
- SSL certificate support (Let's Encrypt)
- Database backups and restore scripts
- Security headers and firewall
- Log management and monitoring

## Database Migration

Your existing data can be migrated using the CSV export:

```bash
# On your EC2 server
psql postgresql://hktuser:hkt2025secure!@localhost:5432/hktdb

# Import your CSV files
\copy users FROM 'users.csv' WITH CSV HEADER;
\copy investments FROM 'investments.csv' WITH CSV HEADER;
# ... etc for other tables
```

## Support

This deployment provides a production-ready environment with professional practices:
- Process monitoring and auto-restart
- Security hardening
- Performance optimization
- Backup capabilities
- Update mechanisms

Your complete HKT investment platform will be accessible worldwide with enterprise-grade reliability.