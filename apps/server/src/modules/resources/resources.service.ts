import { resourcesRepository } from "./resources.repository.js";
import type { CreateResourceInput, UpdateResourceInput } from "./resources.dto.js";
import { generateBlobName, uploadToAzure, deleteFromAzure, generateSasUrl } from "../../utils/azure.js";
import { NotFoundError } from "../../lib/errors.js";
import { db } from "../../db/index.js";

/**
 * Resources Service
 * - Contains business logic related to resources.
 */
export class ResourcesService {
    /**
     * Create a new resource.
     * @param userId - ID of the user creating the resource.
     * @param resourceData - Data for the new resource.
     * @returns The created resource.
     */
    async createResource(userId: number, resourceData: Omit<CreateResourceInput, 'uploadedBy'>, resourceFiles: Express.Multer.File[]) {
        const existingSubject = await db
            .query.subjectOfferingsTable
            .findFirst({
                where: (fields, { eq }) => eq(fields.id, resourceData.offeringId),
                columns: {
                    id: true,
                }
            })

        if (!existingSubject) {
            throw new NotFoundError("Subject offering not found");
        }

        const resourceToCreate = {
            ...resourceData,
            uploadedBy: userId,
        };

        const uploadedFiles = await Promise.all(
            resourceFiles.map(async (file) => {
                const blobName = await generateBlobName(file.originalname);

                const fileUrl = await uploadToAzure(
                    file.buffer,
                    blobName,
                    file.mimetype
                );

                return {
                    blobName,
                    url: fileUrl,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                }
            })
        )

        return await resourcesRepository.create(resourceToCreate, uploadedFiles);
    }

    /**
     * Update an existing resource.
     * @param userId - ID of the user updating the resource.
     * @param resourceId - ID of the resource to update.
     * @param updateData - Data to update the resource with.
     * @returns The updated resource.
     */
    async updateResource(userId: number, resourceId: number, updateData: UpdateResourceInput) {
        const existingResource = await resourcesRepository.findById(resourceId);

        if (!existingResource) {
            throw new NotFoundError("Resource not found");
        }

        if (existingResource.uploadedBy !== userId) {
            throw new NotFoundError("Resource not found");
        }

        return await resourcesRepository.update(resourceId, userId, updateData);
    }

    /**
     * Delete an existing resource, along with its attached files in Azure Blob Storage.
     * @param userId - ID of the user requesting the deletion.
     * @param resourceId - ID of the resource to delete.
     */
    async deleteResource(userId: number, resourceId: number) {
        const existingResource = await resourcesRepository.findForDeletion(resourceId);

        if (!existingResource) {
            throw new NotFoundError("Resource not found");
        }

        if (existingResource.uploadedBy !== userId) {
            throw new NotFoundError("Resource not found");
        }

        await Promise.all(
            existingResource.files.map((file) => deleteFromAzure(file.blobName))
        );

        await resourcesRepository.delete(resourceId);
    }

    /**
     * Verify that a resource exists and is owned by the given user. Shared by every
     * action below that mutates an existing resource or its files.
     * @param userId - ID of the user attempting the action.
     * @param resourceId - ID of the resource being acted on.
     */
    private async assertOwnership(userId: number, resourceId: number) {
        const resource = await resourcesRepository.findOwnership(resourceId);

        if (!resource) {
            throw new NotFoundError("Resource not found");
        }

        if (resource.uploadedBy !== userId) {
            throw new NotFoundError("Resource not found");
        }
    }

    /**
     * Upload and attach one or more files to an existing resource.
     * @param userId - ID of the user requesting the change.
     * @param resourceId - ID of the resource to attach the files to.
     * @param files - The uploaded files.
     */
    async addResourceFiles(userId: number, resourceId: number, files: Express.Multer.File[]) {
        await this.assertOwnership(userId, resourceId);

        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const blobName = await generateBlobName(file.originalname);

                const fileUrl = await uploadToAzure(
                    file.buffer,
                    blobName,
                    file.mimetype
                );

                return {
                    blobName,
                    url: fileUrl,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                }
            })
        );

        await resourcesRepository.addFiles(resourceId, uploadedFiles);
    }

    /**
     * Remove a single file from a resource, deleting it from Azure Blob Storage too.
     * @param userId - ID of the user requesting the change.
     * @param resourceId - ID of the resource the file belongs to.
     * @param fileId - ID of the file to remove.
     */
    async removeResourceFile(userId: number, resourceId: number, fileId: number) {
        await this.assertOwnership(userId, resourceId);

        const file = await resourcesRepository.findFile(resourceId, fileId);

        if (!file) {
            throw new NotFoundError("File not found");
        }

        await deleteFromAzure(file.blobName);
        await resourcesRepository.deleteFile(fileId);
    }

    /**
     * Get a short-lived signed URL for downloading/previewing a file. Any signed-in
     * user can call this for any resource's file (unlike edit/delete, downloading
     * isn't restricted to the resource's uploader - resources are meant to be shared).
     * @param resourceId - ID of the resource the file belongs to.
     * @param fileId - ID of the file to generate a URL for.
     * @param forceDownload - When true, the URL prompts a save-as download under the
     *   file's original name; when false, it's suitable for inline display (e.g. in an
     *   <img>/<iframe>) while still carrying the original name as a hint.
     * @returns A signed URL, valid for a short time.
     */
    async getFileDownloadUrl(resourceId: number, fileId: number, forceDownload = false) {
        const file = await resourcesRepository.findFile(resourceId, fileId);

        if (!file) {
            throw new NotFoundError("File not found");
        }

        // Strip characters that could break the Content-Disposition header's syntax
        // (originalFileName is user-supplied, from whatever the browser reported at
        // upload time).
        const safeFileName = file.originalFileName.replace(/["\r\n]/g, "");
        const disposition = forceDownload ? "attachment" : "inline";

        return await generateSasUrl(file.blobName, {
            contentDisposition: `${disposition}; filename="${safeFileName}"`,
        });
    }

    /**
     * Find a resource by its ID.
     * @param resourceId - ID of the resource to find.
     * @returns The found resource.
     */
    async findResourceById(resourceId: number) {
        const resource = await resourcesRepository.findById(resourceId);

        if (!resource) {
            throw new NotFoundError("Resource not found");
        }

        return resource;
    }

    /**
     * Find resources by subject offering ID or user ID, paginated.
     * @param filters - Filters for finding resources.
     * @param pagination - Limit/offset to apply.
     * @returns The page of matching resources plus the total count matching the filters.
     */
    async findResources(
        filters: {
            offeringId?: number;
            userId?: number;
        },
        pagination: { limit: number; offset: number }
    ) {
        return await resourcesRepository.findMany(filters, pagination);
    }
}

export const resourcesService = new ResourcesService();
