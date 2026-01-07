import express from "express"

import * as notesController from "../controllers/notes.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { createNoteSchema, updateNoteSchema } from "../schemas/notes.schema.js";

/**
 * Notes-related routes.
 *
 * Routes:
 * - POST /                      - Create a new note (requires authentication)
 * - PATCH /:noteId              - Update an existing note (requires authentication)
 */
const router = express.Router()

// Create a new note
router.post(
    "/",
    requireAuth,
    validate(createNoteSchema),
    notesController.createNote
)

// Update an existing note
router.patch(
    "/:noteId",
    requireAuth,
    validate(updateNoteSchema),
    notesController.updateNote
)

export default router;