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

export const aboutService = {
  // Public - all data in one call
  getAll: () => api.get(API_ENDPOINTS.ABOUT.BASE),

  // Stats
  getStats: () => api.get(API_ENDPOINTS.ABOUT.STATS),
  createStat: (data) => api.post(API_ENDPOINTS.ABOUT.STATS, data),
  updateStat: (id, data) => api.put(API_ENDPOINTS.ABOUT.STAT_BY_ID(id), data),
  deleteStat: (id) => api.delete(API_ENDPOINTS.ABOUT.STAT_BY_ID(id)),

  // Story
  getStory: () => api.get(API_ENDPOINTS.ABOUT.STORY),
  upsertStory: (data) => api.put(API_ENDPOINTS.ABOUT.STORY, buildFormData(data), multipartConfig),

  // Experiences
  getExperiences: () => api.get(API_ENDPOINTS.ABOUT.EXPERIENCES),
  createExperience: (data) => api.post(API_ENDPOINTS.ABOUT.EXPERIENCES, data),
  updateExperience: (id, data) => api.put(API_ENDPOINTS.ABOUT.EXPERIENCE_BY_ID(id), data),
  deleteExperience: (id) => api.delete(API_ENDPOINTS.ABOUT.EXPERIENCE_BY_ID(id)),

  // Members
  getMembers: () => api.get(API_ENDPOINTS.ABOUT.MEMBERS),
  createMember: (data) => api.post(API_ENDPOINTS.ABOUT.MEMBERS, buildFormData(data), multipartConfig),
  updateMember: (id, data) => api.put(API_ENDPOINTS.ABOUT.MEMBER_BY_ID(id), buildFormData(data), multipartConfig),
  deleteMember: (id) => api.delete(API_ENDPOINTS.ABOUT.MEMBER_BY_ID(id)),

  // Certificates
  getCertificates: () => api.get(API_ENDPOINTS.ABOUT.CERTIFICATES),
  createCertificate: (data) => api.post(API_ENDPOINTS.ABOUT.CERTIFICATES, buildFormData(data), multipartConfig),
  updateCertificate: (id, data) => api.put(API_ENDPOINTS.ABOUT.CERTIFICATE_BY_ID(id), buildFormData(data), multipartConfig),
  deleteCertificate: (id) => api.delete(API_ENDPOINTS.ABOUT.CERTIFICATE_BY_ID(id)),
};
