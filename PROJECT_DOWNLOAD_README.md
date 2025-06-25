# Home Krypto Token (HKT) Project Download

## What's Included
This zip file contains the complete source code for the HKT platform:

### Frontend (React + TypeScript)
- `client/` - Complete React application with TypeScript
- All 23 pages including dashboard, property showcase, blog system
- Authentication system with wallet integration
- Investment calculator and portfolio management
- Responsive design with dark/light themes

### Backend (Node.js + Express)
- `server/` - Express.js API with TypeScript
- PostgreSQL database integration with Drizzle ORM
- User authentication and session management
- Email system for verification and notifications
- Real-time HKT price monitoring
- DEX swap integration

### Database Schema
- `shared/schema.ts` - Complete database schema with all tables
- User management, investments, quarterly data, blog posts
- Cross-chain wallet support
- Session and security tables

### Configuration Files
- `package.json` - All dependencies and scripts
- `vite.config.ts` - Frontend build configuration
- `drizzle.config.ts` - Database configuration
- `tailwind.config.ts` - Styling configuration

## How to Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env` file with:
   ```
   DATABASE_URL=your_postgresql_url
   ```

3. **Set Up Database**
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open http://localhost:5000 in your browser

## Production Deployment
- Build: `npm run build`
- Start: `npm run start`
- Bind to 0.0.0.0 for Replit deployment

## Features Included
- User registration and authentication
- Email verification system
- Multi-chain wallet integration
- Investment tracking and portfolio management
- Property showcase with Cap Cana pilot
- HKT token price monitoring
- DEX swap functionality
- Blog system with CMS
- Comprehensive admin dashboard
- Mobile-responsive design
- Dark/light theme support

## Live Demo
Visit: https://homekrypto.com (HTTP version)

## Support
Email: support@homekrypto.com

---
Generated: June 25, 2025
Platform: Home Krypto Token (HKT) Investment Platform