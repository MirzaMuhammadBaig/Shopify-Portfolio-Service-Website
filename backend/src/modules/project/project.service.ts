import { projectRepository } from './project.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, PROJECT_MESSAGES } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';
import { generateSlug } from '../../utils/slug';

export const projectService = {
  getAll: async (query: { page?: string; limit?: string; active?: string; category?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const where: Record<string, any> = {};
    if (query.active === 'true') where.isActive = true;
    if (query.category) where.category = query.category;

    const [projects, total] = await Promise.all([
      projectRepository.findAll(skip, take, where),
      projectRepository.count(where),
    ]);
    return { projects, meta: getMeta(total, page, limit) };
  },

  getBySlug: async (slug: string) => {
    const project = await projectRepository.findBySlug(slug);
    if (!project) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, PROJECT_MESSAGES.NOT_FOUND);
    }
    return project;
  },

  getFeatured: async () => projectRepository.findFeatured(),

  create: async (data: any) => {
    const allSlugs = await projectRepository.findAllSlugs();
    const slug = generateSlug(data.title);
    const existingSlugs = allSlugs.map((s: { slug: string }) => s.slug);
    let finalSlug = slug;
    let counter = 1;
    while (existingSlugs.includes(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    return projectRepository.create({ ...data, slug: finalSlug });
  },

  update: async (id: string, data: any) => {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, PROJECT_MESSAGES.NOT_FOUND);
    }

    if (data.title && data.title !== project.title) {
      const allSlugs = await projectRepository.findAllSlugs();
      const existingSlugs = allSlugs
        .filter((s: { slug: string }) => s.slug !== project.slug)
        .map((s: { slug: string }) => s.slug);
      let slug = generateSlug(data.title);
      let counter = 1;
      while (existingSlugs.includes(slug)) {
        slug = `${generateSlug(data.title)}-${counter}`;
        counter++;
      }
      data.slug = slug;
    }

    return projectRepository.update(id, data);
  },

  delete: async (id: string) => {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, PROJECT_MESSAGES.NOT_FOUND);
    }
    await projectRepository.delete(id);
  },
};
