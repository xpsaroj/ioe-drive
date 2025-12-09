import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import type { UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } from "../types/webhook.types.js";
import { eq } from "drizzle-orm";

/**
 * Helper: Extract full name from Clerk user data
 */
function getFullName(firstName: string | null, lastName: string | null): string {
    const first = firstName?.trim() || "";
    const last = lastName?.trim() || "";
    return `${first} ${last}`.trim() || "User";
}

/**
 * Helper: Get primary email from Clerk user data
 */
function getPrimaryEmail(data: UserCreatedEvent["data"] | UserUpdatedEvent["data"]): string {
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

    throw new Error("No email address found for user");
}

/**
 * Controller: Handle user.created event
 * - Creates a new user in the database
 */
export async function handleUserCreated(event: UserCreatedEvent): Promise<void> {
    const { data } = event;

    console.log(`[Webhook] Creating user: ${data.id}`);

    const fullName = getFullName(data.first_name, data.last_name);
    const email = getPrimaryEmail(data);

    try {
        await db.insert(usersTable).values({
            clerkUserId: data.id,
            fullName,
            email,
        });

        console.log(`[Webhook] User created successfully: ${data.id}`);
    } catch (error) {
        console.error(`[Webhook] Error creating user ${data.id}:`, error);
        throw error;
    }
}

/**
 * Controller: Handle user.updated event
 * - Updates existing user in the database
 */
export async function handleUserUpdated(event: UserUpdatedEvent): Promise<void> {
    const { data } = event;

    console.log(`[Webhook] Updating user: ${data.id}`);

    const fullName = getFullName(data.first_name, data.last_name);
    const email = getPrimaryEmail(data);

    try {
        const result = await db
            .update(usersTable)
            .set({
                fullName,
                email,
                updatedAt: new Date(),
            })
            .where(eq(usersTable.clerkUserId, data.id))
            .returning();

        if (result.length === 0) {
            console.warn(`[Webhook] User not found for update: ${data.id}. Creating instead.`);
            // User doesn't exist, create it (handles edge cases)
            const createEvent: UserCreatedEvent = {
                ...event,
                type: "user.created",
            };
            await handleUserCreated(createEvent);
        } else {
            console.log(`[Webhook] User updated successfully: ${data.id}`);
        }
    } catch (error) {
        console.error(`[Webhook] Error updating user ${data.id}:`, error);
        throw error;
    }
}

/**
 * Controller: Handle user.deleted event
 * - Deletes user from the database
 */
export async function handleUserDeleted(event: UserDeletedEvent): Promise<void> {
    const { data } = event;

    console.log(`[Webhook] Deleting user: ${data.id}`);

    try {
        const result = await db
            .delete(usersTable)
            .where(eq(usersTable.clerkUserId, data.id))
            .returning();

        if (result.length === 0) {
            console.warn(`[Webhook] User not found for deletion: ${data.id}`);
        } else {
            console.log(`[Webhook] User deleted successfully: ${data.id}`);
        }
    } catch (error) {
        console.error(`[Webhook] Error deleting user ${data.id}:`, error);
        throw error;
    }
}
