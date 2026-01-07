import { z } from "zod";

export const createNoteSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        description: z.string().min(10, "Description must be at least 10 characters long"),
        subjectId: z.coerce
            .number()
            .int()
            .positive("Subject ID must be a positive integer"),
    }),
});

export const updateNoteSchema = z.object({
    params: z.object({
        noteId: z.coerce
            .number()
            .int()
            .positive("Note ID must be a positive integer"),
    }),
    body: z.object({
        title: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        subjectId: z.coerce.number().int().positive().optional(),
    }).refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field must be provided for update" }
    ),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>["body"];
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>["body"];