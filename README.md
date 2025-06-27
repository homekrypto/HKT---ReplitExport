# HKT Platform - Blockchain Real Estate Investment Platform

A cutting-edge full-stack application that democratizes real estate investment through blockchain technology and HKT tokens.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js + PostgreSQL
- **Database**: Drizzle ORM with optimized schema
- **Authentication**: JWT with secure session management
- **Web3**: Multi-chain wallet integration (5 blockchains)

## 🚀 Features

### Investment Platform
- Real-time HKT token price tracking from multiple DEX sources
- Portfolio dashboard with performance analytics
- Investment calculator with compound growth projections
- Quarterly investment reports and ROI tracking

### Property System
- Premium property marketplace with detailed listings
- Fractional ownership through HKT token purchases
- Airbnb-style booking system with 7-day minimum stays
- Owner benefits including free accommodation weeks

### User Management
- Secure registration with email verification
- Multi-factor authentication support
- Cross-chain wallet verification system
- Comprehensive user profiles and preferences

### Administrative Tools
- Complete admin panel for platform management
- Property management with pricing controls
- User account administration and analytics
- Real-time booking oversight and reporting

### Additional Features
- AI-powered investment assistance (OpenAI integration)
- Professional blog system with SEO optimization
- Multi-language support (6 languages)
- Dark/light theme with crypto-inspired design

## 🛠️ Installation

1. **Clone Repository**
```bash
git clone [repository-url]
cd hkt-platform
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.template .env
# Configure your environment variables
```

4. **Database Setup**
```bash
npm run db:push
```

5. **Start Development Server**
```bash
npm run dev
```

## 📊 Database Schema

The platform uses PostgreSQL with 15+ optimized tables:

- **users**: User accounts and authentication
- **investments**: Investment tracking and portfolio data
- **properties**: Real estate listings and details
- **bookings**: Reservation system with payment tracking
- **wallets**: Multi-chain wallet connections
- **blog_posts**: Content management system
- **hkt_stats**: Real-time token price data

## 🔐 Security Features

- Bcrypt password hashing
- JWT token authentication
- CSRF and XSS protection
- Rate limiting on all endpoints
- Secure session management
- Input validation with Zod schemas

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - End session

### Investment
- `GET /api/investments` - Portfolio data
- `POST /api/investments` - Create investment
- `GET /api/investments/projections` - Calculate returns

### Properties & Bookings
- `GET /api/bookings/properties/:id` - Property details
- `POST /api/bookings/calculate-price` - Booking quotes
- `POST /api/bookings/create-stripe-booking` - USD payments
- `POST /api/bookings/create-hkt-booking` - HKT payments

## 🎨 Theme System

The platform features a sophisticated theme system:

- **Default Theme**: Investment-focused with gold accents
- **Dark Theme**: High contrast for extended use
- **Responsive Design**: Mobile-first approach
- **Custom Graphics**: Unique geometric elements

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Migration
```bash
npm run db:push
```

## 🧪 Test Accounts

Pre-configured accounts for testing:

- **Admin**: admin@homekrypto.com / password123
- **Investor**: info@example.com / password123
- **User**: test@example.com / password123

## 📈 Performance

- Optimized database queries with proper indexing
- Cached price data for real-time performance
- Lazy loading components for faster page loads
- Efficient state management with TanStack Query

## 🔗 External Integrations

- **Price Feeds**: CoinGecko, DexScreener, Moralis
- **Email**: SMTP with verification system
- **Payments**: Stripe integration ready
- **AI**: OpenAI GPT-4 for user assistance
- **Blockchain**: Ethereum, BSC, Polygon, Avalanche, Fantom

## 📝 License

Private proprietary software - All rights reserved

## 🤝 Support

For technical support or questions:
- Email: support@homekrypto.com
- Documentation: Available in `/documentation` folder

---

**Built with modern web technologies for the future of real estate investment.**