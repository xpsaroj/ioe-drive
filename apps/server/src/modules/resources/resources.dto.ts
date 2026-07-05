import { z } from "zod";

import { ResourceTypeEnum } from "../../db/schema.js";
import { paginationQueryShape } from "../../lib/pagination.js";

export const createResourceSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        description: z.string().min(10, "Description must be at least 10 characters long"),
        type: z.enum(ResourceTypeEnum.enumValues),
        offeringId: z.coerce
            .number()
            .int()
            .positive("Subject Offering ID must be a positive integer"),
    }),
});

export const updateResourceSchema = z.object({
    params: z.object({
        resourceId: z.coerce
            .number()
            .int()
            .positive("Resource ID must be a positive integer"),
    }),
    body: z.object({
        title: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        type: z.enum(ResourceTypeEnum.enumValues).optional(),
        offeringId: z.coerce.number().int().positive().optional(),
    }).refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field must be provided for update" }
    ),
});

export const getResourceByIdSchema = z.object({
    params: z.object({
        resourceId: z.coerce
            .number()
            .int()
            .positive("Resource ID must be a positive integer"),
    }),
});

export const removeResourceFileSchema = z.object({
    params: z.object({
        resourceId: z.coerce
            .number()
            .int()
            .positive("Resource ID must be a positive integer"),
        fileId: z.coerce
            .number()
            .int()
            .positive("File ID must be a positive integer"),
    }),
});

export const getFileDownloadUrlSchema = z.object({
    params: z.object({
        resourceId: z.coerce
            .number()
            .int()
            .positive("Resource ID must be a positive integer"),
        fileId: z.coerce
            .number()
            .int()
            .positive("File ID must be a positive integer"),
    }),
    query: z.object({
        // Not z.coerce.boolean() - that coerces any non-empty string (including
        // the string "false") to true, since Boolean("false") is true in JS.
        download: z.enum(["true", "false"]).optional(),
    }),
});

export const getResourcesSchema = z.object({
    query: z.object({
        offeringId: z.coerce
            .number()
            .int()
            .positive("Subject Offering ID must be a positive integer")
            .optional(),

        userId: z.coerce
            .number()
            .int()
            .positive("User ID must be a positive integer")
            .optional(),

        ...paginationQueryShape,
    }).refine(
        (data) => data.offeringId || data.userId,
        {
            message: "Either offeringId or userId must be provided",
        }
    ),
});


export type CreateResourceInput = z.infer<typeof createResourceSchema>["body"] & { uploadedBy: number };
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>["body"];
