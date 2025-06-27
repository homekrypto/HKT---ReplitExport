# GitHub Setup Guide for HKT Platform

## Quick GitHub Deployment Steps

### 1. Create GitHub Repository
```bash
# On GitHub.com, create new repository named "hkt-platform"
# Don't initialize with README (we have our own)
```

### 2. Extract and Initialize
```bash
# Extract the HKT-Platform-GitHub-Ready.tar.gz file
tar -xzf HKT-Platform-GitHub-Ready.tar.gz
cd hkt-platform

# Initialize Git repository
git init
git add .
git commit -m "Initial commit: HKT Platform v1.0"
```

### 3. Connect to GitHub
```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/hkt-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Configure Environment
```bash
# Copy environment template
cp .env.template .env

# Edit .env with your actual credentials:
# - DATABASE_URL (PostgreSQL connection)
# - JWT_SECRET (generate secure key)
# - SMTP credentials for email
# - API keys for external services
```

### 5. Install and Run
```bash
# Install dependencies
npm install

# Setup database schema
npm run db:push

# Start development server
npm run dev
```

## GitHub Repository Structure

```
hkt-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route pages
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── auth-routes.ts     # Authentication
│   ├── booking-routes.ts  # Property bookings
│   ├── storage.ts         # Database layer
│   └── index.ts           # Main server
├── shared/                # Shared types
│   └── schema.ts          # Database schema
├── .env.template          # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── README.md             # Project documentation
└── drizzle.config.ts     # Database config
```

## Environment Variables Required

### Essential Configuration
```bash
DATABASE_URL=postgresql://user:pass@host:port/database
JWT_SECRET=your-secure-jwt-secret
SMTP_HOST=smtp.hostinger.com
SMTP_USER=support@homekrypto.com
SMTP_PASS=your-email-password
```

### Optional Services
```bash
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_test_your-stripe-key
COINGECKO_API_KEY=your-coingecko-key
```

## Features Included

### Core Platform (23 Pages)
- Investment dashboard and portfolio tracking
- Property marketplace with booking system
- Admin panel for complete management
- Blog system with SEO optimization
- Multi-chain wallet integration
- AI assistance with OpenAI

### Authentication System
- Secure user registration and login
- Email verification with SMTP
- Password reset functionality
- JWT token management

### Database Features
- PostgreSQL with 15+ optimized tables
- Drizzle ORM with type safety
- Automated migrations
- Sample data for testing

## Deployment Options

### Development
```bash
npm run dev          # Starts on port 5000
```

### Production
```bash
npm run build        # Build for production
npm start           # Start production server
```

### Database Management
```bash
npm run db:push     # Push schema changes
npm run db:studio   # Open database studio
```

## GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` for automated deployment:

```yaml
name: Deploy HKT Platform
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npm test
```

## Support

- Documentation in `/documentation` folder
- Test accounts: admin@homekrypto.com / password123
- Email: support@homekrypto.com

The platform is production-ready with all security features, optimized performance, and comprehensive functionality.