import axios, { AxiosError } from 'axios';
import { cache } from 'react';

import { Course } from '@/lib/types/course';
import { proxyUrl } from '@/constant/env';

export const GetCoursesForUser = cache(
  async (page = 1, limit = 10): Promise<Course[]> => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(`${proxyUrl}/courses`, {
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

export const GetCourseById = cache(
  async (courseId: string): Promise<Course> => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(`${proxyUrl}/courses/${courseId}`, {
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
