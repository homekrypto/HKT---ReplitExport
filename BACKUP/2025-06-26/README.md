# HKT Platform Backup - June 26, 2025

## Complete Backup Contents

This backup contains the full HKT (Home Krypto Token) real estate investment platform as of June 26, 2025.

### Included Components

**Backend** (`/backend/`)
- Complete Express.js server with TypeScript
- Authentication system with JWT tokens
- Database integration with PostgreSQL/Neon
- Investment tracking and calculations
- HKT price monitoring system
- Property booking management
- Admin panel functionality
- Email system (SMTP with Hostinger)
- Cross-chain wallet verification
- AI assistant integration (OpenAI GPT-4)

**Frontend** (`/client/`)
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- Dark/Light theme system
- Responsive design for all devices
- 23 complete pages including:
  - Homepage with investment calculator
  - Property showcase and booking
  - User dashboard and analytics
  - Admin panel
  - Blog system
  - Multi-language support (6 languages)

**Database** (`/database/`)
- Complete PostgreSQL schema
- All table definitions with relationships
- Indexes and constraints
- Default data inserts

**Shared** (`/shared/`)
- TypeScript schema definitions
- Drizzle ORM configuration
- Type safety across frontend/backend

### Installation Instructions

1. **Create new Replit project**
   - Choose "Node.js" template
   - Upload all files to project root

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env` file with:
   ```
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=mail.homekrypto.com
   SMTP_PORT=465
   SMTP_USER=support@homekrypto.com
   SMTP_PASS=your_smtp_password
   OPENAI_API_KEY=your_openai_key
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start application**
   ```bash
   npm run dev
   ```

### Key Features

- **Real Estate Investment Platform**: Tokenized property investments through HKT
- **Multi-chain Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet
- **Investment Tracking**: Real-time portfolio analytics and projections
- **Property Booking System**: Airbnb-like booking for property shares
- **Admin Management**: Property pricing, user management, platform analytics
- **Blog System**: SEO-optimized content management
- **AI Assistant**: Investment guidance and platform help

### Database Status
- Robust fallback system handles connectivity issues
- Offline mode maintains functionality when database unavailable
- HKT price caching ensures real-time data availability

### Platform Statistics (as of backup)
- 23 complete pages
- Full authentication system
- Investment calculator with 15% annual growth model
- Property showcase (Cap Cana pilot + Miami/Madrid pipeline)
- Multi-language support (EN, ES, PT, FR, DE, ZH)

### Technical Stack
- **Backend**: Node.js, Express.js, TypeScript, Drizzle ORM
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Neon serverless
- **Authentication**: JWT tokens, email verification
- **Email**: Hostinger SMTP integration
- **AI**: OpenAI GPT-4 assistant
- **Blockchain**: Web3 wallet integration, cross-chain support

### Support
For technical assistance with this backup, contact support@homekrypto.com

---
**Backup Created**: June 26, 2025, 10:06 PM UTC
**Platform Version**: Production-ready with resolved database connectivity issues
**Total Files**: Backend (25+), Frontend (50+), Database schema, Documentation