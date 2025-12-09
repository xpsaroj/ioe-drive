import { Router } from "express";
import type { Request, Response } from "express";
import bodyParser from "body-parser";

import { verifyClerkWebhook } from "../middleware/webhook.middleware.js";
import {
    handleUserCreated,
    handleUserUpdated,
    handleUserDeleted,
} from "../controllers/webhook.controller.js";
import type {
    ClerkWebhookEvent,
    UserCreatedEvent,
    UserUpdatedEvent,
    UserDeletedEvent,
} from "../types/webhook.types.js";

const router = Router();

/**
 * POST /api/webhooks/clerk
 * 
 * Endpoint for receiving Clerk webhook events.
 * 
 * IMPORTANT: This route uses raw body parsing for signature verification.
 * Do NOT apply express.json() middleware to this route.
 */
router.post(
    "/clerk",
    // Use raw body parser (required for signature verification)
    bodyParser.raw({ type: "application/json" }),
    // Verify webhook signature
    verifyClerkWebhook,
    // Handle the webhook event
    async (req: Request, res: Response) => {
        try {
            // Get the verified event from middleware
            const event = (req as Request & { webhookEvent: ClerkWebhookEvent }).webhookEvent as ClerkWebhookEvent;

            console.log(`[Webhook] Received event: ${event.type} (ID: ${event.data.id || "N/A"})`);

            // Route to appropriate handler based on event type
            switch (event.type) {
                case "user.created":
                    await handleUserCreated(event as UserCreatedEvent);
                    break;

                case "user.updated":
                    await handleUserUpdated(event as UserUpdatedEvent);
                    break;

                case "user.deleted":
                    await handleUserDeleted(event as UserDeletedEvent);
                    break;

                default:
                    // TypeScript exhaustiveness check - this should never happen
                    console.warn(`[Webhook] Unhandled event type: ${(event as ClerkWebhookEvent).type}`);
                    // Return 200 even for unhandled events to prevent retries
                    res.status(200).json({ message: "Event type not handled" });
                    return;
            }

            // Success response (prevents Clerk/Svix from retrying)
            res.status(200).json({ message: "Webhook processed successfully" });
        } catch (error) {
            console.error("[Webhook] Error processing webhook:", error);

            // Return 500 to trigger retry from Clerk/Svix
            res.status(500).json({ error: "Error processing webhook" });
        }
    }
);

export default router;
