import api from './api';
import { API_ENDPOINTS } from '../constants';

export const blogService = {
  getAll: (params) => api.get(API_ENDPOINTS.BLOGS.BASE, { params }),
  getBySlug: (slug) => api.get(API_ENDPOINTS.BLOGS.BY_SLUG(slug)),
  create: (data) => api.post(API_ENDPOINTS.BLOGS.BASE, data),
  update: (id, data) => api.put(API_ENDPOINTS.BLOGS.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.BLOGS.BY_ID(id)),
};
