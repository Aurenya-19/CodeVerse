export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export function parsePaginationParams(params: PaginationParams, defaultPageSize = 20): { limit: number; offset: number; page: number } {
  const pageSize = params.pageSize || params.limit || defaultPageSize;
  const page = params.page || (params.offset ? Math.floor(params.offset / pageSize) : 1);
  const limit = Math.min(pageSize, 100); // Cap at 100 for performance
  const offset = (page - 1) * limit;

  return { limit, offset, page };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}
