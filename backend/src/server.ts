import express from "express";
import morgan from "morgan";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express"

import { isTest, isDev, env } from "./config/env.js";
import webhookRoutes from "./routes/webhook.routes.js";
import userRoutes from "./routes/user.routes.js";
import notesRoutes from "./routes/notes.routes.js";

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

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);

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