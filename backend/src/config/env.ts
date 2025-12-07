import dotenv from "dotenv";
import { z } from "zod";

// Determine NODE_ENV first
const nodeEnv = process.env.NODE_ENV ?? "development";

// Load proper .env file
if (nodeEnv === "development") {
    dotenv.config({ path: ".env.local" });
} else if (nodeEnv === "test") {
    dotenv.config({ path: ".env.test" });
}

/**
 * Zod Environment Schema
*/
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    PORT: z.coerce.number().positive().default(3000),

    DATABASE_URL: z.string().startsWith('postgresql://'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
    env = envSchema.parse(process.env);
} catch (e) {
    if (e instanceof z.ZodError) {
        console.log("Invalid environment variables!");
        console.error(JSON.stringify(z.treeifyError(e), null, 2));

        e.issues.forEach((err) => {
            const path = err.path.join(".");
            console.log(`${path}: ${err.message}`);
        });

        process.exit(1);
    }

    throw e;
}

// Helpers
export const isDev = () => env.NODE_ENV === "development";
export const isProd = () => env.NODE_ENV === "production";
export const isTest = () => env.NODE_ENV === "test";

export { env };
export default env;