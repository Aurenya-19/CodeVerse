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

// Optimize connection pool for high concurrency
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max 20 concurrent connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Connection pool monitoring
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export { pool };
export const db = drizzle({ client: pool, schema });
