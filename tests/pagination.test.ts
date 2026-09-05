import { describe, expect, it } from 'vitest';
import { paginationMeta, parsePagination } from '@/app/lib/pagination';

describe('pagination', () => {
  it('uses defaults and calculates the offset', () => {
    expect(parsePagination({ page: '2' })).toEqual({ page: 2, limit: 20, offset: 20 });
  });

  it('caps limits and produces metadata', () => {
    const pagination = parsePagination({ page: 1, limit: 500 });
    expect(pagination.limit).toBe(100);
    expect(paginationMeta(pagination, 201)).toEqual({ page: 1, limit: 100, total: 201, totalPages: 3 });
  });
});
