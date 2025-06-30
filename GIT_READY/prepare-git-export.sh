#!/bin/bash

# Prepare HKT Platform for Git Deployment
echo "🚀 Preparing HKT Platform for Git deployment..."

# Create export directory
export_dir="hkt-platform-git-ready"
rm -rf $export_dir
mkdir -p $export_dir

# Copy essential files
echo "📁 Copying project files..."

# Core application files
cp -r client/ $export_dir/
cp -r server/ $export_dir/
cp -r shared/ $export_dir/

# Configuration files
cp package.json $export_dir/
cp package-lock.json $export_dir/
cp tsconfig.json $export_dir/
cp tsconfig.server.json $export_dir/ 2>/dev/null || true
cp vite.config.ts $export_dir/
cp tailwind.config.ts $export_dir/
cp postcss.config.js $export_dir/
cp components.json $export_dir/
cp drizzle.config.ts $export_dir/

# Build and deployment files
cp quick-build.sh $export_dir/
cp build-production.sh $export_dir/
cp Dockerfile $export_dir/
cp cloudbuild.yaml $export_dir/
cp deploy.sh $export_dir/ 2>/dev/null || true

# Documentation
cp README.md $export_dir/
cp DEPLOYMENT_SUCCESS.md $export_dir/
cp GIT_DEPLOYMENT_GUIDE.md $export_dir/
cp replit.md $export_dir/

# Environment template
cp .env.template $export_dir/

# Create .gitignore
cat > $export_dir/.gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Database
*.sqlite
*.db

# Temporary files
tmp/
temp/
*.tmp

# Replit specific
.replit
.replitignore
.upm/

# Build artifacts
*.tsbuildinfo

# Coverage reports
coverage/
*.lcov

# Backup files
*.backup
*.bak

# Cookie files
cookies*.txt
EOF

# Create deployment README
cat > $export_dir/DEPLOY_README.md << 'EOF'
# HKT Platform - Git Deployment Ready

## Quick Start

1. **Upload to your Git repository** (GitHub, GitLab, etc.)
2. **Set environment variables** in your deployment platform:
   ```
   DATABASE_URL=your_postgresql_url
   NODE_ENV=production
   SMTP_HOST=mail.homekrypto.com
   SMTP_USER=support@homekrypto.com
   SMTP_PASS=your_email_password
   ```

3. **Deploy using your preferred method**:
   - **Vercel/Netlify**: Connect Git repo, build command: `npm run build`
   - **Railway/Render**: Connect repo, start command: `node dist/index.js`
   - **Docker**: `docker build -t hkt-platform . && docker run -p 5000:5000 hkt-platform`

## Build Commands

```bash
# Quick production build
./quick-build.sh

# Full build with frontend
./build-production.sh

# Development
npm run dev
```

## Features Included

✅ Complete authentication system
✅ Password reset via email
✅ HKT price monitoring
✅ Property booking system
✅ Investment calculator
✅ Admin panel
✅ Multi-language support
✅ Dark/light themes

## Working Test Account
- Email: info@babulashots.pl
- Password: password123

Your platform is ready for production deployment!
EOF

# Make scripts executable
chmod +x $export_dir/*.sh

echo "✅ Git deployment package created!"
echo "📁 Location: $export_dir/"
echo ""
echo "📋 Contents:"
ls -la $export_dir/
echo ""
echo "🎯 Next steps:"
echo "1. Zip the '$export_dir' folder"
echo "2. Upload to your Git repository"
echo "3. Follow the DEPLOY_README.md instructions"
echo ""
echo "📦 To create a zip file:"
echo "   tar -czf hkt-platform.tar.gz $export_dir/"