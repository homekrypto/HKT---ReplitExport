-- HKT Platform Database Schema Export
-- Generated on June 26, 2025

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password_hash VARCHAR(255),
    primary_wallet_address VARCHAR(42) UNIQUE,
    is_email_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(32),
    profile_image_url VARCHAR(500),
    referral_code VARCHAR(20) UNIQUE,
    referred_by INTEGER,
    login_attempts INTEGER DEFAULT 0,
    lockout_until TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table for user authentication
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP DEFAULT NOW(),
    user_agent TEXT,
    ip_address VARCHAR(45)
);

-- Investment tracking
CREATE TABLE investments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    wallet_address VARCHAR(42) NOT NULL,
    monthly_amount DECIMAL(12, 2) NOT NULL,
    total_invested DECIMAL(12, 2) NOT NULL DEFAULT 0,
    hkt_tokens DECIMAL(18, 8) NOT NULL DEFAULT 0,
    current_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
    profit DECIMAL(12, 2) NOT NULL DEFAULT 0,
    roi DECIMAL(5, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Quarterly performance data
CREATE TABLE quarterly_data (
    id SERIAL PRIMARY KEY,
    investment_id INTEGER NOT NULL REFERENCES investments(id),
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL CHECK (quarter >= 1 AND quarter <= 4),
    hkt_price DECIMAL(18, 8) NOT NULL,
    hkt_purchased DECIMAL(18, 8) NOT NULL,
    total_hkt DECIMAL(18, 8) NOT NULL,
    portfolio_value DECIMAL(12, 2) NOT NULL,
    amount_invested DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- HKT token statistics
CREATE TABLE hkt_stats (
    id SERIAL PRIMARY KEY,
    current_price DECIMAL(18, 8) NOT NULL,
    price_change_24h DECIMAL(5, 2) NOT NULL,
    total_supply DECIMAL(18, 8) NOT NULL,
    market_cap DECIMAL(15, 2) NOT NULL,
    volume_24h DECIMAL(15, 2) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    author VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    tags TEXT[],
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Property management
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    total_value DECIMAL(12, 2) NOT NULL,
    share_price DECIMAL(12, 2) NOT NULL,
    total_shares INTEGER NOT NULL,
    available_shares INTEGER NOT NULL,
    images TEXT[],
    amenities TEXT[],
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Property bookings
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    property_id INTEGER NOT NULL REFERENCES properties(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INTEGER NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    booking_status VARCHAR(20) DEFAULT 'confirmed',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cross-chain wallet support
CREATE TABLE supported_chains (
    id SERIAL PRIMARY KEY,
    chain_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    rpc_url VARCHAR(500) NOT NULL,
    block_explorer_url VARCHAR(500),
    native_currency JSONB NOT NULL,
    is_testnet BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id),
    chain_id INTEGER NOT NULL REFERENCES supported_chains(id),
    wallet_address VARCHAR(42) NOT NULL,
    wallet_type VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT false,
    verification_signature TEXT,
    verification_message TEXT,
    verification_timestamp TIMESTAMP,
    last_used TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, chain_id, wallet_address)
);

CREATE TABLE wallet_verification_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id),
    wallet_address VARCHAR(42) NOT NULL,
    chain_id INTEGER NOT NULL REFERENCES supported_chains(id),
    challenge TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'admin',
    permissions TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default supported chains
INSERT INTO supported_chains (chain_id, name, rpc_url, native_currency, is_testnet) VALUES
(1, 'Ethereum Mainnet', 'https://mainnet.infura.io/v3/', '{"name":"Ether","symbol":"ETH","decimals":18}', false),
(56, 'Binance Smart Chain', 'https://bsc-dataseed.binance.org/', '{"name":"BNB","symbol":"BNB","decimals":18}', false),
(137, 'Polygon', 'https://polygon-rpc.com/', '{"name":"MATIC","symbol":"MATIC","decimals":18}', false),
(43114, 'Avalanche', 'https://api.avax.network/ext/bc/C/rpc', '{"name":"AVAX","symbol":"AVAX","decimals":18}', false),
(250, 'Fantom', 'https://rpc.ftm.tools/', '{"name":"FTM","symbol":"FTM","decimals":18}', false);

-- Insert default HKT stats
INSERT INTO hkt_stats (current_price, price_change_24h, total_supply, market_cap, volume_24h) VALUES
(0.10, 0.00, 1000000000, 100000000, 1000000);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wallet ON users(primary_wallet_address);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_investments_wallet ON investments(wallet_address);
CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_quarterly_investment ON quarterly_data(investment_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_user_wallets_user ON user_wallets(user_id);
CREATE INDEX idx_user_wallets_address ON user_wallets(wallet_address);