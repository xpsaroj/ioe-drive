import { z } from "zod"

import { SemesterEnum, YearEnum } from "../../db/schema.js"

export const getSubjectsSchema = z.object({
    query: z.object({
        programId: z.coerce.number().int().positive("Program ID is required and it must be a positive integer"),
        semester: z.enum(SemesterEnum.enumValues).optional(),
    }),
})

export const getSubjectDetailsSchema = z.object({
    params: z.object({
        subjectId: z.coerce.number().int().positive("Subject ID is required and it must be a positive integer"),
    }),
})

export const getSubjectsForUploadSchema = z.object({
    query: z.object({
        programId: z.coerce.number().int().positive("Program ID is required and it must be a positive integer"),
        year: z.enum(YearEnum.enumValues),
        semester: z.enum(SemesterEnum.enumValues),
    }),
})