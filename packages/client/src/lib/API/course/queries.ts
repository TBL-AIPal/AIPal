import axios, { AxiosError } from 'axios';
import { cache } from 'react';

import { Course } from '@/lib/types/course';

import { jwtToken, proxyUrl } from '@/constant/env';

export const GetCourseByUserId = cache(
  async (page = 1, limit = 10): Promise<Course[]> => {
    try {
      const courses = await axios.get(`${proxyUrl}/courses`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return courses.data.results;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);

export const GetCourseById = cache(
  async (courseId: string): Promise<Course> => {
    try {
      const course = await axios.get(`${proxyUrl}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return course.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);
