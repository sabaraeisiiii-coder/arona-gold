import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '@/app/constants/foundation';

export type Pagination = { page: number; limit: number; offset: number };
export type PaginationMeta = { page: number; limit: number; total: number; totalPages: number };

function positiveInteger(value: unknown, fallback: number): number {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return typeof parsed === 'number' && Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function parsePagination(input: { page?: unknown; limit?: unknown }): Pagination {
  const page = positiveInteger(input.page, DEFAULT_PAGE);
  const limit = Math.min(positiveInteger(input.limit, DEFAULT_PAGE_LIMIT), MAX_PAGE_LIMIT);
  return { page, limit, offset: (page - 1) * limit };
}

export function paginationMeta(pagination: Pick<Pagination, 'page' | 'limit'>, total: number): PaginationMeta {
  return {
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / pagination.limit),
  };
}
