import { PAGINATION } from '../constants';

interface PaginationParams {
  page?: string | number;
  limit?: string | number;
}

interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export const getPagination = (params: PaginationParams): PaginationResult => {
  const page = Math.max(Number(params.page) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(Number(params.limit) || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT
  );

  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
};

export const getMeta = (total: number, page: number, limit: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
