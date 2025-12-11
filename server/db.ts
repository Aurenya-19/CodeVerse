import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Enhanced connection pool with better error handling for 20k+ users
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 100,
  min: 10,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000, // Increased timeout
  statement_timeout: 30000,
  query_timeout: 30000,
});

// Connection pool monitoring with auto-recovery
pool.on("error", (err) => {
  console.error("[DB] Unexpected error on idle client:", err.message);
  
  // Check if it's a disabled endpoint error
  if (err.message?.includes("endpoint") && err.message?.includes("disabled")) {
    console.error("[DB] CRITICAL: Neon database endpoint is disabled!");
    console.error("[DB] Please enable it via Neon dashboard or API");
  }
});

pool.on("connect", () => {
  console.log("[DB] Database connection established");
});

pool.on("remove", () => {
  console.log("[DB] Database connection removed from pool");
});

// Test connection on startup with retry logic
let connectionAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("[DB] ✓ Database connection successful");
    client.release();
    return true;
  } catch (err: any) {
    connectionAttempts++;
    console.error(`[DB] Connection attempt ${connectionAttempts}/${MAX_RETRIES} failed:`, err.message);
    
    if (err.message?.includes("endpoint") && err.message?.includes("disabled")) {
      console.error("[DB] ========================================");
      console.error("[DB] NEON DATABASE ENDPOINT IS DISABLED");
      console.error("[DB] ========================================");
      console.error("[DB] To fix this:");
      console.error("[DB] 1. Go to your Neon dashboard");
      console.error("[DB] 2. Enable the endpoint for your database");
      console.error("[DB] 3. Or use Neon API to enable it programmatically");
      console.error("[DB] ========================================");
    }
    
    if (connectionAttempts < MAX_RETRIES) {
      console.log(`[DB] Retrying in ${RETRY_DELAY/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return testConnection();
    }
    
    console.error("[DB] ✗ Failed to connect after", MAX_RETRIES, "attempts");
    console.error("[DB] Server will continue but database operations will fail");
    return false;
  }
}

// Test connection asynchronously (don't block server startup)
testConnection().catch(err => {
  console.error("[DB] Connection test error:", err);
});

export { pool };
export const db = drizzle({ client: pool, schema });

// Helper function to execute queries with retry logic
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      console.error(`[DB] Query attempt ${attempt}/${maxRetries} failed:`, err.message);
      
      // Don't retry on certain errors
      if (err.message?.includes("endpoint") && err.message?.includes("disabled")) {
        throw new Error("Database endpoint is disabled. Please enable it in Neon dashboard.");
      }
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
