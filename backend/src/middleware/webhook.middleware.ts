import type { Request, Response, NextFunction } from "express";
import { Webhook } from "svix";

import { env } from "../config/env.js";
import type { WebhookEvent } from "../types/webhook.types.js";

/**
 * Middleware: Verify Clerk webhook signature using Svix
 * 
 * This middleware:
 * 1. Extracts Svix headers from the request
 * 2. Verifies the webhook signature using the secret
 * 3. Attaches the verified payload to req.body
 * 4. Rejects invalid signatures with 400 status
 */
export async function verifyClerkWebhook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Get Svix headers
        const svixId = req.headers["svix-id"] as string;
        const svixTimestamp = req.headers["svix-timestamp"] as string;
        const svixSignature = req.headers["svix-signature"] as string;

        // Check if all required headers are present
        if (!svixId || !svixTimestamp || !svixSignature) {
            console.error("[Webhook] Missing Svix headers");
            res.status(400).json({ error: "Missing Svix headers" });
            return;
        }

        // Get the raw body (must be string for signature verification)
        const payload = req.body;

        // Create Svix webhook instance
        const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

        let event: WebhookEvent;

        try {
            // Verify the webhook signature
            event = wh.verify(payload, {
                "svix-id": svixId,
                "svix-timestamp": svixTimestamp,
                "svix-signature": svixSignature,
            }) as WebhookEvent;
        } catch (err) {
            console.error("[Webhook] Signature verification failed:", err);
            res.status(400).json({ error: "Invalid webhook signature" });
            return;
        }

        // Attach verified event to request for use in route handler
        (req as Request & { webhookEvent: WebhookEvent }).webhookEvent = event;

        next();
    } catch (error) {
        console.error("[Webhook] Verification error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
