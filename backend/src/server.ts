import express from "express";
import morgan from "morgan";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express"

import { isTest, isDev, env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import meRoutes from "./routes/me.routes.js";
import userRoutes from "./routes/user.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import subjectRoutes from "./routes/subject.routes.js";

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

// API Routes
app.use("/health", healthRoutes);
app.use("/api/me", meRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects", subjectRoutes);

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