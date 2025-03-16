import api from '@/lib/API/auth/interceptor';
import { User } from '@/lib/types/user';
import logger from '@/lib/utils/logger';

export const GetUsers = async (page = 1, limit = 10): Promise<User[]> => {
  try {
    const response = await api.get('/users', { params: { page, limit } });
    return response.data.results;
  } catch (err) {
    logger(err, 'Error fetching users');
    throw new Error('Failed to fetch users. Please try again later.');
  }
};

export const GetUsersByCourseId = async (
  courseId: string,
  page = 1,
  limit = 10,
): Promise<User[]> => {
  try {
    const response = await api.get('/users', {
      params: { courseId, page, limit },
    });
    return response.data.results;
  } catch (err) {
    logger(err, `Error fetching users for course ${courseId}`);
    throw new Error('Failed to fetch users for this course. Please try again later.');
  }
};

export const GetUserById = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (err) {
    logger(err, `Error fetching user ${userId}`);
    throw new Error('Failed to fetch user details. Please try again later.');
  }
};

export const GetUsersByRole = async (role: string): Promise<User[]> => {
  try {
    const response = await api.get('/users', { params: { role } });
    return response.data.results;
  } catch (err) {
    logger(err, `Error fetching users with role ${role}`);
    throw new Error('Failed to fetch users for this role. Please try again later.');
  }
};

export const ApproveUser = async (userId: string): Promise<void> => {
  try {
    await api.patch(`/users/${userId}`, { status: 'approved' });
  } catch (err) {
    logger(err, `Error approving user ${userId}`);
    throw new Error('Failed to approve user. Please try again later.');
  }
};

export const RejectUser = async (userId: string): Promise<void> => {
  try {
    await api.patch(`/users/${userId}`, { status: 'rejected' });
  } catch (err) {
    logger(err, `Error rejecting user ${userId}`);
    throw new Error('Failed to reject user. Please try again later.');
  }
};