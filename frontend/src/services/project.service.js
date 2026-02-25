import api from './api';
import { API_ENDPOINTS } from '../constants';

function buildFormData(data) {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'image' && value instanceof File) {
      fd.append('image', value);
    } else if (Array.isArray(value)) {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
}

const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

export const projectService = {
  getAll: (params) => api.get(API_ENDPOINTS.PROJECTS.BASE, { params }),
  getFeatured: () => api.get(API_ENDPOINTS.PROJECTS.FEATURED),
  getBySlug: (slug) => api.get(API_ENDPOINTS.PROJECTS.BY_SLUG(slug)),
  create: (data) => api.post(API_ENDPOINTS.PROJECTS.BASE, buildFormData(data), multipartConfig),
  update: (id, data) => api.put(API_ENDPOINTS.PROJECTS.BY_ID(id), buildFormData(data), multipartConfig),
  delete: (id) => api.delete(API_ENDPOINTS.PROJECTS.BY_ID(id)),
};
