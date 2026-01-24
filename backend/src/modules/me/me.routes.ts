import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js"
import { validate } from "../../middlewares/validate.middleware.js";
import { markNoteAsRecentlyAccessedSchema, markNoteAsArchivedSchema, unmarkNoteAsArchivedSchema } from "./me.dto.js"
import { meController } from "./me.controller.js";

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
 * Get /api/me/notes
 * - Get notes uploaded by the current user
 */
router.get(
    "/notes",
    meController.getCurrentUserUploadedNotes.bind(meController)
);

/**
 * Get /api/me/recent-notes
 * - Get recently accessed notes by the current user
 */
router.get(
    "/recent-notes",
    meController.getCurrentUserRecentNotes.bind(meController)
);

/** 
 * Get /api/me/archived-notes
 * - Get bookmarked/archived notes by the current user
 */
router.get(
    "/archived-notes",
    meController.getCurrentUserArchivedNotes.bind(meController)
);

/**
 * POST /api/me/notes/:noteId/recent
 * - Mark a note as recently accessed by the current user
 */
router.post(
    "/notes/:noteId/recent",
    validate(markNoteAsRecentlyAccessedSchema),
    meController.markNoteAsRecentlyAccessed.bind(meController)
);

/**
 * POST /api/me/notes/:noteId/archive
 * - Mark a note as bookmarked/archived by the current user
 */
router.post(
    "/notes/:noteId/archive",
    validate(markNoteAsArchivedSchema),
    meController.markNoteAsArchived.bind(meController)
);

/**
 * DELETE /api/me/notes/:noteId/archive
 * - Unmark a note as bookmarked/archived by the current user
 */
router.delete(
    "/notes/:noteId/archive",
    validate(unmarkNoteAsArchivedSchema),
    meController.unmarkNoteAsArchived.bind(meController)
);

export default router;