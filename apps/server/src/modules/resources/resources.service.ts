import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import type { AuthenticatedUser } from "../../common/guards/clerk-auth.guard";
import { AzureBlobService } from "../../storage/azure-blob.service";
import { ResourcesRepository } from "./resources.repository";
import type { CreateResourceData, UpdateResourceData } from "./resources.types";

@Injectable()
export class ResourcesService {
  constructor(
    private readonly resourcesRepository: ResourcesRepository,
    private readonly azureBlobService: AzureBlobService,
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
  ) { }

  private async uploadFiles(files: Express.Multer.File[]) {
    return Promise.all(
      files.map(async (file) => {
        const blobName = this.azureBlobService.generateBlobName(file.originalname);
        const url = await this.azureBlobService.upload(file.buffer, blobName, file.mimetype);

        return {
          blobName,
          url,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        };
      }),
    );
  }

  async createResource(
    userId: number,
    resourceData: Omit<CreateResourceData, "uploadedBy" | "status">,
    resourceFiles: Express.Multer.File[],
  ) {
    const existingSubject = await this.db.query.subjectOfferingsTable.findFirst({
      where: (fields, { eq }) => eq(fields.id, resourceData.offeringId),
      columns: { id: true },
    });

    if (!existingSubject) {
      throw new NotFoundException("Subject offering not found");
    }

    const uploadedFiles = await this.uploadFiles(resourceFiles);

    return this.resourcesRepository.create(
      { ...resourceData, uploadedBy: userId, status: "PENDING" },
      uploadedFiles,
    );
  }

  async updateResource(userId: number, resourceId: number, updateData: UpdateResourceData) {
    const existingResource = await this.resourcesRepository.findById(resourceId);

    if (!existingResource || existingResource.uploadedBy !== userId) {
      throw new NotFoundException("Resource not found");
    }

    if (existingResource.status === "REMOVED") {
      throw new BadRequestException("This resource has been removed and can no longer be edited.");
    }

    // Editing a rejected resource is treated as an implicit resubmission - back to the
    // review queue, with the previous moderation verdict cleared. Approved/pending
    // resources are left as-is by an edit.
    const resubmission =
      existingResource.status === "REJECTED"
        ? {
            status: "PENDING" as const,
            moderatedBy: null,
            moderationReason: null,
            moderationNote: null,
            moderatedAt: null,
          }
        : {};

    return this.resourcesRepository.update(resourceId, userId, { ...updateData, ...resubmission });
  }

  async deleteResource(userId: number, resourceId: number): Promise<void> {
    const existingResource = await this.resourcesRepository.findForDeletion(resourceId);

    if (!existingResource || existingResource.uploadedBy !== userId) {
      throw new NotFoundException("Resource not found");
    }

    await Promise.all(existingResource.files.map((file) => this.azureBlobService.delete(file.blobName)));
    await this.resourcesRepository.delete(resourceId);
  }

  /** Verifies a resource exists and is owned by the given user - shared by every
   * action below that mutates an existing resource or its files. A resource that
   * doesn't exist and one that isn't yours are indistinguishable (both 404), so a
   * non-owner can't probe for a resource's existence. A REMOVED resource's files were
   * already purged by moderation, so it's terminal - no further file changes either. */
  private async assertOwnership(userId: number, resourceId: number): Promise<void> {
    const resource = await this.resourcesRepository.findOwnership(resourceId);

    if (!resource || resource.uploadedBy !== userId) {
      throw new NotFoundException("Resource not found");
    }

    if (resource.status === "REMOVED") {
      throw new BadRequestException("This resource has been removed and can no longer be edited.");
    }
  }

  async addResourceFiles(userId: number, resourceId: number, files: Express.Multer.File[]): Promise<void> {
    await this.assertOwnership(userId, resourceId);

    const uploadedFiles = await this.uploadFiles(files);
    await this.resourcesRepository.addFiles(resourceId, uploadedFiles);
  }

  async removeResourceFile(userId: number, resourceId: number, fileId: number): Promise<void> {
    await this.assertOwnership(userId, resourceId);

    const file = await this.resourcesRepository.findFile(resourceId, fileId);

    if (!file) {
      throw new NotFoundException("File not found");
    }

    await this.azureBlobService.delete(file.blobName);
    await this.resourcesRepository.deleteFile(fileId);
  }

  /** PENDING/REJECTED/REMOVED files are only downloadable by their uploader or a moderator/admin - everyone else gets the same 404 as a nonexistent file. */
  async getFileDownloadUrl(
    resourceId: number,
    fileId: number,
    viewer: AuthenticatedUser,
    forceDownload = false,
  ): Promise<string> {
    const file = await this.resourcesRepository.findFile(resourceId, fileId);

    if (!file) {
      throw new NotFoundException("File not found");
    }

    const isVisible =
      file.resource.status === "APPROVED" ||
      viewer.id === file.resource.uploadedBy ||
      viewer.role === "MODERATOR" ||
      viewer.role === "ADMIN";

    if (!isVisible) {
      throw new NotFoundException("File not found");
    }

    if (forceDownload) {
      await this.resourcesRepository.incrementDownloadCount(resourceId);
    }

    // Strip chars that'd break Content-Disposition syntax (user-supplied filename).
    const safeFileName = file.originalFileName.replace(/["\r\n]/g, "");
    const disposition = forceDownload ? "attachment" : "inline";

    return this.azureBlobService.generateSasUrl(file.blobName, {
      contentDisposition: `${disposition}; filename="${safeFileName}"`,
    });
  }

  /** `viewer` is absent for an anonymous request (OptionalClerkAuthGuard). An APPROVED
   * resource is visible to anyone; anything else (PENDING/REJECTED/REMOVED) only to its
   * own uploader or a moderator/admin - everyone else gets the same 404 as a nonexistent
   * resource, so a pending resource's existence can't be probed for. */
  async findResourceById(resourceId: number, viewer?: AuthenticatedUser) {
    const resource = await this.resourcesRepository.findById(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    const isVisible =
      resource.status === "APPROVED" ||
      (viewer && (viewer.id === resource.uploadedBy || viewer.role === "MODERATOR" || viewer.role === "ADMIN"));

    if (!isVisible) {
      throw new NotFoundException("Resource not found");
    }

    return resource;
  }

  findResources(
    filters: { offeringId?: number; userId?: number; q?: string; includeAllStatuses?: boolean },
    pagination: { limit: number; offset: number },
  ) {
    return this.resourcesRepository.findMany(filters, pagination);
  }

  searchSuggestions(q: string, limit: number) {
    return this.resourcesRepository.searchSuggestions(q, limit);
  }

  async findSimilarResources(resourceId: number, limit: number) {
    const resource = await this.resourcesRepository.findOfferingId(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    return this.resourcesRepository.findSimilar(resourceId, resource.offeringId, limit);
  }
}
