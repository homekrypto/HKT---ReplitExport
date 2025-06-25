# HKT (Home Krypto Token) - Real Estate Investment Platform

A comprehensive blockchain-based real estate investment platform that allows users to invest in premium properties through cryptocurrency tokens, providing fractional ownership of high-value real estate assets.

## 🌟 Features

- **Tokenized Real Estate Investment**: Invest in properties through HKT tokens
- **Multi-Chain Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet integration
- **Investment Dashboard**: Real-time portfolio tracking and analytics
- **Property Marketplace**: Browse and invest in properties worldwide
- **AI Assistant**: Intelligent help system for investment guidance
- **Blog System**: Educational content and market insights
- **Multi-language Support**: 6 languages with dark/light themes

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** + shadcn/ui components
- **Wouter** for routing
- **TanStack Query** for state management
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Drizzle ORM
- **JWT** authentication
- **Real-time price monitoring**
- **Email verification system**

### AWS Lambda Migration Ready
- Complete serverless architecture
- DynamoDB single-table design
- Lambda functions for all endpoints
- CloudFront CDN integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- SMTP credentials for email

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/hkt-platform.git
cd hkt-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your database URL and email settings
```

4. **Database setup**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/           # Utilities and helpers
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── auth.ts           # Authentication logic
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── price-feed.ts     # HKT price monitoring
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema
├── aws-lambda/           # AWS serverless migration
│   ├── dynamodb-schema.ts
│   ├── auth-lambda.ts
│   └── deployment-guide.md
└── package.json
```

## 🌐 Deployment

### Current Platform (Replit)
The platform is live at: `https://homekrypto.com`

### AWS Lambda Migration
Complete serverless infrastructure ready for deployment:

```bash
cd aws-lambda
npm install -g serverless
serverless deploy --stage prod
```

See `aws-lambda/deployment-guide.md` for detailed instructions.

## 💰 Investment Features

### Investment Calculator
- Monthly investment planning
- ROI projections with 15% annual growth
- Property share calculations
- Quarterly performance tracking

### Property Portfolio
- **Cap Cana, Dominican Republic**: Luxury beachfront properties
- **Miami, USA**: Coming soon
- **Madrid, Spain**: Coming soon

### HKT Token
- **Contract**: `0x0de50324B6960B15A5ceD3D076aE314ac174Da2e`
- **Network**: Ethereum
- **Current Price**: $0.10 USD
- **Total Supply**: 1,000,000,000 HKT

## 🔐 Security Features

- JWT-based authentication
- Email verification system
- Rate limiting on API endpoints
- Secure password hashing
- CSRF protection
- Helmet.js security headers

## 📱 Pages & Functionality

1. **Homepage**: Investment overview and calculator
2. **Properties**: Global portfolio and pilot showcase
3. **Dashboard**: Personal investment tracking
4. **How It Works**: Step-by-step investment guide
5. **Our Mission**: Company vision and team
6. **Blog**: Educational content and insights
7. **Contact**: Support and communication
8. **Legal Pages**: Terms, Privacy, Whitepaper

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema changes
npm run check        # TypeScript type checking
```

### Database Schema

Key tables:
- `users`: User accounts and authentication
- `investments`: Investment records and tracking
- `quarterly_data`: Performance history
- `hkt_stats`: Real-time token statistics
- `blog_posts`: Content management
- `subscribers`: Newsletter and waitlist

## 🌍 Multi-language Support

Supported languages:
- English
- Spanish
- Portuguese
- French
- German
- Chinese

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Investments
- `GET /api/investments` - Get user investments
- `POST /api/investments` - Create investment
- `PUT /api/investments/:id` - Update investment

### HKT Token
- `GET /api/hkt/price` - Current HKT price
- `GET /api/hkt/stats` - Token statistics

### Blog
- `GET /api/blog` - Get blog posts
- `GET /api/blog/:slug` - Get specific post

## 🤖 AI Assistant

Integrated OpenAI GPT-4 assistant for:
- Investment guidance
- Platform navigation
- Real estate insights
- Technical support

## 📊 Analytics & Monitoring

- Real-time price monitoring
- Investment performance tracking
- User engagement metrics
- Error logging and monitoring

## 🔄 Migration to AWS

The project includes a complete AWS Lambda + DynamoDB migration:

- **Cost Reduction**: 30-60% lower operational costs
- **Global Scaling**: Auto-scaling infrastructure
- **Performance**: Single-digit millisecond latency
- **Reliability**: 99.99% uptime SLA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

- **Email**: support@homekrypto.com
- **Website**: https://homekrypto.com
- **Documentation**: See individual component READMEs

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Additional blockchain networks
- [ ] Advanced analytics dashboard
- [ ] Automated property management
- [ ] Secondary market trading
- [ ] Multi-currency support

---

**HKT Platform** - Making Global Real Estate Investment Accessible to Everyone