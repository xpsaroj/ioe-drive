import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
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
    resourceData: Omit<CreateResourceData, "uploadedBy">,
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

    return this.resourcesRepository.create({ ...resourceData, uploadedBy: userId }, uploadedFiles);
  }

  async updateResource(userId: number, resourceId: number, updateData: UpdateResourceData) {
    const existingResource = await this.resourcesRepository.findById(resourceId);

    if (!existingResource || existingResource.uploadedBy !== userId) {
      throw new NotFoundException("Resource not found");
    }

    return this.resourcesRepository.update(resourceId, userId, updateData);
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
   * non-owner can't probe for a resource's existence. */
  private async assertOwnership(userId: number, resourceId: number): Promise<void> {
    const resource = await this.resourcesRepository.findOwnership(resourceId);

    if (!resource || resource.uploadedBy !== userId) {
      throw new NotFoundException("Resource not found");
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

  /** Any signed-in user can call this for any resource's file - unlike edit/delete,
   * downloading isn't restricted to the resource's uploader. */
  async getFileDownloadUrl(resourceId: number, fileId: number, forceDownload = false): Promise<string> {
    const file = await this.resourcesRepository.findFile(resourceId, fileId);

    if (!file) {
      throw new NotFoundException("File not found");
    }

    // Strip characters that could break the Content-Disposition header's syntax
    // (originalFileName is user-supplied, from whatever the browser reported at
    // upload time).
    const safeFileName = file.originalFileName.replace(/["\r\n]/g, "");
    const disposition = forceDownload ? "attachment" : "inline";

    return this.azureBlobService.generateSasUrl(file.blobName, {
      contentDisposition: `${disposition}; filename="${safeFileName}"`,
    });
  }

  async findResourceById(resourceId: number) {
    const resource = await this.resourcesRepository.findById(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    return resource;
  }

  findResources(
    filters: { offeringId?: number; userId?: number; q?: string },
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
