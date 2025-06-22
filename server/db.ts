import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = false;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create pool with additional configuration
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0
});

export const db = drizzle({ client: pool, schema });