import { eq } from "drizzle-orm";

import { env } from "../../config/env.js";
import { clerkClient } from "../../config/clerk.config.js";
import { db } from "../index.js";
import { profilesTable, usersTable } from "../schema.js";

/**
 * Sync Clerk users to the local developement database, including their profiles. Ensure that development instance Clerk API keys are used.
 */
async function syncUsers() {
    if (!env.CLERK_SECRET_KEY.startsWith("sk_test_")) {
        console.error("Error: CLERK_SECRET_KEY must be a development instance key (sk_test_) for syncing users.");
        process.exit(1);
    }
    
    let offset = 0;
    const limit = 100;

    while (true) {
        // Clerk development instance users, be sure to use the correct API key for your environment
        const { data: clerkUsers } = await clerkClient.users.getUserList({
            limit,
            offset,
            orderBy: "+created_at",
        });

        if (clerkUsers.length === 0) {
            break;
        }

        for (const clerkUser of clerkUsers) {
            await db.transaction(async (tx) => {
                const email = clerkUser.primaryEmailAddress?.emailAddress ?? null;

                const fullName = [clerkUser.firstName, clerkUser.lastName]
                    .filter(Boolean)
                    .join(" ")
                    .trim() || "Unknown User";

                // Upsert user
                const existingUser = await tx.query.usersTable.findFirst({
                    where: eq(usersTable.clerkUserId, clerkUser.id),
                });

                let userId: number;

                if (!existingUser) {
                    const [user] = await tx
                        .insert(usersTable)
                        .values({
                            clerkUserId: clerkUser.id,
                            fullName,
                            email,
                        })
                        .returning();

                    userId = user.id;

                    console.log(`Created user: ${email ?? clerkUser.id}`);
                } else {
                    const [user] = await tx
                        .update(usersTable)
                        .set({
                            fullName,
                            email,
                        })
                        .where(eq(usersTable.id, existingUser.id))
                        .returning();

                    userId = user.id;

                    console.log(`Updated user: ${email ?? clerkUser.id}`);
                }

                // Upsert profile
                const existingProfile = await tx.query.profilesTable.findFirst({
                    where: eq(profilesTable.userId, userId),
                });

                if (!existingProfile) {
                    await tx.insert(profilesTable).values({
                        userId,
                        profilePictureUrl: clerkUser.imageUrl,
                    });

                    console.log(`Created profile: ${email ?? clerkUser.id}`);
                } else {
                    await tx
                        .update(profilesTable)
                        .set({
                            profilePictureUrl: clerkUser.imageUrl,
                        })
                        .where(eq(profilesTable.userId, userId));

                    console.log(`Updated profile: ${email ?? clerkUser.id}`);
                }
            });
        }

        offset += limit;
    }

    console.log("Finished syncing Clerk users.");
}

syncUsers()
    .then(() => {
        console.log("User sync completed successfully.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("User sync failed:", error);
        process.exit(1);
    });