import prisma from '../../config/database';

export const aboutRepository = {
  // ─── STATS ─────────────────────────────────────────────
  findAllStats: () =>
    prisma.aboutStat.findMany({ orderBy: { sortOrder: 'asc' } }),

  findStatById: (id: string) =>
    prisma.aboutStat.findUnique({ where: { id } }),

  createStat: (data: { label: string; value: number; suffix?: string; sortOrder?: number }) =>
    prisma.aboutStat.create({ data }),

  updateStat: (id: string, data: Record<string, any>) =>
    prisma.aboutStat.update({ where: { id }, data }),

  deleteStat: (id: string) =>
    prisma.aboutStat.delete({ where: { id } }),

  // ─── STORY ─────────────────────────────────────────────
  findStory: () =>
    prisma.aboutStory.findFirst(),

  upsertStory: (data: { title?: string; content: string; highlights?: any; teamImage?: string }) =>
    prisma.$transaction(async (tx) => {
      const existing = await tx.aboutStory.findFirst();
      if (existing) {
        return tx.aboutStory.update({ where: { id: existing.id }, data });
      }
      return tx.aboutStory.create({ data });
    }),

  // ─── EXPERIENCE ────────────────────────────────────────
  findAllExperiences: () =>
    prisma.aboutExperience.findMany({ orderBy: { sortOrder: 'asc' } }),

  findExperienceById: (id: string) =>
    prisma.aboutExperience.findUnique({ where: { id } }),

  createExperience: (data: { year: string; title: string; description: string; sortOrder?: number }) =>
    prisma.aboutExperience.create({ data }),

  updateExperience: (id: string, data: Record<string, any>) =>
    prisma.aboutExperience.update({ where: { id }, data }),

  deleteExperience: (id: string) =>
    prisma.aboutExperience.delete({ where: { id } }),

  // ─── TEAM MEMBERS ──────────────────────────────────────
  findAllMembers: () =>
    prisma.aboutTeamMember.findMany({ orderBy: { sortOrder: 'asc' }, include: { certificates: true } }),

  findMemberById: (id: string) =>
    prisma.aboutTeamMember.findUnique({ where: { id }, include: { certificates: true } }),

  createMember: (data: { name: string; role: string; specialty: string; experience: string; image?: string; sortOrder?: number }) =>
    prisma.aboutTeamMember.create({ data }),

  updateMember: (id: string, data: Record<string, any>) =>
    prisma.aboutTeamMember.update({ where: { id }, data }),

  deleteMember: (id: string) =>
    prisma.aboutTeamMember.delete({ where: { id } }),

  // ─── CERTIFICATES ──────────────────────────────────────
  findAllCertificates: () =>
    prisma.aboutCertificate.findMany({ orderBy: { sortOrder: 'asc' }, include: { member: { select: { id: true, name: true } } } }),

  findCertificateById: (id: string) =>
    prisma.aboutCertificate.findUnique({ where: { id }, include: { member: { select: { id: true, name: true } } } }),

  createCertificate: (data: { title: string; issuer: string; year: string; description?: string; image?: string; memberId: string; sortOrder?: number }) =>
    prisma.aboutCertificate.create({ data, include: { member: { select: { id: true, name: true } } } }),

  updateCertificate: (id: string, data: Record<string, any>) =>
    prisma.aboutCertificate.update({ where: { id }, data, include: { member: { select: { id: true, name: true } } } }),

  deleteCertificate: (id: string) =>
    prisma.aboutCertificate.delete({ where: { id } }),

  // ─── PUBLIC (all-in-one fetch) ─────────────────────────
  findAllPublic: async () => {
    const [stats, story, experiences, members, certificates] = await Promise.all([
      prisma.aboutStat.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.aboutStory.findFirst(),
      prisma.aboutExperience.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.aboutTeamMember.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.aboutCertificate.findMany({ orderBy: { sortOrder: 'asc' }, include: { member: { select: { id: true, name: true } } } }),
    ]);
    return { stats, story, experiences, members, certificates };
  },
};
