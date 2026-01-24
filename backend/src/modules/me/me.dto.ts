import { z } from "zod"

export const markNoteAsRecentlyAccessedSchema = z.object({
    params: z.object({
        noteId: z.coerce.number().int().positive("Note ID must be a positive integer"),
    }),
})

export const markNoteAsArchivedSchema = z.object({
    params: z.object({
        noteId: z.coerce.number().int().positive("Note ID must be a positive integer"),
    }),
})

export const unmarkNoteAsArchivedSchema = z.object({
    params: z.object({
        noteId: z.coerce.number().int().positive("Note ID must be a positive integer"),
    }),
})