import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { authRepository } from './auth.repository';
import { generateTokenPair, verifyRefreshToken } from '../../utils/jwt';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, AUTH_MESSAGES } from '../../constants';
import { AuthPayload } from '../../middleware/auth.middleware';
import { Role } from '../../constants/roles';
import { sendVerificationEmail } from '../../utils/email';

const SALT_ROUNDS = 12;

export const authService = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, AUTH_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const verificationToken = randomUUID();

    const user = await authRepository.create({
      ...data,
      password: hashedPassword,
      verificationToken,
    });

    // Send verification email (non-blocking)
    sendVerificationEmail(user.email, verificationToken, user.firstName).catch((err) => {
      console.error('Failed to send verification email:', err);
    });

    return {
      requiresVerification: true,
      email: user.email,
    };
  },

  verifyEmail: async (token: string) => {
    const user = await authRepository.findByVerificationToken(token);
    if (!user) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired verification link.');
    }

    await authRepository.verifyUser(user.id);
    return { verified: true };
  },

  login: async (email: string, password: string) => {
    const user = await authRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.emailVerified && user.provider === 'local') {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Please verify your email before logging in. Check your inbox for the verification link.');
    }

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    };

    const tokens = generateTokenPair(payload);
    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  },

  refreshToken: async (token: string) => {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await authRepository.findById(decoded.userId);
      if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.TOKEN_INVALID);
      }

      const payload: AuthPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as Role,
      };

      const tokens = generateTokenPair(payload);
      await authRepository.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.TOKEN_INVALID);
    }
  },

  logout: async (userId: string) => {
    await authRepository.updateRefreshToken(userId, null);
  },

  getProfile: async (userId: string) => {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, AUTH_MESSAGES.UNAUTHORIZED);
    }
    return user;
  },
};
