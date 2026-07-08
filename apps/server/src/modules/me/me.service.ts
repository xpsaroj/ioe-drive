import { eq, desc, and, count } from "drizzle-orm";

import { db } from "../../db/index.js";
import { resourcesTable, userRecentResourcesTable, userBookmarkedResourcesTable } from "../../db/schema.js";
import { profilesTable } from "../../db/schema.js";
import { NotFoundError } from "../../lib/errors.js";
import { resourcesRepository } from "../resources/resources.repository.js";
import type { UpdateProfileInput } from "./me.dto.js";

/**
 * Shared `with` shape for a resource joined off of another table (recent/bookmarked),
 * matching the fields `resourcesRepository.findMany` selects for a bare resource query.
 */
const resourceSummaryRelations = {
    subjectOffering: {
        columns: {
            id: true,
            subjectId: true,
        },
        with: {
            subject: {
                columns: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
        }
    },
    uploader: {
        columns: {
            id: true,
            fullName: true,
        },
        with: {
            profile: {
                columns: {
                    id: true,
                    userId: true,
                    profilePictureUrl: true,
                }
            }
        }
    },
    files: {
        columns: {
            id: true,
            resourceId: true,
            fileUrl: true,
            fileSize: true,
            originalFileName: true,
            mimeType: true,
        },
    },
} as const;

/**
 * Me Service
 * - Handles business logic related to the currently authenticated user.
 */
export class MeService {
    /**
     * Retrieves the profile of the currently authenticated user.
     * @param userId Currently authenticated user's id (through auth middleware)
     * @returns User profile
     */
    async getProfile(userId: number) {
        const userProfile = await db
            .query.usersTable
            .findFirst({
                where: (fields, { eq }) => eq(fields.id, userId),
                with: {
                    profile: {
                        with: {
                            program: true,
                        }
                    },
                }
            });

        if (!userProfile) {
            throw new NotFoundError("User not found");
        }

        return userProfile;
    }

    /**
     * Retrieves resources uploaded by the currently authenticated user, paginated.
     * Delegates to `resourcesRepository.findMany` since this is the exact same query as
     * `GET /api/resources?userId=` - the "me" module just fixes the filter to the caller.
     * @param userId Currently authenticated user's id
     * @param pagination Limit/offset to apply
     * @returns The page of uploaded resources plus the total count.
     */
    async getUploadedResources(userId: number, pagination: { limit: number; offset: number }) {
        return await resourcesRepository.findMany({ userId }, pagination);
    }

    /**
     * Retrieves the recently accessed resources of the currently authenticated user,
     * paginated (no longer hard-capped at 10 - that was the old fixed page size).
     * @param userId Currently authenticated user's id
     * @param pagination Limit/offset to apply
     * @returns The page of recently accessed resources plus the total count.
     */
    async getRecentlyAccessedResources(userId: number, pagination: { limit: number; offset: number }) {
        const [items, totalResult] = await Promise.all([
            db
                .query.userRecentResourcesTable
                .findMany({
                    where: eq(userRecentResourcesTable.userId, userId),
                    with: { resource: { with: resourceSummaryRelations } },
                    orderBy: [desc(userRecentResourcesTable.accessedAt)],
                    limit: pagination.limit,
                    offset: pagination.offset,
                }),
            db
                .select({ total: count() })
                .from(userRecentResourcesTable)
                .where(eq(userRecentResourcesTable.userId, userId)),
        ]);

        return { items, total: totalResult[0]?.total ?? 0 };
    }

    /**
     * Retrieves the bookmarked resources of the currently authenticated user, paginated
     * (no longer hard-capped at 10 - that was the old fixed page size).
     * @param userId Currently authenticated user's id
     * @param pagination Limit/offset to apply
     * @returns The page of bookmarked resources plus the total count.
     */
    async getBookmarkedResources(userId: number, pagination: { limit: number; offset: number }) {
        const [items, totalResult] = await Promise.all([
            db
                .query.userBookmarkedResourcesTable
                .findMany({
                    where: eq(userBookmarkedResourcesTable.userId, userId),
                    with: { resource: { with: resourceSummaryRelations } },
                    orderBy: [desc(userBookmarkedResourcesTable.bookmarkedAt)],
                    limit: pagination.limit,
                    offset: pagination.offset,
                }),
            db
                .select({ total: count() })
                .from(userBookmarkedResourcesTable)
                .where(eq(userBookmarkedResourcesTable.userId, userId)),
        ]);

        return { items, total: totalResult[0]?.total ?? 0 };
    }

    /**
     * Retrieves every resource ID the currently authenticated user has ever bookmarked,
     * uncapped and without joining the resources themselves. Meant for checking
     * bookmark status across many resources at once (e.g. rendering a bookmark icon on
     * every card in a list) - `getBookmarkedResources` above is unsuitable for that
     * since it's capped at 10 and fetches full resource details.
     * @param userId Currently authenticated user's id
     * @returns Array of bookmarked resource IDs
     */
    async getBookmarkedResourceIds(userId: number) {
        const rows = await db
            .query.userBookmarkedResourcesTable
            .findMany({
                where: eq(userBookmarkedResourcesTable.userId, userId),
                columns: {
                    resourceId: true,
                },
            });

        return rows.map((row) => row.resourceId);
    }

    /**
     * Marks a resource as recently accessed by the user.
     * @param userId User ID
     * @param resourceId Resource ID
     */
    async markResourceAsRecentlyAccessed(userId: number, resourceId: number) {
        const existingResource = await db
            .query.resourcesTable
            .findFirst({
                where: eq(resourcesTable.id, resourceId),
            });

        if (!existingResource) {
            throw new NotFoundError("Resource not found");
        }

        const now = new Date();

        await db
            .insert(userRecentResourcesTable)
            .values({
                userId,
                resourceId,
                accessedAt: now,
            })
            .onConflictDoUpdate({
                target: [userRecentResourcesTable.userId, userRecentResourcesTable.resourceId],
                set: {
                    accessedAt: now,
                },
            });
    }

    /**
     * Marks a resource as bookmarked by the user.
     * @param userId User ID
     * @param resourceId Resource ID
     */
    async markResourceAsBookmarked(userId: number, resourceId: number) {
        const existingResource = await db
            .query.resourcesTable
            .findFirst({
                where: eq(resourcesTable.id, resourceId),
            });

        if (!existingResource) {
            throw new NotFoundError("Resource not found");
        }

        const now = new Date();

        await db
            .insert(userBookmarkedResourcesTable)
            .values({
                userId,
                resourceId,
                bookmarkedAt: now,
            })
            .onConflictDoNothing();
    }

    /**
     * Unmarks a resource as bookmarked by the user.
     * @param userId User ID
     * @param resourceId Resource ID
     */
    async unmarkResourceAsBookmarked(userId: number, resourceId: number) {
        await db
            .delete(userBookmarkedResourcesTable)
            .where(
                and(
                    eq(userBookmarkedResourcesTable.userId, userId),
                    eq(userBookmarkedResourcesTable.resourceId, resourceId)
                )
            );
    }

    /**
     * Updates the currently authenticated user's profile.
     * @param userId User ID
     * @param data Profile fields to update
     */
    async updateProfile(userId: number, data: Partial<UpdateProfileInput>) {
        return await db.transaction(async (tx) => {
            const existingProfile = await tx.query.profilesTable.findFirst({
                where: eq(profilesTable.userId, userId),
            });

            if (!existingProfile) throw new NotFoundError("User profile not found");

            // Prepare profile data
            const profileData: Partial<UpdateProfileInput> = {};
            if (data.bio !== undefined) profileData.bio = data.bio;
            if (data.programId !== undefined) profileData.programId = data.programId;
            if (data.semester !== undefined) profileData.semester = data.semester;
            if (data.college !== undefined) profileData.college = data.college;

            // Update profile
            if (Object.keys(profileData).length > 0) {
                await tx.update(profilesTable)
                    .set(profileData)
                    .where(eq(profilesTable.userId, userId));
            }
        });
    }
}

export const meService = new MeService();
