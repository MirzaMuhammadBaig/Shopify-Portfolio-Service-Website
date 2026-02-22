import { serviceRepository } from './service.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, SERVICE_MESSAGES } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';
import { generateSlug } from '../../utils/slug';

export const serviceService = {
  getAll: async (query: { page?: string; limit?: string; active?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const where: Record<string, any> = {};
    if (query.active === 'true') where.isActive = true;

    const [services, total] = await Promise.all([
      serviceRepository.findAll(skip, take, where),
      serviceRepository.count(where),
    ]);
    return { services, meta: getMeta(total, page, limit) };
  },

  getBySlug: async (slug: string) => {
    const service = await serviceRepository.findBySlug(slug);
    if (!service) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, SERVICE_MESSAGES.NOT_FOUND);
    }
    return service;
  },

  getById: async (id: string) => {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, SERVICE_MESSAGES.NOT_FOUND);
    }
    return service;
  },

  getFeatured: async () => serviceRepository.findFeatured(),

  create: async (data: {
    title: string;
    description: string;
    shortDesc: string;
    price: number;
    features?: any;
    icon?: string;
    image?: string;
    isFeatured?: boolean;
    sortOrder?: number;
  }) => {
    const allSlugs = await serviceRepository.findAllSlugs();
    const slug = generateSlug(data.title);
    const existingSlugs = allSlugs.map((s: { slug: string }) => s.slug);
    let finalSlug = slug;
    let counter = 1;
    while (existingSlugs.includes(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    return serviceRepository.create({ ...data, slug: finalSlug });
  },

  update: async (id: string, data: any) => {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, SERVICE_MESSAGES.NOT_FOUND);
    }

    if (data.title && data.title !== service.title) {
      const allSlugs = await serviceRepository.findAllSlugs();
      const existingSlugs = allSlugs.filter((s: { slug: string }) => s.slug !== service.slug).map((s: { slug: string }) => s.slug);
      let slug = generateSlug(data.title);
      let counter = 1;
      while (existingSlugs.includes(slug)) {
        slug = `${generateSlug(data.title)}-${counter}`;
        counter++;
      }
      data.slug = slug;
    }

    return serviceRepository.update(id, data);
  },

  delete: async (id: string) => {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, SERVICE_MESSAGES.NOT_FOUND);
    }
    await serviceRepository.delete(id);
  },
};
