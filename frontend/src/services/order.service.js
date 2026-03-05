import api from './api';
import { API_ENDPOINTS } from '../constants';

export const orderService = {
  getAll: (params) => api.get(API_ENDPOINTS.ORDERS.BASE, { params }),
  getMyOrders: (params) => api.get(API_ENDPOINTS.ORDERS.MY, { params }),
  getById: (id) => api.get(API_ENDPOINTS.ORDERS.BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.ORDERS.BASE, data),
  updateStatus: (id, data) => api.patch(API_ENDPOINTS.ORDERS.STATUS(id), data),
  submitDeliverables: (id, formData) => api.post(API_ENDPOINTS.ORDERS.DELIVER(id), formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  approveOrder: (id) => api.patch(API_ENDPOINTS.ORDERS.APPROVE(id)),
  requestRevision: (id) => api.patch(API_ENDPOINTS.ORDERS.REVISION(id)),
  getMessages: (id) => api.get(API_ENDPOINTS.ORDERS.MESSAGES(id)),
  sendMessage: (id, data) => api.post(API_ENDPOINTS.ORDERS.MESSAGES(id), data),
};
