import express from "express";
import morgan from "morgan";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express"

import { isTest, isDev, env } from "./config/env.js";
import healthRoutes from "./modules/health/health.routes.js";
import webhookRoutes from "./modules/webhook/webhook.routes.js";
import apiRoutes from "./routes/index.js";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// CORS Configuration
app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(","),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Webhook routes MUST come before express.json() middleware
// This is critical for signature verification which requires raw body
app.use("/api/webhooks", webhookRoutes);

// Logger
app.use(
    morgan(isDev() ? "dev" : "combined", {
        skip: () => isTest(),
    })
)

// Clerk Middleware
app.use(clerkMiddleware());

// Global Middlewares
app.use(express.json());

// Health Check Route
app.use("/health", healthRoutes);

// API Routes
app.use("/api", apiRoutes)

// 404 Handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});

// Error Handling Middleware
app.use(errorHandler)

export { app };
export default app;