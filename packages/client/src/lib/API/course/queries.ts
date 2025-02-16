import api from '@/lib/API/auth/interceptor';
import { cache } from 'react';

import { Course } from '@/lib/types/course';

// Get courses for a user
export const GetCoursesForUser = cache(async (page = 1, limit = 10): Promise<Course[]> => {
  try {
    const response = await api.get('/courses', { params: { page, limit } }); // Token auto-attached ✅
    return response.data.results;
  } catch (err) {
    console.error('Error fetching courses for user:', err);
    throw err;
  }
});

// Get a specific course by ID
export const GetCourseById = cache(async (courseId: string): Promise<Course> => {
  try {
    const response = await api.get(`/courses/${courseId}`); // Token auto-attached ✅
    return response.data;
  } catch (err) {
    console.error(`Error fetching course with ID ${courseId}:`, err);
    throw err;
  }
});
