import api from '@/lib/API/auth/interceptor';
import axios, { AxiosError } from 'axios';

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

export const CreateTutorialGroup = async (courseId: string, groupName: string) => {
  if (!courseId || !groupName) {
    throw new Error('Course ID and group name are required.');
  }

  const data = { name: groupName };

  try {
    await api.post(`/courses/${courseId}/tutorial-groups`, data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('Error creating tutorial group:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to create tutorial group');
    }
    console.error('Unexpected error:', err);
    throw new Error('An unexpected error occurred.');
  }
};
