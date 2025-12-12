import type { Request, Response, NextFunction } from "express";
import { verifyWebhook, type WebhookEvent } from "@clerk/express/webhooks";

/**
 * Middleware: Verify Clerk webhook signature
 */
export async function verifyClerkWebhook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const evt = await verifyWebhook(req);

        // Attach verified event to request for use in route handler
        (req as Request & { webhookEvent: WebhookEvent }).webhookEvent = evt;

        next();
    } catch (error) {
        console.error("[Webhook] Verification error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
