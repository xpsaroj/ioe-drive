import { Router } from "express"

import { requireAuth } from "../../middlewares/auth.middleware.js"
import { validate } from "../../middlewares/validate.middleware.js"
import { getUserProfileByIdSchema } from "./user.dto.js"
import { userController } from "./user.controller.js"

/**
 * User-related routes.
 * All routes require authentication.
 *
 * Routes:
 * - GET /:userId                   - Get a user's profile by ID
 */
const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * Get /api/users/:userId
 * - Get a user's profile by ID
 */
router.get(
    "/:userId",
    validate(getUserProfileByIdSchema),
    userController.getUserProfileById.bind(userController)
);

export default router;