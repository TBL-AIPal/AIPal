import api from '@/lib/API/auth/interceptor';
import { User } from '@/lib/types/user';

export const CreateUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.post('auth/register', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};
