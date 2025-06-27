-- HKT Platform Sample Data
-- Insert sample data for testing the platform

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (email, password_hash, email_verified, first_name, last_name, country, referral_code, is_admin) VALUES
('admin@homekrypto.com', '$2b$10$rH8S7wF9mKJ2n6V5cL4xDeXJF8Q3pR7tM9sE1bA6nK5yC8vF2dG4e', true, 'Admin', 'User', 'United States', 'ADMIN001', true),
('info@example.com', '$2b$10$rH8S7wF9mKJ2n6V5cL4xDeXJF8Q3pR7tM9sE1bA6nK5yC8vF2dG4e', true, 'Test', 'User', 'United States', 'TEST001', false),
('investor@example.com', '$2b$10$rH8S7wF9mKJ2n6V5cL4xDeXJF8Q3pR7tM9sE1bA6nK5yC8vF2dG4e', true, 'John', 'Investor', 'Canada', 'INV001', false),
('demo@homekrypto.com', '$2b$10$rH8S7wF9mKJ2n6V5cL4xDeXJF8Q3pR7tM9sE1bA6nK5yC8vF2dG4e', true, 'Demo', 'Account', 'United Kingdom', 'DEMO001', false);

-- Insert supported blockchain chains
INSERT INTO supported_chains (chain_id, name, rpc_url, block_explorer, native_currency_symbol, is_active) VALUES
(1, 'Ethereum Mainnet', 'https://eth-mainnet.g.alchemy.com/v2/demo', 'https://etherscan.io', 'ETH', true),
(56, 'BSC Mainnet', 'https://bsc-dataseed.binance.org', 'https://bscscan.com', 'BNB', true),
(137, 'Polygon Mainnet', 'https://polygon-rpc.com', 'https://polygonscan.com', 'MATIC', true),
(43114, 'Avalanche C-Chain', 'https://api.avax.network/ext/bc/C/rpc', 'https://snowtrace.io', 'AVAX', true),
(250, 'Fantom Opera', 'https://rpc.ftm.tools', 'https://ftmscan.com', 'FTM', true);

-- Insert HKT token statistics
INSERT INTO hkt_stats (current_price, price_change_24h, market_cap, volume_24h, total_supply) VALUES
(0.10, 5.25, 1000000.00, 50000.00, 10000000.00);

-- Insert sample properties for booking system
INSERT INTO properties (name, slug, description, location, price_per_night, cleaning_fee, max_guests, bedrooms, bathrooms, amenities, images, total_shares, share_price_hkt) VALUES
('Cap Cana Luxury Villa', 'cap-cana-villa', 'Stunning oceanfront villa in Cap Cana, Dominican Republic. Features private pool, direct beach access, and luxury amenities.', 'Cap Cana, Dominican Republic', 450.00, 75.00, 8, 4, 3, 
ARRAY['Private Pool', 'Ocean View', 'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Beach Access', 'BBQ Area', 'Security'], 
ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80'], 52, 3750.00),

('Miami Beach Penthouse', 'miami-beach-penthouse', 'Luxury penthouse in South Beach with panoramic ocean views and rooftop terrace.', 'Miami Beach, Florida', 650.00, 100.00, 6, 3, 2,
ARRAY['Ocean View', 'Rooftop Terrace', 'WiFi', 'Air Conditioning', 'Kitchen', 'Gym Access', 'Concierge'], 
ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80'], 52, 5200.00),

('Madrid City Center Apartment', 'madrid-city-apartment', 'Modern apartment in the heart of Madrid, walking distance to major attractions.', 'Madrid, Spain', 350.00, 60.00, 4, 2, 1,
ARRAY['City Center', 'WiFi', 'Air Conditioning', 'Kitchen', 'Balcony', 'Metro Access'], 
ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80'], 52, 2800.00);

-- Insert sample investments
INSERT INTO investments (user_id, monthly_amount, wallet_address, total_invested, hkt_tokens, current_value, profit, roi, is_active) VALUES
(2, 500.00, '0x742d35Cc6635C0532925a3b8D33B4B8b4C07AE26', 6000.00, 60000.00, 6300.00, 300.00, 5.00, true),
(3, 1000.00, '0x8ba1f109551bD432803012645Hac136c', 12000.00, 120000.00, 12600.00, 600.00, 5.00, true);

-- Insert sample quarterly data
INSERT INTO quarterly_data (user_id, investment_id, quarter, year, hkt_price, tokens_accumulated, total_value, performance_percent) VALUES
(2, 1, 'Q1', 2025, 0.08, 15000.00, 1200.00, 20.00),
(2, 1, 'Q2', 2025, 0.09, 30000.00, 2700.00, 35.00),
(2, 1, 'Q3', 2025, 0.095, 45000.00, 4275.00, 42.50),
(2, 1, 'Q4', 2025, 0.10, 60000.00, 6000.00, 50.00),
(3, 2, 'Q1', 2025, 0.08, 30000.00, 2400.00, 20.00),
(3, 2, 'Q2', 2025, 0.09, 60000.00, 5400.00, 35.00),
(3, 2, 'Q3', 2025, 0.095, 90000.00, 8550.00, 42.50),
(3, 2, 'Q4', 2025, 0.10, 120000.00, 12000.00, 50.00);

-- Insert sample property shares
INSERT INTO property_shares (user_id, property_id, shares_owned, purchase_price_hkt) VALUES
(2, 1, 2, 7500.00),
(3, 1, 1, 3750.00),
(3, 2, 3, 15600.00);

-- Insert sample bookings
INSERT INTO bookings (user_id, property_id, check_in, check_out, guests, nights, currency, total_amount, cleaning_fee, is_free_week, status, booking_reference) VALUES
(2, 1, '2025-07-15', '2025-07-22', 4, 7, 'USD', 75.00, 75.00, true, 'confirmed', 'HKT2025001'),
(3, 1, '2025-08-01', '2025-08-14', 6, 13, 'USD', 5925.00, 75.00, false, 'confirmed', 'HKT2025002');

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, author, status, tags, meta_description, published_at) VALUES
('Welcome to Home Krypto Token', 'welcome-to-hkt', 'Home Krypto Token (HKT) represents a revolutionary approach to real estate investment through blockchain technology...', 'Discover how HKT is transforming real estate investment with blockchain technology.', 'HKT Team', 'published', ARRAY['blockchain', 'real-estate', 'investment'], 'Learn about HKT''s innovative approach to real estate investment through blockchain technology.', CURRENT_TIMESTAMP),

('How to Get Started with HKT Investment', 'getting-started-hkt', 'Getting started with HKT investment is simple. Follow these steps to begin your real estate investment journey...', 'A comprehensive guide to starting your HKT investment journey.', 'Investment Team', 'published', ARRAY['guide', 'investment', 'tutorial'], 'Step-by-step guide to starting your HKT real estate investment journey.', CURRENT_TIMESTAMP),

('Understanding Property Tokenization', 'property-tokenization-explained', 'Property tokenization is the process of converting real estate assets into digital tokens on the blockchain...', 'Learn how property tokenization works and its benefits for investors.', 'Tech Team', 'published', ARRAY['tokenization', 'blockchain', 'technology'], 'Understand how property tokenization works and its benefits for modern investors.', CURRENT_TIMESTAMP);

-- Insert sample newsletter subscribers
INSERT INTO subscribers (email, subscription_type, is_active) VALUES
('subscriber1@example.com', 'newsletter', true),
('subscriber2@example.com', 'waitlist', true),
('subscriber3@example.com', 'newsletter', true),
('investor.updates@example.com', 'newsletter', true);

-- Insert sample wallet addresses for users
INSERT INTO user_wallets (user_id, wallet_address, chain_id, is_primary, is_verified, verified_at) VALUES
(2, '0x742d35Cc6635C0532925a3b8D33B4B8b4C07AE26', 1, true, true, CURRENT_TIMESTAMP),
(2, '0x8ba1f109551bD432803012645Hac136c123456', 56, false, true, CURRENT_TIMESTAMP),
(3, '0x8ba1f109551bD432803012645Hac136c', 1, true, true, CURRENT_TIMESTAMP),
(3, '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', 137, false, false, NULL);