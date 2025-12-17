import express from "express"

import { requireAuth } from "../middleware/auth.middleware.js"
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


// Get a user's profile
router.get("/:userId", userController.getUserProfileById);

export default router;