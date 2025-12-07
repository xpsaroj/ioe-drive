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
    })
}

const client = isProd()
    ? createDbPool()
    : global.__dbPool ?? (global.__dbPool = createDbPool());

export const db = drizzle(client, { schema: dbSchema });
export default db;