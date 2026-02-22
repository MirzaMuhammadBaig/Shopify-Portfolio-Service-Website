import api from './api';
import { API_ENDPOINTS } from '../constants';

export const adminService = {
  getDashboardStats: () => api.get(API_ENDPOINTS.ADMIN.DASHBOARD),
};
