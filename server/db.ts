import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL);

// Export the database connection with our schema
export const db = drizzle(sql, { schema });
