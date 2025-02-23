import api from '@/lib/API/auth/interceptor';
import { cache } from 'react';
import { User } from '@/lib/types/user';

export const GetUsers = cache(
  async (page = 1, limit = 10): Promise<User[]> => {
    try {
      const response = await api.get('/users', { params: { page, limit } });
      return response.data.results;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  }
);

export const GetUsersByCourseId = cache(
  async (courseId: string, page = 1, limit = 10): Promise<User[]> => {
    try {
      const response = await api.get('/users', { params: { courseId, page, limit } });
      return response.data.results;
    } catch (err) {
      console.error(`Error fetching users for course ${courseId}:`, err);
      throw err;
    }
  }
);

export const GetUserById = cache(
  async (userId: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err);
      throw err;
    }
  }
);

export const GetUsersByRole = cache(
  async (role: string): Promise<User[]> => {
    try {
      const response = await api.get('/users', { params: { role } });
      return response.data.results;
    } catch (err) {
      console.error(`Error fetching users with role ${role}:`, err);
      throw err;
    }
  }
);

export const ApproveUser = async (userId: string): Promise<void> => {
  try {
    await api.patch(`/users/${userId}`, { status: 'approved' });
  } catch (err) {
    console.error(`Error approving user ${userId}:`, err);
    throw err;
  }
};

export const RejectUser = async (userId: string): Promise<void> => {
  try {
    await api.patch(`/users/${userId}`, { status: 'rejected' });
  } catch (err) {
    console.error(`Error rejecting user ${userId}:`, err);
    throw err;
  }
};