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

// Aggressive connection pool for auto-recovery
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 100,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  statement_timeout: 30000,
  query_timeout: 30000,
  // Force connection on startup
  allowExitOnIdle: false,
});

let isConnected = false;
let retryCount = 0;
const MAX_AUTO_RETRIES = 10;

// Aggressive auto-recovery
pool.on("error", async (err) => {
  console.error("[DB] Connection error:", err.message);
  isConnected = false;
  
  if (retryCount < MAX_AUTO_RETRIES) {
    retryCount++;
    console.log(`[DB] Auto-retry ${retryCount}/${MAX_AUTO_RETRIES} in 3s...`);
    setTimeout(() => testConnection(), 3000);
  }
});

pool.on("connect", () => {
  console.log("[DB] ✓ Connected successfully");
  isConnected = true;
  retryCount = 0;
});

// Force connection test with auto-retry
async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    isConnected = true;
    console.log("[DB] ✓ Database ready");
    return true;
  } catch (err: any) {
    isConnected = false;
    console.error(`[DB] Connection failed:`, err.message);
    
    if (retryCount < MAX_AUTO_RETRIES) {
      retryCount++;
      console.log(`[DB] Auto-retry ${retryCount}/${MAX_AUTO_RETRIES} in 2s...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return testConnection();
    }
    
    console.error("[DB] ✗ Max retries reached. Database may be unavailable.");
    return false;
  }
}

// Start connection immediately
testConnection().then(success => {
  if (success) {
    console.log("[DB] Database initialized successfully");
  } else {
    console.error("[DB] Database initialization failed - will retry on first query");
  }
});

// Keep connection alive
setInterval(async () => {
  if (!isConnected) {
    console.log("[DB] Connection lost, attempting recovery...");
    await testConnection();
  }
}, 30000); // Check every 30s

export { pool };
export const db = drizzle({ client: pool, schema });

// Auto-retry wrapper
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      console.error(`[DB] Query attempt ${attempt}/${maxRetries} failed:`, err.message);
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Try to reconnect
        if (!isConnected) {
          await testConnection();
        }
      }
    }
  }
  
  throw lastError;
}
