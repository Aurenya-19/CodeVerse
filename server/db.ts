import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

// Supabase connection configuration with optimizations
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please add your Supabase connection string."
  );
}

// Connection pool configuration optimized for high load
const poolConfig = {
  max: 20, // Maximum pool size (Supabase free tier supports up to 20 connections)
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  max_lifetime: 60 * 30, // Maximum connection lifetime (30 minutes)
  prepare: false, // Disable prepared statements for better compatibility
};

// Create connection with retry logic
let sql: ReturnType<typeof postgres>;
let db: ReturnType<typeof drizzle>;

try {
  console.log("[DB] Initializing Supabase connection pool...");
  
  // Create postgres connection with pooling
  sql = postgres(connectionString, {
    ...poolConfig,
    onnotice: () => {}, // Suppress notices
    debug: process.env.NODE_ENV === "development",
  });

  // Initialize Drizzle ORM
  db = drizzle(sql, { schema });

  console.log("[DB] ✅ Supabase connection pool initialized successfully");
  console.log(`[DB] Pool config: max=${poolConfig.max}, idle_timeout=${poolConfig.idle_timeout}s`);
} catch (error) {
  console.error("[DB] ❌ Failed to initialize database connection:", error);
  throw error;
}

// Health check function
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  message: string;
  latency?: number;
}> {
  try {
    const start = Date.now();
    await sql`SELECT 1`;
    const latency = Date.now() - start;
    
    return {
      healthy: true,
      message: "Database connection is healthy",
      latency,
    };
  } catch (error) {
    console.error("[DB] Health check failed:", error);
    return {
      healthy: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Graceful shutdown
export async function closeDatabaseConnection(): Promise<void> {
  try {
    console.log("[DB] Closing database connection pool...");
    await sql.end({ timeout: 5 });
    console.log("[DB] ✅ Database connection pool closed");
  } catch (error) {
    console.error("[DB] ❌ Error closing database connection:", error);
  }
}

// Handle process termination
process.on("SIGTERM", async () => {
  console.log("[DB] SIGTERM received, closing database connection...");
  await closeDatabaseConnection();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[DB] SIGINT received, closing database connection...");
  await closeDatabaseConnection();
  process.exit(0);
});

// Export database instance
export { db, sql };
