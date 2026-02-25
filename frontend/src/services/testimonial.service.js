import api from './api';
import { API_ENDPOINTS } from '../constants';

export const testimonialService = {
  getAll: (params) => api.get(API_ENDPOINTS.TESTIMONIALS.BASE, { params }),
  create: (data) => api.post(API_ENDPOINTS.TESTIMONIALS.BASE, data),
  update: (id, data) => api.put(API_ENDPOINTS.TESTIMONIALS.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.TESTIMONIALS.BY_ID(id)),
};
