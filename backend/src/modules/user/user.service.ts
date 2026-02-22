import { userRepository } from './user.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, USER_MESSAGES } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';

export const userService = {
  getAll: async (query: { page?: string; limit?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const [users, total] = await Promise.all([
      userRepository.findAll(skip, take),
      userRepository.count(),
    ]);
    return { users, meta: getMeta(total, page, limit) };
  },

  getById: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  },

  updateProfile: async (id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }
    return userRepository.update(id, data);
  },

  delete: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }
    await userRepository.delete(id);
  },
};
