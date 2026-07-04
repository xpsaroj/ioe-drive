import { Router } from "express";

import { resourcesController } from "./resources.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.js";
import { createResourceSchema, updateResourceSchema, getResourceByIdSchema, getResourcesSchema, removeResourceFileSchema, getFileDownloadUrlSchema } from "./resources.dto.js";

/**
 * Resources-related routes.
 *
 * Routes:
 * - POST /                              - Create a new resource (requires authentication)
 * - PATCH /:resourceId                  - Update an existing resource (requires authentication)
 * - DELETE /:resourceId                 - Delete an existing resource (requires authentication)
 * - POST /:resourceId/files             - Add files to an existing resource (requires authentication)
 * - DELETE /:resourceId/files/:fileId   - Remove a file from a resource (requires authentication)
 * - GET /:resourceId/files/:fileId/download-url - Get a short-lived signed download URL (requires authentication)
 */
const router = Router();

/**
 * POST /api/resources
 * - Create a new resource (requires authentication)
 */
router.post(
    "/",
    requireAuth,
    upload.array("resourceFile", 5), // Max 5 files
    validate(createResourceSchema),
    resourcesController.createResource.bind(resourcesController)
)

/**
 * PATCH /api/resources/:resourceId
 * - Update an existing resource (requires authentication)
 */
router.patch(
    "/:resourceId",
    requireAuth,
    validate(updateResourceSchema),
    resourcesController.updateResource.bind(resourcesController)
)

/**
 * DELETE /api/resources/:resourceId
 * - Delete an existing resource (requires authentication)
 */
router.delete(
    "/:resourceId",
    requireAuth,
    validate(getResourceByIdSchema),
    resourcesController.deleteResource.bind(resourcesController)
)

/**
 * POST /api/resources/:resourceId/files
 * - Add files to an existing resource (requires authentication)
 */
router.post(
    "/:resourceId/files",
    requireAuth,
    upload.array("resourceFile", 5), // Max 5 files per request
    validate(getResourceByIdSchema),
    resourcesController.addResourceFiles.bind(resourcesController)
)

/**
 * DELETE /api/resources/:resourceId/files/:fileId
 * - Remove a file from a resource (requires authentication)
 */
router.delete(
    "/:resourceId/files/:fileId",
    requireAuth,
    validate(removeResourceFileSchema),
    resourcesController.removeResourceFile.bind(resourcesController)
)

/**
 * GET /api/resources/:resourceId/files/:fileId/download-url
 * - Get a short-lived signed download URL for a file (requires authentication - any
 *   signed-in user, not just the resource's uploader)
 */
router.get(
    "/:resourceId/files/:fileId/download-url",
    requireAuth,
    validate(getFileDownloadUrlSchema),
    resourcesController.getFileDownloadUrl.bind(resourcesController)
)

/**
 * GET /api/resources/:resourceId
 * - Get resource details by resource ID
 */
router.get(
    "/:resourceId",
    validate(getResourceByIdSchema),
    resourcesController.getResourceById.bind(resourcesController)
)

/**
 * GET /api/resources?offeringId=<offeringId>&userId=<userId>
 * - Get resources by subject offering ID
 */
router.get(
    "/",
    validate(getResourcesSchema),
    resourcesController.getResources.bind(resourcesController)
)

export default router;
