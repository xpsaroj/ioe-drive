import { z } from "zod";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/**
 * Shared query-param shape for any paginated list endpoint. Spread this into a
 * route's own `query` schema, e.g. `z.object({ query: z.object({ ...paginationQueryShape, offeringId: ... }) })`.
 */
export const paginationQueryShape = {
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(MAX_LIMIT).optional(),
};

export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}

/**
 * Derives page/limit/offset from raw (already Zod-validated, but not reassigned onto
 * req.query - see validate.middleware.ts) query values. Mirrors this codebase's existing
 * pattern of re-coercing req.query in the controller rather than trusting middleware to
 * have mutated it.
 */
export const parsePagination = (query: {
    page?: unknown;
    limit?: unknown;
}): PaginationParams => {
    const page = query.page ? Math.max(1, Number(query.page)) : DEFAULT_PAGE;
    const limit = query.limit
        ? Math.min(Math.max(1, Number(query.limit)), MAX_LIMIT)
        : DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
};

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export const buildPaginationMeta = (
    page: number,
    limit: number,
    total: number
): PaginationMeta => {
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};
