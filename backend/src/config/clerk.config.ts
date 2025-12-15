import { createClerkClient } from "@clerk/express";

import { env } from "./env.js";

const clerkClient = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
});

export default clerkClient;
export { clerkClient };