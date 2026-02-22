import api from './api';
import { API_ENDPOINTS } from '../constants';

export const serviceService = {
  getAll: (params) => api.get(API_ENDPOINTS.SERVICES.BASE, { params }),
  getFeatured: () => api.get(API_ENDPOINTS.SERVICES.FEATURED),
  getBySlug: (slug) => api.get(API_ENDPOINTS.SERVICES.BY_SLUG(slug)),
  create: (data) => api.post(API_ENDPOINTS.SERVICES.BASE, data),
  update: (id, data) => api.put(API_ENDPOINTS.SERVICES.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.SERVICES.BY_ID(id)),
};
