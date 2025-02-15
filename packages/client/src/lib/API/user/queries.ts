import axios, { AxiosError } from 'axios';
import { cache } from 'react';

import { User } from '@/lib/types/user';
import { proxyUrl } from '@/constant/env';

export const GetUsers = cache(
  async (page = 1, limit = 10): Promise<User[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(`${proxyUrl}/users`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.results;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);

export const GetUsersByCourseId = cache(
  async (courseId: string, page = 1, limit = 10): Promise<User[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(`${proxyUrl}/users`, {
        params: { courseId, page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.results;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);

export const GetUserById = cache(
  async (userId: string): Promise<User> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(`${proxyUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);

export const GetUsersByRole = cache(
  async (role: string): Promise<User[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(`${proxyUrl}/users`, {
        params: { role },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.results;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);

export const ApproveUser = async (userId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    await axios.patch(`${proxyUrl}/users/${userId}`, { status: 'approved' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};

export const RejectUser = async (userId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    await axios.patch(`${proxyUrl}/users/${userId}`, { status: 'rejected' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};
