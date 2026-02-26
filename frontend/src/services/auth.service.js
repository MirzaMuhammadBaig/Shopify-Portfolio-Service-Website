import api from './api';
import { API_ENDPOINTS } from '../constants';

export const authService = {
  register: (data) => api.post(API_ENDPOINTS.AUTH.REGISTER, data),
  login: (data) => api.post(API_ENDPOINTS.AUTH.LOGIN, data),
  googleAuth: (data) => api.post(API_ENDPOINTS.AUTH.GOOGLE, data),
  verifyEmail: (token) => api.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`),
  forgotPassword: (email) => api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  resetPassword: (data) => api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
  contact: (data) => api.post(API_ENDPOINTS.AUTH.CONTACT, data),
  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
  getProfile: () => api.get(API_ENDPOINTS.AUTH.PROFILE),
  refreshToken: (refreshToken) =>
    api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),
};
