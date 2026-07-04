import { resourcesRepository } from "./resources.repository.js";
import type { CreateResourceInput, UpdateResourceInput } from "./resources.dto.js";
import { generateBlobName, uploadToAzure } from "../../utils/azure.js";
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
     * Find resources by subject offering ID or user ID.
     * @param filters - Filters for finding resources.
     * @returns An array of resources matching the filters.
     */
    async findResources(filters: {
        offeringId?: number;
        userId?: number;
    }) {
        return await resourcesRepository.findMany(filters);
    }
}

export const resourcesService = new ResourcesService();
