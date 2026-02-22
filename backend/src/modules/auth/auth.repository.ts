import prisma from '../../config/database';

export const authRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    verificationToken?: string;
  }) => prisma.user.create({ data }),

  findByVerificationToken: (token: string) =>
    prisma.user.findFirst({ where: { verificationToken: token } }),

  verifyUser: (userId: string) =>
    prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true, verificationToken: null },
    }),

  updateRefreshToken: (userId: string, refreshToken: string | null) =>
    prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    }),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
};
