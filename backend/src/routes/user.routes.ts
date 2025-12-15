import express from "express"

import { apiAuthMiddleware } from "../middleware/apiAuth.middleware.js"
import * as userController from "../controllers/user.controller.js"

/**
 * User-related routes.
 * All routes require authentication.
 *
 * Routes:
 * - GET /me                        - Get the currently authenticated user's profile
 * - GET /:userId                   - Get a user's profile by ID
 * - GET /:userId/notes             - Get all notes uploaded by the user
 * - GET /:userId/notes/recent      - Get notes recently accessed by the user
 * - GET /:userId/notes/archived    - Get notes bookmarked/archived by the user
 */
const router = express.Router()


// All routes require authentication
router.use(apiAuthMiddleware);

// Get current authenticated user
router.get("/me", userController.getCurrentUserProfile);

// Get user profile
router.get("/:userId", userController.getUserProfileById);

// User's uploaded notes
router.get("/:userId/notes", userController.getUserUploadedNotes);

// User's recently accessed notes
router.get("/:userId/notes/recent", userController.getUserRecentlyAccessedNotes);

// User's bookmarked/archived notes
router.get("/:userId/notes/archived", userController.getUserArchivedNotes);

export default router;