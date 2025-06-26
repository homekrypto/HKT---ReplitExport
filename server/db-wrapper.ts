import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool as PgPool } from 'pg';
import * as schema from "@shared/schema";

class DatabaseWrapper {
  private pool: PgPool | null = null;
  private db: any = null;
  private isConnected = false;
  private connectionRetries = 0;
  private maxRetries = 5;
  private retryDelay = 5000;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not set - running in offline mode');
      this.createMockDatabase();
      return;
    }

    try {
      await this.createConnection();
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.createMockDatabase();
    }
  }

  private async createConnection() {
    try {
      this.pool = new PgPool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });

      this.pool.on('error', (err: any) => {
        console.error('Database pool error:', err.message);
        this.isConnected = false;
        this.scheduleReconnect();
      });

      this.pool.on('connect', () => {
        console.log('Database connected successfully');
        this.isConnected = true;
        this.connectionRetries = 0;
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      
      this.db = drizzlePg(this.pool, { schema });
      this.isConnected = true;
      console.log('Database connection established');

    } catch (error) {
      console.error('Database connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  private scheduleReconnect() {
    if (this.connectionRetries < this.maxRetries) {
      this.connectionRetries++;
      console.log(`Scheduling reconnect attempt ${this.connectionRetries}/${this.maxRetries} in ${this.retryDelay}ms`);
      setTimeout(() => {
        this.createConnection().catch(() => {
          console.log('Reconnection failed, will try again');
        });
      }, this.retryDelay);
    } else {
      console.log('Max reconnection attempts reached, switching to offline mode');
      this.createMockDatabase();
    }
  }

  private createMockDatabase() {
    console.log('Creating mock database interface for offline operation');
    this.db = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([]),
          limit: () => Promise.resolve([]),
          orderBy: () => Promise.resolve([])
        })
      }),
      insert: () => ({
        values: () => ({
          returning: () => Promise.resolve([{ id: 1, success: true }]),
          onConflictDoUpdate: () => ({ returning: () => Promise.resolve([{ id: 1, success: true }]) })
        })
      }),
      update: () => ({
        set: () => ({
          where: () => ({
            returning: () => Promise.resolve([{ id: 1, success: true }])
          })
        })
      }),
      delete: () => ({
        where: () => Promise.resolve([])
      })
    };
    this.isConnected = false;
  }

  getDatabase() {
    return this.db;
  }

  getPool() {
    return this.pool;
  }

  isOnline() {
    return this.isConnected;
  }

  async executeQuery(queryFn: (db: any) => Promise<any>) {
    try {
      if (!this.isConnected) {
        console.warn('Database offline - operation skipped');
        return null;
      }
      return await queryFn(this.db);
    } catch (error) {
      console.error('Database query failed:', error);
      this.isConnected = false;
      this.scheduleReconnect();
      return null;
    }
  }
}

// Create single instance
const dbWrapper = new DatabaseWrapper();

export const db = dbWrapper.getDatabase();
export const pool = dbWrapper.getPool();
export const executeQuery = dbWrapper.executeQuery.bind(dbWrapper);
export const isDbOnline = () => dbWrapper.isOnline();