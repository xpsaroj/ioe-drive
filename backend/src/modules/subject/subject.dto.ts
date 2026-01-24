import { z } from "zod"

import { SemesterEnum } from "../../db/schema.js"

export const getSubjectsSchema = z.object({
    query: z.object({
        departmentId: z.coerce.number().int().positive("Department ID is required and it must be a positive integer"),
        semester: z.enum(SemesterEnum.enumValues).optional(),
    }),
})

export const getSubjectDetailsSchema = z.object({
    params: z.object({
        subjectId: z.coerce.number().int().positive("Subject ID is required and it must be a positive integer"),
    }),
})