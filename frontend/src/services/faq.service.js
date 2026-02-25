import api from './api';
import { API_ENDPOINTS } from '../constants';

export const faqService = {
  getAll: (params) => api.get(API_ENDPOINTS.FAQS.BASE, { params }),
  create: (data) => api.post(API_ENDPOINTS.FAQS.BASE, data),
  update: (id, data) => api.put(API_ENDPOINTS.FAQS.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.FAQS.BY_ID(id)),
};
