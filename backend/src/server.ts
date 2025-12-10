import express from "express";
import morgan from "morgan";

import { isTest, isDev } from "./config/env.js";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

// Webhook routes MUST come before express.json() middleware
// This is critical for signature verification which requires raw body
app.use("/api/webhooks", webhookRoutes);

// Global Middlewares
app.use(express.json());
app.use(
    morgan(isDev() ? "dev" : "combined", {
        skip: () => isTest(),
    })
)

// Health Check Route
app.get("/health", (_req, res) => {
    res.status(200).json({
        message: "Server up and running.",
        status: "ok",
        timestamp: new Date().toISOString(),
    })
})

app.get("/", (_req, res) => {
    res.json({
        message: "Server up and running.",
        status: "ok",
        timestamp: new Date().toISOString(),
    })
});

export { app };
export default app;