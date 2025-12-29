import { Router } from "express";
import type { Request, Response } from "express";
import type { WebhookEvent } from "@clerk/express/webhooks"
import bodyParser from "body-parser";

import { verifyClerkWebhook } from "../middlewares/webhook.middleware.js";
import {
    handleUserCreated,
    handleUserUpdated,
    handleUserDeleted,
} from "../controllers/webhook.controller.js";

/**
 * POST /api/webhooks/clerk
 * 
 * Endpoint for receiving Clerk webhook events.
 * 
 * IMPORTANT: This route uses raw body parsing for signature verification.
 * Do NOT apply express.json() middleware to this route.
 */
const router = Router();

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
            const event = req.webhookEvent as WebhookEvent;

            const svixId = req.get("svix-id");
            if (!svixId) {
                console.warn("No svix-id in webhook request");
                return res.sendStatus(400);
            }

            console.log(`[Webhook] Received event: ${event.type} (ID: ${event.data.id || "N/A"})`);

            // Route to appropriate handler based on event type
            switch (event.type) {
                case "user.created":
                    await handleUserCreated(svixId, event);
                    break;

                case "user.updated":
                    await handleUserUpdated(svixId, event);
                    break;

                case "user.deleted":
                    await handleUserDeleted(svixId, event);
                    break;

                default:
                    console.warn(`[Webhook] Unhandled event type: ${(event).type}`);
            }

            // Success response (prevents Clerk/Svix from retrying)
            res.sendStatus(200);
        } catch (error) {
            console.error("[Webhook] Error processing webhook:", error);

            // Return 500 to trigger retry from Clerk/Svix
            res.sendStatus(500);
        }
    }
);

export default router;
