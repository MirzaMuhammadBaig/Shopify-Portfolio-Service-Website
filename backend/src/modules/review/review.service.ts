import { reviewRepository } from './review.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, REVIEW_MESSAGES } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';
import { sendReviewNotificationEmail } from '../../utils/email';

export const reviewService = {
  getAll: async (query: { page?: string; limit?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const [reviews, total] = await Promise.all([
      reviewRepository.findAll(skip, take, { isVisible: true }),
      reviewRepository.count({ isVisible: true }),
    ]);
    return { reviews, meta: getMeta(total, page, limit) };
  },

  getAdminAll: async (query: { page?: string; limit?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const [reviews, total] = await Promise.all([
      reviewRepository.findAll(skip, take),
      reviewRepository.count(),
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

  getByUser: async (userId: string, query: { page?: string; limit?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const [reviews, total] = await Promise.all([
      reviewRepository.findByUserId(userId, skip, take),
      reviewRepository.countByUser(userId),
    ]);
    return { reviews, meta: getMeta(total, page, limit) };
  },

  create: async (data: {
    userId: string;
    serviceId: string;
    rating: number;
    comment?: string;
  }) => {
    // Check duplicate per service
    const existing = await reviewRepository.findByUserAndService(data.userId, data.serviceId);
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, REVIEW_MESSAGES.ALREADY_REVIEWED);
    }

    // Daily limit: 1 review per day
    const todayCount = await reviewRepository.countByUserToday(data.userId);
    if (todayCount >= 1) {
      throw new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, 'You can only submit one review per day');
    }

    const review = await reviewRepository.create(data);

    // Send thank-you email to user
    if (review.user?.email) {
      sendReviewNotificationEmail({
        to: review.user.email,
        recipientName: review.user.firstName || 'Customer',
        serviceName: review.service?.title || 'our service',
        rating: review.rating,
        comment: review.comment || '',
        reviewerName: `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim(),
        reviewerEmail: review.user.email,
        isAdmin: false,
      }).catch((err) => console.error('Failed to send review email to user:', err));
    }

    // Send notification email to admin
    sendReviewNotificationEmail({
      to: 'webdev.muhammad@gmail.com',
      recipientName: 'Admin',
      serviceName: review.service?.title || 'a service',
      rating: review.rating,
      comment: review.comment || '',
      reviewerName: `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim(),
      reviewerEmail: review.user?.email || '',
      isAdmin: true,
    }).catch((err) => console.error('Failed to send review email to admin:', err));

    return review;
  },

  update: async (id: string, userId: string, data: { rating?: number; comment?: string }) => {
    const review = await reviewRepository.findById(id);
    if (!review) throw new ApiError(HTTP_STATUS.NOT_FOUND, REVIEW_MESSAGES.NOT_FOUND);
    if (review.user.id !== userId) throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Cannot update this review');

    // Edit limit: 1 edit per review
    if (review.editCount >= 1) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only edit your review once');
    }

    return reviewRepository.update(id, { ...data, editCount: review.editCount + 1 });
  },

  // Admin update — no ownership check, no editCount increment, no email
  adminUpdate: async (id: string, data: { rating?: number; comment?: string }) => {
    const review = await reviewRepository.findById(id);
    if (!review) throw new ApiError(HTTP_STATUS.NOT_FOUND, REVIEW_MESSAGES.NOT_FOUND);
    return reviewRepository.update(id, data);
  },

  // Admin delete — no ownership check, no email
  adminDelete: async (id: string) => {
    const review = await reviewRepository.findById(id);
    if (!review) throw new ApiError(HTTP_STATUS.NOT_FOUND, REVIEW_MESSAGES.NOT_FOUND);
    await reviewRepository.delete(id);
  },

  delete: async (id: string, userId: string, isAdmin: boolean) => {
    const review = await reviewRepository.findById(id);
    if (!review) throw new ApiError(HTTP_STATUS.NOT_FOUND, REVIEW_MESSAGES.NOT_FOUND);
    if (!isAdmin && review.user.id !== userId) throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Cannot delete this review');
    await reviewRepository.delete(id);
  },

  toggleVisibility: async (id: string) => {
    const review = await reviewRepository.findById(id);
    if (!review) throw new ApiError(HTTP_STATUS.NOT_FOUND, REVIEW_MESSAGES.NOT_FOUND);
    return reviewRepository.toggleVisibility(id, !review.isVisible);
  },
};
