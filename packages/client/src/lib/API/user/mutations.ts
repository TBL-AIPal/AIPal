import api from '@/lib/API/auth/interceptor';
import { User } from '@/lib/types/user';
import logger from '@/lib/utils/logger';

export const CreateUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.post('auth/register', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    logger(err, 'Unable to create a user');
    throw new Error('An unexpected error occurred. Please try again.');
  }
};
