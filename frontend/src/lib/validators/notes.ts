import { z } from "zod";

export const createNoteSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
    description: z.string().max(1000, "Description must be at most 1000 characters"),
    subjectId: z.number().int().positive("Subject ID must be a positive integer"),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = Partial<CreateNoteInput>;