import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { authRepository } from './auth.repository';
import { generateTokenPair, verifyRefreshToken } from '../../utils/jwt';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, AUTH_MESSAGES } from '../../constants';
import { AuthPayload } from '../../middleware/auth.middleware';
import { Role } from '../../constants/roles';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../utils/email';

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
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'This email is not registered. Please create an account first.');
    }

    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Your account has been deactivated. Please contact support.');
    }

    if (user.provider === 'google' && !user.password) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This account uses Google sign-in. Please sign in with Google.');
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

  googleAuth: async (data: {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }) => {
    const user = await authRepository.findOrCreateGoogleUser(data);

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
        avatar: user.avatar,
        provider: user.provider,
      },
      ...tokens,
    };
  },

  forgotPassword: async (email: string) => {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No account found with this email address.');
    }

    if (user.provider === 'google' && !user.password) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This account uses Google sign-in. Password reset is not available.');
    }

    const resetToken = randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await authRepository.setPasswordResetToken(user.id, resetToken, expires);

    await sendPasswordResetEmail(user.email, resetToken, user.firstName);

    return { message: 'Password reset link has been sent to your email.' };
  },

  resetPassword: async (token: string, newPassword: string) => {
    const user = await authRepository.findByPasswordResetToken(token);
    if (!user) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired password reset link. Please request a new one.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await authRepository.updatePassword(user.id, hashedPassword);

    return { message: 'Password has been reset successfully. You can now log in.' };
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
