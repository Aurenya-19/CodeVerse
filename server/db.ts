import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Create pool but don't fail if connection fails
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20,
  min: 0, // Allow zero connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 10000,
  query_timeout: 10000,
  allowExitOnIdle: true,
});

let isConnected = false;
let dbAvailable = false;

// Don't fail on errors - just log
pool.on("error", (err) => {
  console.error("[DB] Error (non-fatal):", err.message);
  isConnected = false;
  dbAvailable = false;
});

pool.on("connect", () => {
  console.log("[DB] ✓ Connected");
  isConnected = true;
  dbAvailable = true;
});

// Try to connect but don't block startup
async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    isConnected = true;
    dbAvailable = true;
    console.log("[DB] ✓ Database available");
    return true;
  } catch (err: any) {
    isConnected = false;
    dbAvailable = false;
    
    if (err.message?.includes("endpoint") && err.message?.includes("disabled")) {
      console.error("[DB] ⚠️  Neon endpoint DISABLED - running in memory-only mode");
      console.error("[DB] ⚠️  To fix: Enable endpoint at https://console.neon.tech");
    } else {
      console.error("[DB] ⚠️  Connection failed:", err.message);
    }
    
    console.log("[DB] ℹ️  App will run with memory-only sessions");
    return false;
  }
}

// Test connection but don't wait for it
testConnection().catch(() => {
  console.log("[DB] Starting in memory-only mode");
});

// Try to reconnect periodically
setInterval(() => {
  if (!isConnected) {
    testConnection().catch(() => {});
  }
}, 60000); // Every 60 seconds

export { pool };
export const db = drizzle({ client: pool, schema });

// Check if database is available
export function isDatabaseAvailable(): boolean {
  return dbAvailable;
}

// Safe query wrapper - returns null if DB unavailable
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T | null> {
  if (!dbAvailable) {
    console.log("[DB] Skipping query - database unavailable");
    return null;
  }
  
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      
      if (err.message?.includes("endpoint") && err.message?.includes("disabled")) {
        console.error("[DB] Endpoint disabled - switching to memory mode");
        dbAvailable = false;
        return null;
      }
      
      if (attempt < maxRetries) {
        const delay = Math.min(500 * attempt, 2000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error("[DB] Query failed after retries:", lastError.message);
  dbAvailable = false;
  return null;
}
