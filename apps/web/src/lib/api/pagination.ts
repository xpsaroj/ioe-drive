export interface PaginationParams {
    page?: number;
    limit?: number;
}

/**
 * Mutates and returns `params` with `page`/`limit` set if present, so callers can chain
 * it onto filter params already built for a given endpoint.
 */
export const appendPaginationParams = (
    params: URLSearchParams,
    pagination?: PaginationParams
): URLSearchParams => {
    if (pagination?.page) params.set("page", pagination.page.toString());
    if (pagination?.limit) params.set("limit", pagination.limit.toString());
    return params;
};
