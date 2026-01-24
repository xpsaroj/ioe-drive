import { z } from "zod"

export const getUserProfileByIdSchema = z.object({
    params: z.object({
        userId: z.coerce.number().int().positive("User ID is required and it must be a positive integer"),
    }),
})