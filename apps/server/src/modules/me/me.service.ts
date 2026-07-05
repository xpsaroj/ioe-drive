import { eq, desc, and } from "drizzle-orm";

import { db } from "../../db/index.js";
import { resourcesTable, userRecentResourcesTable, userBookmarkedResourcesTable } from "../../db/schema.js";
import { profilesTable } from "../../db/schema.js";
import { NotFoundError } from "../../lib/errors.js";
import type { UpdateProfileInput } from "./me.dto.js";

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
     * Retrieves all resources uploaded by the currently authenticated user.
     * @param userId Currently authenticated user's id
     * @returns Resources uploaded by the user
     */
    async getUploadedResources(userId: number) {
        return await db
            .query.resourcesTable
            .findMany({
                where: eq(resourcesTable.uploadedBy, userId),
                orderBy: [desc(resourcesTable.createdAt)],
                with: {
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
                            originalFileName: true,
                            mimeType: true,
                        },
                    },
                }
            });
    }

    /**
     * Retrieves the recently accessed resources of the currently authenticated user.
     * @param userId Currently authenticated user's id
     * @returns Recently accessed resources by the user
     */
    async getRecentlyAccessedResources(userId: number) {
        return await db
            .query.userRecentResourcesTable
            .findMany({
                where: eq(userRecentResourcesTable.userId, userId),
                with: {
                    resource: {
                        with: {
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
                                    originalFileName: true,
                                    mimeType: true,
                                },
                            },
                        }
                    }
                },
                orderBy: [desc(userRecentResourcesTable.accessedAt)],
                limit: 10,
            });
    }

    /**
     * Retrieves the bookmarked resources of the currently authenticated user.
     * @param userId Currently authenticated user's id
     * @returns Bookmarked resources by the user
     */
    async getBookmarkedResources(userId: number) {
        return await db
            .query.userBookmarkedResourcesTable
            .findMany({
                where: eq(userBookmarkedResourcesTable.userId, userId),
                with: {
                    resource: {
                        with: {
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
                                    originalFileName: true,
                                    mimeType: true,
                                },
                            },
                        }
                    }
                },
                orderBy: [desc(userBookmarkedResourcesTable.bookmarkedAt)],
                limit: 10,
            });
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
