import { Inject, Injectable } from "@nestjs/common";
import { and, count, desc, eq } from "drizzle-orm";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import { resourceFilesTable, resourcesTable } from "../../database/schema";
import type { FileMetadata } from "../../storage/file-metadata.interface";
import type { CreateResourceData, UpdateResourceData } from "./resources.types";

/**
 * Shared `with` shape for a resource's joined detail (subject/program, uploader +
 * profile picture, files) - used by findById/findMany below, and reused as-is by
 * MeRepository for the recent/bookmarked resource lists (same shape, joined off a
 * different table).
 */
export const RESOURCE_DETAIL_RELATIONS = {
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
    },
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
        },
      },
    },
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

@Injectable()
export class ResourcesRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async create(resourceData: CreateResourceData, files: FileMetadata[]) {
    return this.db.transaction(async (tx) => {
      const [createdResource] = await tx.insert(resourcesTable).values(resourceData).returning();

      if (!createdResource) {
        throw new Error("Failed to create resource");
      }

      if (files.length > 0) {
        await tx.insert(resourceFilesTable).values(
          files.map((file) => ({
            resourceId: createdResource.id,
            fileUrl: file.url,
            fileSize: file.size,
            blobName: file.blobName,
            originalFileName: file.originalName,
            mimeType: file.mimeType,
          })),
        );
      }

      return createdResource;
    });
  }

  async update(resourceId: number, userId: number, updateData: UpdateResourceData) {
    const [updatedResource] = await this.db
      .update(resourcesTable)
      .set(updateData)
      .where(and(eq(resourcesTable.id, resourceId), eq(resourcesTable.uploadedBy, userId)))
      .returning();

    return updatedResource;
  }

  findById(resourceId: number) {
    return this.db.query.resourcesTable.findFirst({
      where: eq(resourcesTable.id, resourceId),
      with: RESOURCE_DETAIL_RELATIONS,
    });
  }

  /** Minimal data needed to authorize + perform a deletion: the owning user and every
   * attached file's blob name (so they can be removed from Azure before the row is). */
  findForDeletion(resourceId: number) {
    return this.db.query.resourcesTable.findFirst({
      where: eq(resourcesTable.id, resourceId),
      columns: { id: true, uploadedBy: true },
      with: { files: { columns: { blobName: true } } },
    });
  }

  async delete(resourceId: number): Promise<void> {
    // resource_files rows cascade-delete via the FK.
    await this.db.delete(resourcesTable).where(eq(resourcesTable.id, resourceId));
  }

  /** Minimal data needed to authorize an action against a resource, without pulling in
   * any related data. */
  findOwnership(resourceId: number) {
    return this.db.query.resourcesTable.findFirst({
      where: eq(resourcesTable.id, resourceId),
      columns: { id: true, uploadedBy: true },
    });
  }

  async addFiles(resourceId: number, files: FileMetadata[]): Promise<void> {
    if (files.length === 0) return;

    await this.db.insert(resourceFilesTable).values(
      files.map((file) => ({
        resourceId,
        fileUrl: file.url,
        fileSize: file.size,
        blobName: file.blobName,
        originalFileName: file.originalName,
        mimeType: file.mimeType,
      })),
    );
  }

  /** Scoped to a specific resourceId, so a file id can't be used to reach into a
   * different resource than the one the caller is authorized for. */
  findFile(resourceId: number, fileId: number) {
    return this.db.query.resourceFilesTable.findFirst({
      where: (fields, { and, eq }) => and(eq(fields.id, fileId), eq(fields.resourceId, resourceId)),
      columns: { id: true, blobName: true, originalFileName: true },
    });
  }

  async deleteFile(fileId: number): Promise<void> {
    await this.db.delete(resourceFilesTable).where(eq(resourceFilesTable.id, fileId));
  }

  async findMany(
    filters: { offeringId?: number; userId?: number },
    pagination: { limit: number; offset: number },
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
      this.db.query.resourcesTable.findMany({
        where: whereClause,
        orderBy: [desc(resourcesTable.createdAt)],
        limit: pagination.limit,
        offset: pagination.offset,
        with: RESOURCE_DETAIL_RELATIONS,
      }),
      this.db.select({ total: count() }).from(resourcesTable).where(whereClause),
    ]);

    return { items, total: totalResult[0]?.total ?? 0 };
  }
}
