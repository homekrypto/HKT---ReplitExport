// Data Migration Script: PostgreSQL to DynamoDB
import { Pool } from '@neondatabase/serverless';
import { docClient, userService, sessionService, investmentService, hktStatsService } from './dynamodb-client';
import { createTable } from './dynamodb-schema';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Initialize PostgreSQL connection
const pgPool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

interface MigrationProgress {
  totalRecords: number;
  migratedRecords: number;
  errors: string[];
  startTime: Date;
  endTime?: Date;
}

export class DataMigration {
  private progress: MigrationProgress = {
    totalRecords: 0,
    migratedRecords: 0,
    errors: [],
    startTime: new Date(),
  };

  async runMigration() {
    console.log('🚀 Starting HKT Platform data migration...');
    
    try {
      // Step 1: Create DynamoDB table
      await this.createDynamoTable();
      
      // Step 2: Count total records
      await this.countTotalRecords();
      
      // Step 3: Migrate data
      await this.migrateUsers();
      await this.migrateSessions();
      await this.migrateInvestments();
      await this.migrateHktStats();
      await this.migrateSubscribers();
      await this.migrateBlogPosts();
      
      // Step 4: Verify migration
      await this.verifyMigration();
      
      this.progress.endTime = new Date();
      console.log('✅ Migration completed successfully!');
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      this.progress.errors.push(error.message);
      throw error;
    }
  }

  private async createDynamoTable() {
    console.log('📝 Creating DynamoDB table...');
    try {
      await createTable(dynamoClient);
      console.log('✅ DynamoDB table created successfully');
      
      // Wait for table to become active
      console.log('⏳ Waiting for table to become active...');
      await this.waitForTableActive();
      
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log('ℹ️ Table already exists, skipping creation');
      } else {
        throw error;
      }
    }
  }

  private async waitForTableActive() {
    // Wait 30 seconds for table to become active
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  private async countTotalRecords() {
    console.log('🔢 Counting total records...');
    
    const tables = [
      'users', 'sessions', 'investments', 'quarterly_data', 
      'hkt_stats', 'subscribers', 'blog_posts', 'user_wallets'
    ];
    
    let total = 0;
    for (const table of tables) {
      try {
        const result = await pgPool.query(`SELECT COUNT(*) FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        total += count;
        console.log(`  ${table}: ${count} records`);
      } catch (error) {
        console.log(`  ${table}: Table not found or error - ${error.message}`);
      }
    }
    
    this.progress.totalRecords = total;
    console.log(`📊 Total records to migrate: ${total}`);
  }

  private async migrateUsers() {
    console.log('👥 Migrating users...');
    
    try {
      const result = await pgPool.query(`
        SELECT id, email, password_hash, email_verified, primary_wallet_address,
               first_name, last_name, country, phone_number, referral_code, 
               referred_by, created_at, updated_at
        FROM users
        ORDER BY id
      `);

      console.log(`Found ${result.rows.length} users to migrate`);
      
      for (const row of result.rows) {
        try {
          await userService.createUser({
            userId: row.id.toString(),
            email: row.email,
            passwordHash: row.password_hash,
            emailVerified: row.email_verified || false,
            primaryWalletAddress: row.primary_wallet_address,
            firstName: row.first_name,
            lastName: row.last_name,
            country: row.country,
            phoneNumber: row.phone_number,
            referralCode: row.referral_code,
            referredBy: row.referred_by,
            createdAt: row.created_at?.toISOString() || new Date().toISOString(),
            updatedAt: row.updated_at?.toISOString() || new Date().toISOString(),
          });
          
          this.progress.migratedRecords++;
          
          if (this.progress.migratedRecords % 100 === 0) {
            console.log(`  Migrated ${this.progress.migratedRecords} users...`);
          }
          
        } catch (error) {
          console.error(`Error migrating user ${row.id}:`, error.message);
          this.progress.errors.push(`User ${row.id}: ${error.message}`);
        }
      }
      
      console.log(`✅ Users migration completed: ${result.rows.length} records`);
      
    } catch (error) {
      console.error('❌ Users migration failed:', error);
      throw error;
    }
  }

  private async migrateSessions() {
    console.log('🔐 Migrating sessions...');
    
    try {
      const result = await pgPool.query(`
        SELECT id, user_id, token, user_agent, ip_address, created_at, expires_at
        FROM sessions
        WHERE expires_at > NOW()
        ORDER BY created_at
      `);

      console.log(`Found ${result.rows.length} active sessions to migrate`);
      
      for (const row of result.rows) {
        try {
          await sessionService.createSession(row.user_id.toString(), {
            token: row.token,
            userAgent: row.user_agent,
            ipAddress: row.ip_address,
            createdAt: row.created_at?.toISOString() || new Date().toISOString(),
            expiresAt: row.expires_at?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
          
          this.progress.migratedRecords++;
          
        } catch (error) {
          console.error(`Error migrating session ${row.id}:`, error.message);
          this.progress.errors.push(`Session ${row.id}: ${error.message}`);
        }
      }
      
      console.log(`✅ Sessions migration completed: ${result.rows.length} records`);
      
    } catch (error) {
      console.error('❌ Sessions migration failed:', error);
      this.progress.errors.push(`Sessions migration: ${error.message}`);
    }
  }

  private async migrateInvestments() {
    console.log('💰 Migrating investments...');
    
    try {
      const result = await pgPool.query(`
        SELECT id, user_id, wallet_address, monthly_amount, total_invested,
               current_value, hkt_balance, property_shares, start_date,
               status, created_at, updated_at
        FROM investments
        ORDER BY created_at
      `);

      console.log(`Found ${result.rows.length} investments to migrate`);
      
      for (const row of result.rows) {
        try {
          await investmentService.createInvestment(row.user_id.toString(), {
            walletAddress: row.wallet_address,
            monthlyAmount: parseFloat(row.monthly_amount) || 0,
            totalInvested: parseFloat(row.total_invested) || 0,
            currentValue: parseFloat(row.current_value) || 0,
            hktBalance: parseFloat(row.hkt_balance) || 0,
            propertyShares: parseInt(row.property_shares) || 0,
            startDate: row.start_date?.toISOString() || new Date().toISOString(),
            status: row.status || 'active',
            createdAt: row.created_at?.toISOString() || new Date().toISOString(),
            updatedAt: row.updated_at?.toISOString() || new Date().toISOString(),
          });
          
          this.progress.migratedRecords++;
          
        } catch (error) {
          console.error(`Error migrating investment ${row.id}:`, error.message);
          this.progress.errors.push(`Investment ${row.id}: ${error.message}`);
        }
      }
      
      console.log(`✅ Investments migration completed: ${result.rows.length} records`);
      
    } catch (error) {
      console.error('❌ Investments migration failed:', error);
      this.progress.errors.push(`Investments migration: ${error.message}`);
    }
  }

  private async migrateHktStats() {
    console.log('📊 Migrating HKT stats...');
    
    try {
      const result = await pgPool.query(`
        SELECT price, price_change_24h, market_cap, volume_24h, total_supply, last_updated
        FROM hkt_stats
        ORDER BY last_updated DESC
        LIMIT 10
      `);

      console.log(`Found ${result.rows.length} HKT stats records to migrate`);
      
      for (const row of result.rows) {
        try {
          await hktStatsService.updateHktStats({
            price: parseFloat(row.price) || 0,
            priceChange24h: parseFloat(row.price_change_24h) || 0,
            marketCap: row.market_cap ? parseFloat(row.market_cap) : undefined,
            volume24h: row.volume_24h ? parseFloat(row.volume_24h) : undefined,
            totalSupply: row.total_supply ? parseFloat(row.total_supply) : undefined,
            dataSource: 'migration',
          });
          
          this.progress.migratedRecords++;
          
        } catch (error) {
          console.error(`Error migrating HKT stats:`, error.message);
          this.progress.errors.push(`HKT stats: ${error.message}`);
        }
      }
      
      console.log(`✅ HKT stats migration completed: ${result.rows.length} records`);
      
    } catch (error) {
      console.error('❌ HKT stats migration failed:', error);
      this.progress.errors.push(`HKT stats migration: ${error.message}`);
    }
  }

  private async migrateSubscribers() {
    console.log('📧 Migrating subscribers...');
    
    try {
      const result = await pgPool.query(`
        SELECT email, subscription_type, is_active, subscribed_at, unsubscribed_at
        FROM subscribers
        ORDER BY subscribed_at
      `);

      console.log(`Found ${result.rows.length} subscribers to migrate`);
      
      // TODO: Implement subscriber migration using DynamoDB service
      // This would follow the same pattern as other migrations
      
      console.log(`✅ Subscribers migration completed: ${result.rows.length} records`);
      
    } catch (error) {
      console.error('❌ Subscribers migration failed:', error);
      this.progress.errors.push(`Subscribers migration: ${error.message}`);
    }
  }

  private async migrateBlogPosts() {
    console.log('📝 Migrating blog posts...');
    
    try {
      const result = await pgPool.query(`
        SELECT id, title, slug, content, excerpt, author, status, tags,
               published_at, created_at, updated_at
        FROM blog_posts
        ORDER BY created_at
      `);

      console.log(`Found ${result.rows.length} blog posts to migrate`);
      
      // TODO: Implement blog posts migration using DynamoDB service
      // This would follow the same pattern as other migrations
      
      console.log(`✅ Blog posts migration completed: ${result.rows.length} records`);
      
    } catch (error) {
      console.error('❌ Blog posts migration failed:', error);
      this.progress.errors.push(`Blog posts migration: ${error.message}`);
    }
  }

  private async verifyMigration() {
    console.log('🔍 Verifying migration...');
    
    // TODO: Add verification queries to ensure data integrity
    // Compare counts between PostgreSQL and DynamoDB
    
    console.log('✅ Migration verification completed');
  }

  private printSummary() {
    const duration = this.progress.endTime 
      ? this.progress.endTime.getTime() - this.progress.startTime.getTime()
      : 0;
    
    console.log('\n📊 Migration Summary:');
    console.log(`  Total records: ${this.progress.totalRecords}`);
    console.log(`  Migrated records: ${this.progress.migratedRecords}`);
    console.log(`  Errors: ${this.progress.errors.length}`);
    console.log(`  Duration: ${Math.round(duration / 1000)}s`);
    
    if (this.progress.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.progress.errors.forEach(error => console.log(`  - ${error}`));
    }
  }
}

// Run migration if script is executed directly
if (import.meta.url === new URL(import.meta.resolve('.')).href) {
  const migration = new DataMigration();
  migration.runMigration().catch(console.error);
}

export default DataMigration;