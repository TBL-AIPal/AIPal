import api from '@/lib/API/auth/interceptor';
import { Course } from '@/lib/types/course';
import logger from '@/lib/utils/logger';

// Get courses for a user
export const GetCoursesForUser = async (
  page = 1,
  limit = 10,
): Promise<Course[]> => {
  try {
    const response = await api.get('/courses', { params: { page, limit } }); // Token auto-attached ✅
    return response.data.results;
  } catch (err) {
    logger(err, `Error fetching courses for user`);
    throw err;
  }
};

// Get a specific course by ID
export const GetCourseById = async (courseId: string): Promise<Course> => {
  try {
    const response = await api.get(`/courses/${courseId}`); // Token auto-attached ✅
    return response.data;
  } catch (err) {
    logger(err, `Error fetching course with ID ${courseId}`);
    throw err;
  }
};
