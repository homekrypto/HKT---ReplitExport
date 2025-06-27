# Database Migration Guide

## PostgreSQL Setup on Replit

### Step 1: Enable PostgreSQL
1. Open your Replit project
2. Click on "Database" in the left sidebar
3. Select "PostgreSQL" 
4. Click "Create Database"
5. Copy the connection string provided

### Step 2: Configure Environment
1. Copy `.env.template` to `.env`
2. Update `DATABASE_URL` with your PostgreSQL connection string
3. Save the file

### Step 3: Run Schema Migration
```bash
# Option 1: Use provided SQL files
psql $DATABASE_URL -f database-setup/schema.sql
psql $DATABASE_URL -f database-setup/sample-data.sql

# Option 2: Use Drizzle ORM (recommended)
npm run db:push
```

### Step 4: Verify Installation
```bash
# Check if tables exist
psql $DATABASE_URL -c "\dt"

# Verify sample data
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

## Sample User Accounts

### Admin Account
- Email: admin@homekrypto.com
- Password: password123
- Role: Administrator
- Access: Full admin panel

### Test User
- Email: info@example.com  
- Password: password123
- Role: Regular user
- Features: Can test all user functionality

### Investor Account
- Email: investor@example.com
- Password: password123
- Role: User with investments
- Features: Has sample investment data

## Database Features Included

### Authentication System
- User registration and login
- Email verification
- Password reset functionality
- Session management

### Investment Management
- Investment tracking
- Quarterly performance data
- Portfolio calculations
- ROI tracking

### Property System
- Property listings
- Booking system
- Share ownership tracking
- Revenue calculations

### Content Management
- Blog post system
- Newsletter subscriptions
- User-generated content

### Multi-chain Support
- Wallet verification
- Cross-chain compatibility
- Token management

## Troubleshooting

### Connection Issues
If you cannot connect to the database:
1. Verify DATABASE_URL is correct
2. Check Replit database status
3. Ensure PostgreSQL addon is enabled

### Migration Errors
If schema creation fails:
1. Drop existing tables: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
2. Re-run schema.sql
3. Check for permission issues

### Sample Data Issues
If sample data doesn't load:
1. Ensure schema was created first
2. Check for foreign key constraint errors
3. Verify user table exists before other inserts

## Performance Optimization

### Indexes
All necessary indexes are included in schema.sql:
- Email lookups
- Token searches
- User associations
- Booking queries

### Recommended Settings
For production use, consider:
- Connection pooling
- Query optimization
- Regular backups
- Performance monitoring

## Security Notes

### Passwords
Sample passwords are hashed using bcrypt with salt rounds of 10.
Production passwords should use stronger hashing.

### Tokens
JWT secrets should be randomly generated 32+ character strings.
Session secrets should be different from JWT secrets.

### Data Protection
- Never store plain text passwords
- Use prepared statements for queries
- Validate all user inputs
- Implement rate limiting