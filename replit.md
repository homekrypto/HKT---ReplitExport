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

## User Preferences

Preferred communication style: Simple, everyday language.