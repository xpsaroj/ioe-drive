import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Default stage
process.env.APP_STAGE = process.env.APP_STAGE || "development";

// const isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "development";
const isTesting = process.env.APP_STAGE === "test";

// Load proper .env file based on stage
if (isDevelopment) {
    dotenv.config({ path: ".env" });
} else if (isTesting) {
    dotenv.config({ path: ".env.test" });
}
// For production, we usually rely on actual environment variables,
// so no dotenv.config() here unless you want `.env.production` support.

/**
 * Zod Environment Schema
 */
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    APP_STAGE: z.enum(["development", "test", "production"]).default("development"),

    PORT: z.coerce.number().positive().default(3000),

    // DATABASE_URL: z.string().startsWith('postgresql://')
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
export const isProd = () => env.APP_STAGE === "production";
export const isDev = () => env.APP_STAGE === "development";
export const isTest = () => env.APP_STAGE === "test";

export { env };
export default env;