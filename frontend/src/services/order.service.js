import api from './api';
import { API_ENDPOINTS } from '../constants';

export const orderService = {
  getAll: (params) => api.get(API_ENDPOINTS.ORDERS.BASE, { params }),
  getMyOrders: (params) => api.get(API_ENDPOINTS.ORDERS.MY, { params }),
  getById: (id) => api.get(API_ENDPOINTS.ORDERS.BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.ORDERS.BASE, data),
  updateStatus: (id, data) => api.patch(API_ENDPOINTS.ORDERS.STATUS(id), data),
};
