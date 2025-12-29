import express from "express"

import { requireAuth } from "../middlewares/auth.middleware.js"
import { validate } from "../middlewares/validate.middleware.js";
import { markNoteAsRecentlyAccessedSchema, markNoteAsArchivedSchema, unmarkNoteAsArchivedSchema } from "../schemas/me.schema.js"
import * as meController from "../controllers/me.controller.js"

/**
 * Routes related to the currently authenticated user.
 * All routes require authentication.
 *
 * Routes:
 * - GET /                                              - Get the currently authenticated user's profile
 * - GET /notes                                         - Get notes uploaded by the current user
 * - GET /recent-notes                                  - Get recently accessed notes by the current user
 * - GET /archived-notes                                - Get bookmarked/archived notes by the current user
 * - POST /notes/:noteId/recent                         - Mark a note as recently accessed by the current user
 * - POST /notes/:noteId/archive                        - Mark a note as bookmarked/archived by the current user
 * - DELETE /notes/:noteId/archive                      - Unmark a note as bookmarked/archived by the current user
 */
const router = express.Router()

// All routes require authentication
router.use(requireAuth);


// Get the currently authenticated user's profile
router.get(
    "/",
    meController.getCurrentUserProfile
);

// Get notes uploaded by the current user
router.get(
    "/notes",
    meController.getCurrentUserUploadedNotes
);

// Get recently accessed notes by the current user
router.get(
    "/recent-notes",
    meController.getCurrentUserRecentlyAccessedNotes
);

// Get bookmarked/archived notes by the current user
router.get(
    "/archived-notes",
    meController.getCurrentUserArchivedNotes
);

// Mark a note as recently accessed by the current user
router.post(
    "/notes/:noteId/recent",
    validate(markNoteAsRecentlyAccessedSchema),
    meController.markNoteAsRecentlyAccessed
);

// Mark a note as bookmarked/archived by the current user
router.post(
    "/notes/:noteId/archive",
    validate(markNoteAsArchivedSchema),
    meController.markNoteAsArchived
);

// Unmark a note as bookmarked/archived by the current user
router.delete(
    "/notes/:noteId/archive",
    validate(unmarkNoteAsArchivedSchema),
    meController.unmarkNoteAsArchived
);

export default router;