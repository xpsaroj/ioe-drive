/// <reference types="@clerk/express/env" />

import type { WebhookEvent } from "@clerk/express/webhooks";

declare global {
    namespace Express {
        interface Request {
            webhookEvent?: WebhookEvent;
            authUser?: {
                id: number;
                clerkUserId: string;
            }
        }
    }
}