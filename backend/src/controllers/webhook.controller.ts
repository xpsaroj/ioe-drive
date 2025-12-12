import { eq } from "drizzle-orm";
import type { UserWebhookEvent, UserJSON, UserDeletedJSON } from "@clerk/express";

import { db } from "../db/index.js";
import { usersTable, profilesTable } from "../db/schema.js";
import { alreadyProcessed, markProcessed } from "../utils/webhooks.js";

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
function getPrimaryEmail(data: UserJSON): string | null {
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
export async function handleUserCreated(svixId: string, event: UserWebhookEvent): Promise<void> {
    if (await alreadyProcessed(svixId)) {
        return console.log("Duplicate webhook skipped");
    }

    const data = event.data as UserJSON;
    const fullName = getFullName(data.first_name, data.last_name);
    const email = getPrimaryEmail(data);

    try {
        await db.transaction(async (tx) => {
            // Insert user
            const [user] = await tx
                .insert(usersTable)
                .values({
                    clerkUserId: data.id,
                    fullName,
                    email,
                })
                .onConflictDoNothing()
                .returning();

            if (!user) {
                throw new Error("Failed to create user");
            }

            // Insert associated profile
            await tx
                .insert(profilesTable)
                .values({
                    userId: user.id,
                    profilePictureUrl: data.image_url,
                })
                .onConflictDoUpdate({
                    target: profilesTable.userId,
                    set: { profilePictureUrl: data.image_url, },
                });
        })

        await markProcessed(svixId, event.type);
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
export async function handleUserUpdated(svixId: string, event: UserWebhookEvent): Promise<void> {
    if (await alreadyProcessed(svixId)) {
        return console.log("Duplicate webhook skipped");
    }

    const data = event.data as UserJSON;
    const fullName = getFullName(data.first_name, data.last_name);
    const email = getPrimaryEmail(data);

    try {
        const result = await db
            .update(usersTable)
            .set({
                fullName,
                email,
            })
            .where(eq(usersTable.clerkUserId, data.id))
            .returning();

        if (result.length === 0) {
            console.warn(`[Webhook] User not found for update: ${data.id}. Creating instead.`);
            // User doesn't exist, create it (handles edge cases)
            await db.transaction(async (tx) => {
                // Insert user
                const [user] = await tx
                    .insert(usersTable)
                    .values({
                        clerkUserId: data.id,
                        fullName,
                        email,
                    })
                    .onConflictDoNothing()
                    .returning();

                if (!user) {
                    throw new Error("Failed to create user during update fallback");
                }

                // Insert associated profile
                await tx
                    .insert(profilesTable)
                    .values({
                        userId: user.id,
                        profilePictureUrl: data.image_url,
                    })
                    .onConflictDoUpdate({
                        target: profilesTable.userId,
                        set: { profilePictureUrl: data.image_url, },
                    })
            });
        }

        await markProcessed(svixId, event.type);
        console.log(`[Webhook] User updated successfully: ${data.id}`);
    } catch (error) {
        console.error(`[Webhook] Error updating user ${data.id}:`, error);
        throw error;
    }
}

/**
 * Controller: Handle user.deleted event
 * - Deletes user from the database (profile cascades)
 */
export async function handleUserDeleted(svixId: string, event: UserWebhookEvent): Promise<void> {
    if (await alreadyProcessed(svixId)) {
        return console.log("Duplicate webhook skipped");
    }

    const data = event.data as UserDeletedJSON;

    try {
        const result = await db
            .delete(usersTable)
            .where(eq(usersTable.clerkUserId, data.id as string))
            .returning();

        if (result.length === 0) {
            console.warn(`[Webhook] User not found for deletion: ${data.id}`);
        } else {
            console.log(`[Webhook] User deleted successfully: ${data.id}`);
        }

        await markProcessed(svixId, event.type);
    } catch (error) {
        console.error(`[Webhook] Error deleting user ${data.id}:`, error);
        throw error;
    }
}
