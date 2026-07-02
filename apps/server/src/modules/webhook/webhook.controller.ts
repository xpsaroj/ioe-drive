import type { UserWebhookEvent, UserJSON, UserDeletedJSON } from "@clerk/express";

import { alreadyProcessed, markProcessed } from "../../utils/webhooks.js";
import { webhookService } from "./webhook.service.js";

/**
 * Webhook Controller
 * - Handles incoming webhook events.
 */
export class WebhookController {
    /**
     * Helper: Extract full name from Clerk user data
     */
    private getFullName(firstName: string | null, lastName: string | null): string {
        const first = firstName?.trim() || "";
        const last = lastName?.trim() || "";
        return `${first} ${last}`.trim() || "User";
    }

    /**
     * Helper: Get primary email from Clerk user data 
     */
    private getPrimaryEmail(data: UserJSON): string | null {
        if (data.primary_email_address_id) {
            const primaryEmail = data.email_addresses.find(
                (email) => email.id === data.primary_email_address_id
            );
            if (primaryEmail) {
                return primaryEmail.email_address;
            }
        }

        // Fallback to first email if no primary
        if (data.email_addresses.length > 0 && data.email_addresses[0]) {
            return data.email_addresses[0].email_address;
        }

        // No email found
        return null;
    }

    /**
     * Controller: Handle user.created event
     * - Creates a new user and associated profile in a transaction
     */
    async handleUserCreated(svixId: string, event: UserWebhookEvent) {
        if (await alreadyProcessed(svixId)) {
            return console.log("[Webhook] Duplicate webhook skipped");
        }

        const data = event.data as UserJSON;
        const fullName = this.getFullName(data.first_name, data.last_name);
        const email = this.getPrimaryEmail(data);

        try {
            const userData = {
                clerkUserId: data.id,
                fullName,
                email,
            }

            const profileData = {
                profilePictureUrl: data.image_url,
            }

            await webhookService.createUser(userData, profileData);

            await markProcessed(svixId, event.type);
        } catch (error) {
            console.error("[Webhook] Error handling user.created webhook:", error);
            throw error;
        }
    }

    /**
     * Controller: Handle user.updated event
     * - Updates an existing user or creates a new one if not found
     */
    async handleUserUpdated(svixId: string, event: UserWebhookEvent) {
        if (await alreadyProcessed(svixId)) {
            return console.log("[Webhook] Duplicate webhook skipped");
        }

        const data = event.data as UserJSON;
        const fullName = this.getFullName(data.first_name, data.last_name);
        const email = this.getPrimaryEmail(data);

        try {
            const userData = {
                clerkUserId: data.id,
                fullName,
                email,
            }

            const profileData = {
                profilePictureUrl: data.image_url,
            }

            const user = await webhookService.updateUser(userData, profileData);

            if (user.length === 0) {
                console.warn(`[Webhook] User to update not found: ${data.id}`);
                
                // User doesn't exist, create it
                await webhookService.createUser(userData, profileData);

                console.log(`[Webhook] User created during update: ${data.id}`);
            }

            await markProcessed(svixId, event.type);
        } catch (error) {
            console.error("[Webhook] Error handling user.updated webhook:", error);
            throw error;
        }
    }

    /**
     * Controller: Handle user.deleted event
     * - Deletes the user from the database (profile is cascade deleted)
     */
    async handleUserDeleted(svixId: string, event: UserWebhookEvent) {
        if (await alreadyProcessed(svixId)) {
            return console.log("[Webhook] Duplicate webhook skipped");
        }

        const data = event.data as UserDeletedJSON;

        try {
            await webhookService.deleteUser(data.id as string);

            await markProcessed(svixId, event.type);
        } catch (error) {
            console.error("[Webhook] Error handling user.deleted webhook:", error);
            throw error;
        }
    }
}

export const webhookController = new WebhookController();