import { aboutRepository } from './about.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, ABOUT_MESSAGES } from '../../constants';

export const aboutService = {
  // ─── PUBLIC ────────────────────────────────────────────
  getAll: () => aboutRepository.findAllPublic(),

  // ─── STATS ─────────────────────────────────────────────
  getStats: () => aboutRepository.findAllStats(),

  createStat: (data: { label: string; value: number; suffix?: string; sortOrder?: number }) =>
    aboutRepository.createStat(data),

  updateStat: async (id: string, data: any) => {
    const stat = await aboutRepository.findStatById(id);
    if (!stat) throw new ApiError(HTTP_STATUS.NOT_FOUND, ABOUT_MESSAGES.NOT_FOUND);
    return aboutRepository.updateStat(id, data);
  },

  deleteStat: async (id: string) => {
    const stat = await aboutRepository.findStatById(id);
    if (!stat) throw new ApiError(HTTP_STATUS.NOT_FOUND, ABOUT_MESSAGES.NOT_FOUND);
    await aboutRepository.deleteStat(id);
  },

  // ─── STORY ─────────────────────────────────────────────
  getStory: () => aboutRepository.findStory(),

  upsertStory: (data: { title?: string; content: string; highlights?: any; teamImage?: string }) =>
    aboutRepository.upsertStory(data),

  // ─── EXPERIENCE ────────────────────────────────────────
  getExperiences: () => aboutRepository.findAllExperiences(),

  createExperience: (data: { year: string; title: string; description: string; sortOrder?: number }) =>
    aboutRepository.createExperience(data),

  updateExperience: async (id: string, data: any) => {
    const exp = await aboutRepository.findExperienceById(id);
    if (!exp) throw new ApiError(HTTP_STATUS.NOT_FOUND, ABOUT_MESSAGES.NOT_FOUND);
    return aboutRepository.updateExperience(id, data);
  },

  deleteExperience: async (id: string) => {
    const exp = await aboutRepository.findExperienceById(id);
    if (!exp) throw new ApiError(HTTP_STATUS.NOT_FOUND, ABOUT_MESSAGES.NOT_FOUND);
    await aboutRepository.deleteExperience(id);
  },

  // ─── TEAM MEMBERS ──────────────────────────────────────
  getMembers: () => aboutRepository.findAllMembers(),

  createMember: (data: { name: string; role: string; specialty: string; experience: string; image?: string; sortOrder?: number }) =>
    aboutRepository.createMember(data),

  updateMember: async (id: string, data: any) => {
    const member = await aboutRepository.findMemberById(id);
    if (!member) throw new ApiError(HTTP_STATUS.NOT_FOUND, ABOUT_MESSAGES.NOT_FOUND);
    return aboutRepository.updateMember(id, data);
  },

  deleteMember: async (id: string) => {
    const member = await aboutRepository.findMemberById(id);
    if (!member) throw new ApiError(HTTP_STATUS.NOT_FOUND, ABOUT_MESSAGES.NOT_FOUND);
    await aboutRepository.deleteMember(id);
  },

  // ─── CERTIFICATES ──────────────────────────────────────
  getCertificates: () => aboutRepository.findAllCertificates(),

  createCertificate: (data: { title: string; issuer: string; year: string; description?: string; image?: string; memberId: string; sortOrder?: number }) =>
    aboutRepository.createCertificate(data),

  updateCertificate: async (id: string, data: any) => {
    const cert = await aboutRepository.findCertificateById(id);
    if (!cert) throw new ApiError(HTTP_STATUS.NOT_FOUND, ABOUT_MESSAGES.NOT_FOUND);
    return aboutRepository.updateCertificate(id, data);
  },

  deleteCertificate: async (id: string) => {
    const cert = await aboutRepository.findCertificateById(id);
    if (!cert) throw new ApiError(HTTP_STATUS.NOT_FOUND, ABOUT_MESSAGES.NOT_FOUND);
    await aboutRepository.deleteCertificate(id);
  },
};
