import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dbSchema from "./schema.js";
import { env, isProd } from "../config/env.js";

declare global {
    var __dbPool: Pool | undefined;
}

const createDbPool = () => {
    return new Pool({
        connectionString: env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
        ssl: isProd() ? { rejectUnauthorized: false } : false,
    })
}

const client = isProd()
    ? createDbPool()
    : global.__dbPool ?? (global.__dbPool = createDbPool());

export const db = drizzle(client, { schema: dbSchema });
export default db;

/**
 * Test database connection
 */
export async function testConnection() {
    try {
        const clientConn = await client.connect();
        await clientConn.query("SELECT 1");
        clientConn.release();

        console.log("Database connection successful.");
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}