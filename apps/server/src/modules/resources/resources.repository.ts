import { eq, and, count, desc } from "drizzle-orm";

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
     * Find the minimal data needed to authorize and perform a deletion: the owning
     * user and the blob name of every attached file (so they can be removed from
     * Azure Blob Storage before the resource row itself is deleted).
     * @param resourceId - ID of the resource to look up.
     * @returns The resource's id, uploader, and attached files' blob names, or undefined.
     */
    async findForDeletion(resourceId: number) {
        return await db
            .query
            .resourcesTable
            .findFirst({
                where: eq(resourcesTable.id, resourceId),
                columns: {
                    id: true,
                    uploadedBy: true,
                },
                with: {
                    files: {
                        columns: {
                            blobName: true,
                        },
                    },
                },
            });
    }

    /**
     * Delete a resource from the database. Attached `resource_files` rows are removed
     * automatically via the FK's cascade delete.
     * @param resourceId - ID of the resource to delete.
     */
    async delete(resourceId: number) {
        await db
            .delete(resourcesTable)
            .where(eq(resourcesTable.id, resourceId));
    }

    /**
     * Find the minimal data needed to authorize an action against a resource
     * (its id and uploader), without pulling in any of its related data.
     * @param resourceId - ID of the resource to look up.
     * @returns The resource's id and uploader, or undefined.
     */
    async findOwnership(resourceId: number) {
        return await db
            .query
            .resourcesTable
            .findFirst({
                where: eq(resourcesTable.id, resourceId),
                columns: {
                    id: true,
                    uploadedBy: true,
                },
            });
    }

    /**
     * Attach one or more already-uploaded files to an existing resource.
     * @param resourceId - ID of the resource to attach the files to.
     * @param files - Metadata for the uploaded files.
     */
    async addFiles(resourceId: number, files: FileMetaData[]) {
        if (files.length === 0) return;

        await db
            .insert(resourceFilesTable)
            .values(
                files.map((file) => ({
                    resourceId,
                    fileUrl: file.url,
                    fileSize: file.size,
                    blobName: file.blobName,
                    originalFileName: file.originalName,
                    mimeType: file.mimeType,
                }))
            );
    }

    /**
     * Find a file, scoped to a specific resource (so a file id can't be used to reach
     * into a different resource than the one the caller is authorized for).
     * @param resourceId - ID of the resource the file should belong to.
     * @param fileId - ID of the file to look up.
     * @returns The file's id, blob name, and original file name, or undefined.
     */
    async findFile(resourceId: number, fileId: number) {
        return await db
            .query
            .resourceFilesTable
            .findFirst({
                where: (fields, { eq, and }) => and(
                    eq(fields.id, fileId),
                    eq(fields.resourceId, resourceId)
                ),
                columns: {
                    id: true,
                    blobName: true,
                    originalFileName: true,
                },
            });
    }

    /**
     * Delete a single file row.
     * @param fileId - ID of the file to delete.
     */
    async deleteFile(fileId: number) {
        await db
            .delete(resourceFilesTable)
            .where(eq(resourceFilesTable.id, fileId));
    }

    /**
     * Find resources by subject offering ID or user ID, paginated.
     * @param filters - Filters for finding resources.
     * @param pagination - Limit/offset to apply.
     * @returns The page of matching resources plus the total count matching the filters.
     */
    async findMany(
        filters: {
            offeringId?: number;
            userId?: number;
        },
        pagination: { limit: number; offset: number }
    ) {
        const conditions = [];

        if (filters.offeringId) {
            conditions.push(eq(resourcesTable.offeringId, filters.offeringId));
        }

        if (filters.userId) {
            conditions.push(eq(resourcesTable.uploadedBy, filters.userId));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [items, totalResult] = await Promise.all([
            db
                .query
                .resourcesTable
                .findMany({
                    where: whereClause,
                    orderBy: [desc(resourcesTable.createdAt)],
                    limit: pagination.limit,
                    offset: pagination.offset,
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
                }),
            db
                .select({ total: count() })
                .from(resourcesTable)
                .where(whereClause),
        ]);

        return { items, total: totalResult[0]?.total ?? 0 };
    }
}

export const resourcesRepository = new ResourcesRepository();
