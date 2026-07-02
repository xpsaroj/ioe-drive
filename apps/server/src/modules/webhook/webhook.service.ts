import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { usersTable, profilesTable } from "../../db/schema.js";
import type { UserInsertSchema, ProfileInsertSchema, UserUpdateSchema, ProfileUpdateSchema } from "../../db/types.js";

/**
 * Webhook Service
 * - Contains helper methods for processing webhook events.
 * - Processes auth webhook data.
 */
export class WebhookService {
    async createUser(
        userData: UserInsertSchema,
        profileData: Omit<ProfileInsertSchema, "userId">
    ) {
        await db.transaction(async (tx) => {
            // Insert user
            const [user] = await tx
                .insert(usersTable)
                .values(userData)
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
                    profilePictureUrl: profileData.profilePictureUrl,
                })
                .onConflictDoUpdate({
                    target: profilesTable.userId,
                    set: { profilePictureUrl: profileData.profilePictureUrl },
                })
        })
    }

    async updateUser(
        userData: UserUpdateSchema,
        profileData: ProfileUpdateSchema
    ) {
        return await db.transaction(async (tx) => {
            // Update user
            const [user] = await tx
                .update(usersTable)
                .set({
                    fullName: userData.fullName,
                    email: userData.email,
                })
                .where(eq(usersTable.clerkUserId, userData.clerkUserId!))
                .returning();

            if (!user) {
                return [];
            }

            // Update associated profile
            await tx
                .update(profilesTable)
                .set({
                    profilePictureUrl: profileData.profilePictureUrl,
                })
                .where(eq(profilesTable.userId, user.id));

            return [user];
        })
    }

    async deleteUser(clerkUserId: string) {
        await db
            .delete(usersTable)
            .where(eq(usersTable.clerkUserId, clerkUserId));
    }
}

export const webhookService = new WebhookService();