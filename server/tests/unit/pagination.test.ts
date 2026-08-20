import { parsePagination } from '../../src/utils/pagination';

describe('parsePagination', () => {
  it('returns defaults when no params provided', () => {
    const result = parsePagination({});
    expect(result).toEqual({ page: 1, limit: 20, offset: 0 });
  });

  it('calculates offset correctly', () => {
    const result = parsePagination({ page: '3', limit: '10' });
    expect(result).toEqual({ page: 3, limit: 10, offset: 20 });
  });

  it('clamps limit to 100', () => {
    const result = parsePagination({ limit: '999' });
    expect(result.limit).toBe(100);
  });

  it('clamps page minimum to 1', () => {
    const result = parsePagination({ page: '-5' });
    expect(result.page).toBe(1);
  });

  it('handles invalid strings gracefully', () => {
    const result = parsePagination({ page: 'abc', limit: 'xyz' });
    expect(result).toEqual({ page: 1, limit: 20, offset: 0 });
  });
});
