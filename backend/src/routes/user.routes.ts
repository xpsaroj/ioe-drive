import express from "express"

import { requireAuth } from "../middlewares/auth.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { getUserProfileByIdSchema } from "../schemas/users.schema.js"
import * as userController from "../controllers/user.controller.js"

/**
 * User-related routes.
 * All routes require authentication.
 *
 * Routes:
 * - GET /:userId                   - Get a user's profile by ID
 */
const router = express.Router()

// All routes require authentication
router.use(requireAuth);


// Get a user's profile by ID
router.get("/:userId",
    validate(getUserProfileByIdSchema),
    userController.getUserProfileById
);

export default router;