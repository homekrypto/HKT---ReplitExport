import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

// Fallback PostgreSQL connection using standard pg driver
let pool: Pool;
let db: any;

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  // Use standard PostgreSQL driver as fallback
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('Fallback database pool error:', err.message);
  });

  db = drizzle(pool, { schema });
  console.log('Using fallback PostgreSQL connection');

} catch (error) {
  console.error('Fallback database connection failed:', error);
  
  // Create mock database interface for development
  db = {
    select: () => ({ from: () => ({ where: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
    delete: () => ({ where: () => [] }),
  };
  console.log('Using mock database interface - some features will be limited');
}

export { db, pool };