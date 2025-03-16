import api from '@/lib/API/auth/interceptor';

import {
  CourseCreateInput,
  CourseFormValues,
  CourseUpdateInput,
} from '@/lib/types/course';
import logger from '@/lib/utils/logger';

interface UpdateCoursePropsI extends CourseFormValues {
  id: string;
}

// Create a new course
export const CreateCourse = async ({
  name,
  description,
  apiKeys,
}: CourseFormValues) => {
  const data: CourseCreateInput = {
    name,
    description,
    apiKeys,
  };

  try {
    await api.post('/courses', data);
  } catch (err) {
    logger(err, 'Unable to create course');
    throw new Error('Unable to create course. Please try again.');
  }
};

// Update an existing course
export const UpdateCourse = async ({
  id,
  name,
  description,
  apiKeys,
  llmConstraints,
  owner,
  students,
  staff,
  whitelist,
}: UpdateCoursePropsI) => {
  const data: CourseUpdateInput = {
    name,
    description,
    apiKeys,
    llmConstraints,
    owner,
    students,
    staff,
    whitelist,
  };

  try {
    await api.patch(`/courses/${id}`, data);
  } catch (err) {
    logger(err, 'Unable to update course');
    throw new Error('Unable to update course. Please try again.');
  }
};

// Delete a course
export const DeleteCourse = async (id : String ) => {
  try {
    await api.delete(`/courses/${id}`);
  } catch (err) {
    logger(err, 'Unable to delete course');
    throw new Error('Unable to delete course. Please try again.');
  }
};
