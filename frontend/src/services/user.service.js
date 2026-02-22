import api from './api';
import { API_ENDPOINTS } from '../constants';

export const userService = {
  getAll: (params) => api.get(API_ENDPOINTS.USERS.BASE, { params }),
  getById: (id) => api.get(API_ENDPOINTS.USERS.BY_ID(id)),
  updateProfile: (data) => api.put(API_ENDPOINTS.USERS.PROFILE, data),
  delete: (id) => api.delete(API_ENDPOINTS.USERS.BY_ID(id)),
};
