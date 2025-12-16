import express from "express"

import { requireAuth } from "../middleware/auth.middleware.js"
import * as notesController from "../controllers/notes.controller.js"

/**
 * Notes-related routes.
 * All routes require authentication.
 *
 * Routes:
 * - POST /:noteId/recent                        - Mark a note as recently accessed
 * - POST /:noteId/archive                       - Mark a note as bookmarked/archived
 */
const router = express.Router()

// All routes require authentication
router.use(requireAuth);

// Mark a note as recently accessed
router.post("/:noteId/recent", notesController.markNoteAsRecentlyAccessed);

// Mark a note as bookmarked/archived
router.post("/:noteId/archive", notesController.markNoteAsArchived);

export default router;