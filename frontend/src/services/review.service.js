import api from './api';
import { API_ENDPOINTS } from '../constants';

export const reviewService = {
  getAll: (params) => api.get(API_ENDPOINTS.REVIEWS.BASE, { params }),
  getByService: (serviceId, params) =>
    api.get(API_ENDPOINTS.REVIEWS.BY_SERVICE(serviceId), { params }),
  create: (data) => api.post(API_ENDPOINTS.REVIEWS.BASE, data),
  update: (id, data) => api.put(API_ENDPOINTS.REVIEWS.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.REVIEWS.BY_ID(id)),
};
