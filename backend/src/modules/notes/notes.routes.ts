import { Router } from "express";

import { notesController } from "./notes.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { createNoteSchema, updateNoteSchema } from "./notes.dto.js";

/**
 * Notes-related routes.
 *
 * Routes:
 * - POST /                      - Create a new note (requires authentication)
 * - PATCH /:noteId              - Update an existing note (requires authentication)
 */
const router = Router();

/**
 * POST /api/notes
 * - Create a new note (requires authentication)
 */
router.post(
    "/",
    requireAuth,
    validate(createNoteSchema),
    notesController.createNote.bind(notesController)
)

/**
 * PATCH /api/notes/:noteId
 * - Update an existing note (requires authentication)
 */
router.patch(
    "/:noteId",
    requireAuth,
    validate(updateNoteSchema),
    notesController.updateNote.bind(notesController)
)

export default router;