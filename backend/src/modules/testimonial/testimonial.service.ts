import { testimonialRepository } from './testimonial.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, TESTIMONIAL_MESSAGES } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';

export const testimonialService = {
  getAll: async (query: { page?: string; limit?: string; active?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const where: Record<string, any> = {};
    if (query.active === 'true') where.isActive = true;

    const [testimonials, total] = await Promise.all([
      testimonialRepository.findAll(skip, take, where),
      testimonialRepository.count(where),
    ]);
    return { testimonials, meta: getMeta(total, page, limit) };
  },

  create: async (data: any) => {
    return testimonialRepository.create(data);
  },

  update: async (id: string, data: any) => {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, TESTIMONIAL_MESSAGES.NOT_FOUND);
    }
    return testimonialRepository.update(id, data);
  },

  delete: async (id: string) => {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, TESTIMONIAL_MESSAGES.NOT_FOUND);
    }
    await testimonialRepository.delete(id);
  },
};
