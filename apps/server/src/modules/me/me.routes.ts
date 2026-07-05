import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js"
import { validate } from "../../middlewares/validate.middleware.js";
import { markResourceAsRecentlyAccessedSchema, markResourceAsBookmarkedSchema, unmarkResourceAsBookmarkedSchema, updateProfileSchema } from "./me.dto.js"
import { meController } from "./me.controller.js";

/**
 * Routes related to the currently authenticated user.
 * All routes require authentication.
 *
 * Routes:
 * - GET /                                                  - Get the currently authenticated user's profile
 * - GET /resources                                         - Get resources uploaded by the current user
 * - GET /recent-resources                                  - Get recently accessed resources by the current user
 * - GET /bookmarked-resources                               - Get bookmarked resources by the current user
 * - GET /bookmarked-resource-ids                            - Get every resource ID bookmarked by the current user
 * - POST /resources/:resourceId/recent                     - Mark a resource as recently accessed by the current user
 * - POST /resources/:resourceId/bookmark                    - Bookmark a resource for the current user
 * - DELETE /resources/:resourceId/bookmark                  - Unbookmark a resource for the current user
 */
const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * Get /api/me
 * - Get the currently authenticated user's profile
 */
router.get(
    "/",
    meController.getCurrentUserProfile.bind(meController)
);

/**
 * PATCH /api/me
 * - Update the currently authenticated user's profile
 */
router.patch(
    "/",
    validate(updateProfileSchema),
    meController.updateProfile.bind(meController)
);

/**
 * Get /api/me/resources
 * - Get resources uploaded by the current user
 */
router.get(
    "/resources",
    meController.getCurrentUserUploadedResources.bind(meController)
);

/**
 * Get /api/me/recent-resources
 * - Get recently accessed resources by the current user
 */
router.get(
    "/recent-resources",
    meController.getCurrentUserRecentResources.bind(meController)
);

/**
 * Get /api/me/bookmarked-resources
 * - Get bookmarked resources by the current user
 */
router.get(
    "/bookmarked-resources",
    meController.getCurrentUserBookmarkedResources.bind(meController)
);

/**
 * Get /api/me/bookmarked-resource-ids
 * - Get every resource ID bookmarked by the current user (uncapped, IDs only)
 */
router.get(
    "/bookmarked-resource-ids",
    meController.getCurrentUserBookmarkedResourceIds.bind(meController)
);

/**
 * POST /api/me/resources/:resourceId/recent
 * - Mark a resource as recently accessed by the current user
 */
router.post(
    "/resources/:resourceId/recent",
    validate(markResourceAsRecentlyAccessedSchema),
    meController.markResourceAsRecentlyAccessed.bind(meController)
);

/**
 * POST /api/me/resources/:resourceId/bookmark
 * - Bookmark a resource for the current user
 */
router.post(
    "/resources/:resourceId/bookmark",
    validate(markResourceAsBookmarkedSchema),
    meController.markResourceAsBookmarked.bind(meController)
);

/**
 * DELETE /api/me/resources/:resourceId/bookmark
 * - Unbookmark a resource for the current user
 */
router.delete(
    "/resources/:resourceId/bookmark",
    validate(unmarkResourceAsBookmarkedSchema),
    meController.unmarkResourceAsBookmarked.bind(meController)
);

export default router;
