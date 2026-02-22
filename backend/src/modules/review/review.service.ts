import { reviewRepository } from './review.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, REVIEW_MESSAGES } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';

export const reviewService = {
  getAll: async (query: { page?: string; limit?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const [reviews, total] = await Promise.all([
      reviewRepository.findAll(skip, take, { isVisible: true }),
      reviewRepository.count({ isVisible: true }),
    ]);
    return { reviews, meta: getMeta(total, page, limit) };
  },

  getByService: async (serviceId: string, query: { page?: string; limit?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const [reviews, total] = await Promise.all([
      reviewRepository.findByService(serviceId, skip, take),
      reviewRepository.countByService(serviceId),
    ]);
    return { reviews, meta: getMeta(total, page, limit) };
  },

  create: async (data: {
    userId: string;
    serviceId: string;
    rating: number;
    comment?: string;
  }) => {
    const existing = await reviewRepository.findByUserAndService(data.userId, data.serviceId);
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, REVIEW_MESSAGES.ALREADY_REVIEWED);
    }
    return reviewRepository.create(data);
  },

  update: async (id: string, userId: string, data: { rating?: number; comment?: string }) => {
    const review = await reviewRepository.findById(id);
    if (!review) throw new ApiError(HTTP_STATUS.NOT_FOUND, REVIEW_MESSAGES.NOT_FOUND);
    if (review.user.id !== userId) throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Cannot update this review');
    return reviewRepository.update(id, data);
  },

  delete: async (id: string, userId: string, isAdmin: boolean) => {
    const review = await reviewRepository.findById(id);
    if (!review) throw new ApiError(HTTP_STATUS.NOT_FOUND, REVIEW_MESSAGES.NOT_FOUND);
    if (!isAdmin && review.user.id !== userId) throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Cannot delete this review');
    await reviewRepository.delete(id);
  },
};
