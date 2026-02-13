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

export const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  bio: z.string().optional(),
  departmentId: z.number().optional(),
  semester: z.enum(["1","2","3","4","5","6","7","8"]).optional(),
  college: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
});

// Type inference for TypeScript
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;