import type { NextFunction, Request, Response } from "express";

import { resourcesService } from "./resources.service.js";
import { sendSuccessResponse } from "../../lib/response.js";
import { UnauthorizedError } from "../../lib/errors.js";
import type { CreateResourceInput, UpdateResourceInput } from "./resources.dto.js";

/**
 * Resources Controller
 * - Handles HTTP requests related to resources.
 */
export class ResourcesController {
    /**
     * Create a new resource.
     * - POST /api/resources
     */
    async createResource(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const resourceData: Omit<CreateResourceInput, 'uploadedBy'> = req.body;
            const resourceFiles = req.files as Express.Multer.File[];

            const createdResource = await resourcesService.createResource(userId, resourceData, resourceFiles);
            return sendSuccessResponse(res, createdResource, "Resource created successfully", 201);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Update an existing resource.
     * - PATCH /api/resources/:resourceId
     */
    async updateResource(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const resourceId = Number(req.params.resourceId);
            const updateData: UpdateResourceInput = req.body;

            const updatedResource = await resourcesService.updateResource(userId, resourceId, updateData);
            return sendSuccessResponse(res, updatedResource, "Resource updated successfully");
        } catch (e) {
            next(e);
        }
    }

    /**
     * Delete an existing resource.
     * - DELETE /api/resources/:resourceId
     */
    async deleteResource(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const resourceId = Number(req.params.resourceId);

            await resourcesService.deleteResource(userId, resourceId);
            return sendSuccessResponse(res, null, "Resource deleted successfully");
        } catch (e) {
            next(e);
        }
    }

    /**
     * Add one or more files to an existing resource.
     * - POST /api/resources/:resourceId/files
     */
    async addResourceFiles(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const resourceId = Number(req.params.resourceId);
            const files = req.files as Express.Multer.File[];

            await resourcesService.addResourceFiles(userId, resourceId, files);
            return sendSuccessResponse(res, null, "Files added successfully");
        } catch (e) {
            next(e);
        }
    }

    /**
     * Remove a single file from a resource.
     * - DELETE /api/resources/:resourceId/files/:fileId
     */
    async removeResourceFile(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const resourceId = Number(req.params.resourceId);
            const fileId = Number(req.params.fileId);

            await resourcesService.removeResourceFile(userId, resourceId, fileId);
            return sendSuccessResponse(res, null, "File removed successfully");
        } catch (e) {
            next(e);
        }
    }

    /**
     * Get resource details by resource ID.
     * - GET /api/resources/:resourceId
     */
    async getResourceById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const resourceId = Number(req.params.resourceId);
            const resource = await resourcesService.findResourceById(resourceId);
            return sendSuccessResponse(res, resource);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Get all resources filtered by subject offering ID or user ID.
     * - GET /api/resources?offeringId=<offeringId>&userId=<userId>
     */
    async getResources(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const filters: { offeringId?: number; userId?: number } = {};

            if (req.query.offeringId) {
                filters.offeringId = Number(req.query.offeringId);
            }

            if (req.query.userId) {
                filters.userId = Number(req.query.userId);
            }

            const resources = await resourcesService.findResources(filters);

            return sendSuccessResponse(res, resources);
        } catch (e) {
            next(e);
        }
    }
}

export const resourcesController = new ResourcesController();
