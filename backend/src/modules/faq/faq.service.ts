import { faqRepository } from './faq.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, FAQ_MESSAGES } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';

export const faqService = {
  getAll: async (query: { page?: string; limit?: string; active?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const where: Record<string, any> = {};
    if (query.active === 'true') where.isActive = true;

    const [faqs, total] = await Promise.all([
      faqRepository.findAll(skip, take, where),
      faqRepository.count(where),
    ]);
    return { faqs, meta: getMeta(total, page, limit) };
  },

  create: async (data: any) => {
    return faqRepository.create(data);
  },

  update: async (id: string, data: any) => {
    const faq = await faqRepository.findById(id);
    if (!faq) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, FAQ_MESSAGES.NOT_FOUND);
    }
    return faqRepository.update(id, data);
  },

  delete: async (id: string) => {
    const faq = await faqRepository.findById(id);
    if (!faq) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, FAQ_MESSAGES.NOT_FOUND);
    }
    await faqRepository.delete(id);
  },
};
