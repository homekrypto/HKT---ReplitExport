# Home Krypto Token (HKT) - Real Estate Investment Platform

## Overview

This is a full-stack web application for HKT (Home Krypto Token), a blockchain-based real estate investment platform. The application allows users to invest in premium real estate through cryptocurrency tokens, providing fractional ownership of high-value property assets. Users can start investing with monthly contributions and track their portfolio growth through a comprehensive dashboard.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds
- **Web3 Integration**: Custom Web3 service for MetaMask wallet connections

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: In-memory storage with interface for database implementation
- **Development**: Hot module replacement with Vite middleware integration

## Key Components

### Database Schema
- **users**: User accounts with wallet addresses
- **investments**: Investment records with monthly amounts and returns
- **quarterlyData**: Historical investment performance data
- **hktStats**: Real-time HKT token statistics and market data

### Web3 Integration
- MetaMask wallet connection and management
- Blockchain transaction handling (mock implementation)
- Real-time wallet state management with event listeners
- Uniswap integration for token trading

### Investment Calculation Engine
- Monthly investment simulation with compound growth
- 15% annual token appreciation modeling
- ROI calculation and projection over 36-month periods
- Quarterly breakdown of token accumulation

### UI Components
- Responsive design with mobile-first approach
- Interactive investment calculator
- Portfolio dashboard with real-time updates
- Property showcase and statistics sections

## Data Flow

### Investment Flow
1. User connects MetaMask wallet through Web3Service
2. Investment parameters are calculated using backend API
3. Investment data is stored in database with quarterly projections
4. Dashboard displays real-time portfolio performance

### Authentication Flow
1. Wallet-based authentication (no traditional login)
2. User identification through wallet addresses
3. Session management for connected wallet state

### Data Persistence
- Investment records stored with user association
- Historical performance data tracked quarterly
- HKT token statistics updated periodically
- Portfolio calculations cached for performance

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React Router (Wouter), TanStack Query
- **UI Framework**: Radix UI primitives, Tailwind CSS, Lucide icons
- **Database**: Drizzle ORM, @neondatabase/serverless, PostgreSQL
- **Validation**: Zod for schema validation and type safety
- **Date Handling**: date-fns for time calculations

### Development Tools
- **Build**: Vite with React plugin and runtime error overlay
- **TypeScript**: Full type safety across client and server
- **ESLint/Prettier**: Code formatting and linting (implicit)

### Blockchain Integration
- **Web3**: Custom implementation for MetaMask integration
- **Ethereum**: Mock smart contract interactions
- **Token Standards**: ERC-20 compatible token simulation

## Deployment Strategy

### Production Build
- Client-side React build with Vite bundling
- Server-side Express application bundled with esbuild
- Static assets served from Express with Vite integration in development

### Environment Configuration
- Database connection via DATABASE_URL environment variable
- PostgreSQL 16 with Drizzle migrations
- Node.js 20 runtime environment

### Replit Integration
- Configured for Replit deployment with autoscale target
- PostgreSQL module pre-configured
- Development workflow with hot reloading

### Database Migrations
- Drizzle Kit for schema management
- Migration files generated in `/migrations` directory
- Push-based deployment with `npm run db:push`

## Changelog
- June 21, 2025. Initial setup
- June 21, 2025. Added PostgreSQL database integration - migrated from in-memory storage to persistent database
- June 21, 2025. Added comprehensive multilingual support (6 languages) with dark/light theme functionality
- June 21, 2025. Created "Our Mission" page with complete content sections, team information, and call-to-action
- June 21, 2025. Implemented complete user authentication system with registration, login, logout, password reset, profile management, and optional Web3 MetaMask integration
- June 21, 2025. Added Uniswap widget integration for direct HKT token purchases with professional trading interface
- June 21, 2025. Fixed all database schema issues and completed user registration system with email verification
- June 21, 2025. Email system fully operational - SMTP working correctly with Hostinger, professional verification emails being sent
- June 21, 2025. Registration flow complete - username field fully removed, clean form with email/password + optional fields, email verification working
- June 21, 2025. Homepage optimized - leadership team removed from Our Mission page, duplicate investment calculator removed from hero section, dark theme set as default with pure black background and high contrast text
- June 21, 2025. Fixed Investment Calculator theme compatibility - improved visibility on both light and dark themes with proper contrast colors
- June 21, 2025. Email verification system debugged - fixed SQL syntax errors and database query structure
- June 21, 2025. Enhanced How It Works page - added comprehensive step-by-step investment process, pilot benefits section, and call-to-action with detailed property sharing model explanation
- June 21, 2025. Implemented AI-powered help system - integrated OpenAI GPT-4o for intelligent user assistance with investment questions, platform guidance, and real estate insights
- June 21, 2025. Added comprehensive legal and informational pages - Terms & Conditions, Privacy Policy, Whitepaper, FAQ, and Work With Us pages with professional content
- June 21, 2025. Updated HKT token contract address to real Ethereum address (0x0de50324B6960B15A5ceD3D076aE314ac174Da2e), fixed footer year to 2025, improved subscription functionality, and added multi-wallet connection dropdown with MetaMask, WalletConnect, Coinbase Wallet, and Trust Wallet options
- June 21, 2025. Fixed all page routing to be publicly accessible, updated footer with comprehensive working links to all 9 pages, enhanced navigation with FAQ/Contact/Whitepaper links, and ensured wallet dropdown integration in both desktop and mobile navigation
- June 21, 2025. Added smooth scroll-to-top functionality for all page navigation to improve user experience when clicking between pages
- June 21, 2025. Removed logo elements and reverted to clean text-based HKT branding across navigation, footer, and homepage
- June 21, 2025. Moved HKT logo above the main navigation menu for better visual hierarchy in both desktop and mobile versions
- June 21, 2025. Redesigned mobile navigation with logo and hamburger on top line, wallet/auth buttons on separate line below for better usability
- June 21, 2025. Fixed contact form functionality - now actually sends emails to support@homekrypto.com instead of showing fake confirmation
- June 21, 2025. Created Pilot Property Showcase page with 4 Dominican Republic properties, added footer link, and updated hero section text to focus on short-term rentals in tourist destinations
- June 21, 2025. Fixed pilot property showcase data - corrected property value to $195,000 USD and share pricing to $3,750 USD (37,500 HKT @ $0.10/token) for 1-week ownership, added real social media links
- June 21, 2025. Created Properties page at /properties/ with global portfolio overview, regional breakdown, investment process, and prominent link to pilot property showcase

## User Preferences

Preferred communication style: Simple, everyday language.