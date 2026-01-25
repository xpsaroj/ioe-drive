import { app } from "./server.js"
import { env } from "./config/env.js"
import { testConnection } from "./db/index.js"

async function startServer() {
    const dbConnected = await testConnection();
    if (!dbConnected) {
        console.error("Exiting due to database connection failure.");
        process.exit(1);
    }

    app.listen(env.PORT, () => {
        console.log(`Server running on port: ${env.PORT}`)
        console.log(`Environment: ${env.NODE_ENV}`)
    });
}

startServer();