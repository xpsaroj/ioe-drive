import { Router } from "express";

import { resourcesController } from "./resources.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.js";
import { createResourceSchema, updateResourceSchema, getResourceByIdSchema, getResourcesSchema } from "./resources.dto.js";

/**
 * Resources-related routes.
 *
 * Routes:
 * - POST /                      - Create a new resource (requires authentication)
 * - PATCH /:resourceId          - Update an existing resource (requires authentication)
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
