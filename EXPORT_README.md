# HKT Platform - Replit Export Package

## Overview
This is a complete export of the HKT (Home Krypto Token) platform - a blockchain-based real estate investment platform. The project is ready for immediate deployment in any Replit account.

## What's Included
- **Complete source code** - Full-stack React/Node.js application
- **Database schema** - PostgreSQL with Drizzle ORM
- **Production deployment** - AWS Lambda + DynamoDB migration ready
- **All dependencies** - Pre-configured package.json
- **Documentation** - Complete setup and deployment guides

## Quick Setup in New Replit Account

### 1. Import to Replit
1. Create new Replit project
2. Choose "Import from GitHub" or "Upload files"
3. Upload this entire project folder
4. Replit will automatically detect the configuration

### 2. Database Setup
```bash
# Replit will auto-provision PostgreSQL
# Database URL will be automatically set in environment
npm run db:push
```

### 3. Start Development
```bash
npm run dev
```

Your HKT platform will be running at the provided Replit URL.

## Environment Variables Required
- `DATABASE_URL` - Automatically provided by Replit PostgreSQL
- `SENDGRID_API_KEY` - For email functionality (optional)

## Key Features
- ✅ User authentication with email verification
- ✅ Web3 wallet integration (MetaMask, WalletConnect, etc.)
- ✅ Real-time HKT token price monitoring
- ✅ Investment calculator and portfolio tracking
- ✅ Property showcase with tokenized ownership
- ✅ Blog system with CMS integration
- ✅ Multi-language support (6 languages)
- ✅ Dark/light theme system
- ✅ Comprehensive dashboard
- ✅ Cross-chain wallet verification
- ✅ DEX swap integration
- ✅ AI-powered help system

## Project Structure
```
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared schemas and types
├── aws-lambda/             # Serverless migration files
├── deployment/             # VPS deployment scripts
├── database-export/        # Database backup files
└── attached_assets/        # Project assets and images
```

## Deployment Options

### 1. Replit Deployment (Recommended)
- One-click deployment via Replit
- Automatic SSL and domain provisioning
- Zero configuration required

### 2. AWS Lambda Serverless
```bash
# Use included Lambda functions
cd aws-lambda/
# Deploy with Terraform or AWS CLI
```

### 3. VPS Hosting
```bash
# Use included deployment scripts
./deployment/deploy-app.sh
```

## Database Schema
The platform uses a comprehensive schema with:
- User management and authentication
- Investment tracking and portfolio management
- Property data and tokenization
- Blog content management
- Multi-chain wallet support
- Real-time price monitoring

## Security Features
- Password hashing with bcrypt
- JWT session management
- Rate limiting and CSRF protection
- Input validation with Zod
- SQL injection prevention
- XSS protection

## API Documentation
Complete REST API with endpoints for:
- Authentication (`/api/auth/`)
- Investment management (`/api/investments/`)
- Wallet operations (`/api/wallets/`)
- Blog management (`/api/blog/`)
- Price monitoring (`/api/prices/`)

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Web3**: Ethers.js, MetaMask integration
- **Build**: Vite with hot module replacement
- **Deployment**: Replit, AWS Lambda, or VPS

## Support
- Complete documentation in `replit.md`
- Deployment guides in `deployment/` folder
- Database schema in `shared/schema.ts`
- API documentation in individual route files

## Migration History
This project has been continuously developed and includes:
- Full authentication system with email verification
- Real-time price monitoring from multiple APIs
- Comprehensive investment tracking
- Multi-chain wallet integration
- Production-ready deployment configurations
- AWS serverless migration architecture

## Getting Started
1. Import to new Replit account
2. Run `npm run dev`
3. Platform will be live at your Replit URL
4. Optionally configure custom domain
5. Deploy to production when ready

Your HKT platform is ready for immediate use with all features fully functional.