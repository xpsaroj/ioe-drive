import { z } from "zod"

export const markResourceAsRecentlyAccessedSchema = z.object({
    params: z.object({
        resourceId: z.coerce.number().int().positive("Resource ID must be a positive integer"),
    }),
})

export const markResourceAsBookmarkedSchema = z.object({
    params: z.object({
        resourceId: z.coerce.number().int().positive("Resource ID must be a positive integer"),
    }),
})

export const unmarkResourceAsBookmarkedSchema = z.object({
    params: z.object({
        resourceId: z.coerce.number().int().positive("Resource ID must be a positive integer"),
    }),
})

export const updateProfileSchema = z.object({
    body: z.object({
        bio: z.string().optional(),
        programId: z.number().optional(),
        semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]).optional(),
        college: z.string().optional(),
    })
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
