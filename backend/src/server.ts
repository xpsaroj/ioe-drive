import express from "express";
import morgan from "morgan";

import { isTest, isDev } from "./config/env.js";

const app = express();

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