import { eq, and } from "drizzle-orm";

import { db } from "../../db/index.js";
import { resourceFilesTable, resourcesTable } from "../../db/schema.js";
import type { CreateResourceInput, UpdateResourceInput } from "./resources.dto.js";
import type { FileMetaData } from "../../types/file.js";

/**
 * Resources Repository
 * - Handles all database operations related to resources.
 */
export class ResourcesRepository {
    /**
     * Create a new resource in the database.
     * @param resourceData - Data for the new resource.
     * @returns The created resource.
     */
    async create(resourceData: CreateResourceInput, files: FileMetaData[]) {
        return await db.transaction(async (tx) => {
            const [createdResource] = await tx
                .insert(resourcesTable)
                .values(resourceData)
                .returning();

            if (!createdResource) {
                throw new Error("Failed to create resource");
            }

            if (files.length > 0) {
                await tx
                    .insert(resourceFilesTable)
                    .values(
                        files.map((file) => ({
                            resourceId: createdResource.id,
                            fileUrl: file.url,
                            fileSize: file.size,
                            blobName: file.blobName,
                            originalFileName: file.originalName,
                            mimeType: file.mimeType,
                        }))
                    )
            }
            return createdResource;
        })
    }

    /**
     * Update an existing resource in the database.
     * @param resourceId - ID of the resource to update.
     * @param userId - ID of the user updating the resource.
     * @param updateData - Data to update the resource with.
     * @returns The updated resource.
     */
    async update(resourceId: number, userId: number, updateData: UpdateResourceInput) {
        const [updatedResource] = await db
            .update(resourcesTable)
            .set(updateData)
            .where(
                and(
                    eq(resourcesTable.id, resourceId),
                    eq(resourcesTable.uploadedBy, userId)
                )
            )
            .returning();
        return updatedResource;
    }

    /**
     * Find a resource by its ID.
     * @param resourceId - ID of the resource to find.
     * @returns The found resource or undefined.
     */
    async findById(resourceId: number) {
        return await db
            .query
            .resourcesTable
            .findFirst({
                where: eq(resourcesTable.id, resourceId),
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
     * Find resources by subject offering ID or user ID.
     * @param filters - Filters for finding resources.
     * @returns An array of resources for the given subject offering ID or user ID.
     */
    async findMany(filters: {
        offeringId?: number;
        userId?: number;
    }) {
        const conditions = [];

        if (filters.offeringId) {
            conditions.push(eq(resourcesTable.offeringId, filters.offeringId));
        }

        if (filters.userId) {
            conditions.push(eq(resourcesTable.uploadedBy, filters.userId));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;;

        return await db
            .query
            .resourcesTable
            .findMany({
                where: whereClause,
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
}

export const resourcesRepository = new ResourcesRepository();
