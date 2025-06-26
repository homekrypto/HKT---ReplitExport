import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool as PgPool } from 'pg';
import ws from "ws";
import * as schema from "@shared/schema";

let pool: any;
let db: any;

// Try Neon serverless first, fallback to standard PostgreSQL
try {
  // Configure Neon WebSocket
  neonConfig.webSocketConstructor = ws;
  neonConfig.useSecureWebSocket = true;
  neonConfig.pipelineConnect = false;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  // Try Neon serverless connection
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    allowExitOnIdle: true
  });

  pool.on('error', (err: any) => {
    console.error('Neon database pool error:', err.message);
    throw err;
  });

  db = drizzle({ client: pool, schema });
  console.log('Using Neon serverless database connection');

} catch (neonError) {
  console.log('Neon connection failed, trying standard PostgreSQL...');
  
  try {
    // Fallback to standard PostgreSQL
    pool = new PgPool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err: any) => {
      console.error('PostgreSQL pool error:', err.message);
    });

    db = drizzlePg(pool, { schema });
    console.log('Using standard PostgreSQL connection');

  } catch (pgError) {
    console.error('All database connections failed:', pgError);
    
    // Create minimal mock for development
    db = {
      select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
      insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
      update: () => ({ set: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }) }),
      delete: () => ({ where: () => Promise.resolve([]) }),
    };
    console.log('Database unavailable - using limited functionality mode');
  }
}

export { db, pool };