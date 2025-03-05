import api from '@/lib/API/auth/interceptor';
import axios, { AxiosError } from 'axios'; // ✅ Import AxiosError

import {
  CourseCreateInput,
  CourseFormValues,
  CourseUpdateInput,
  APIKeys,
} from '@/lib/types/course';

interface UpdateCoursePropsI extends CourseFormValues {
  id: string;
}

interface DeleteCoursePropsI {
  id: string;
}

// ✅ Create a new course
export const CreateCourse = async ({
  name,
  description,
  apiKeys,
}: CourseFormValues) => {
  const filteredApiKeys: Partial<APIKeys> = Object.fromEntries(
    Object.entries(apiKeys).filter(([_, value]) => value.trim() !== '')
  );

  if (Object.keys(filteredApiKeys).length === 0) {
    throw new Error('At least one API key must be provided.');
  }

  const data: CourseCreateInput = {
    name,
    description,
    apiKeys: filteredApiKeys,
  };

  try {
    await api.post('/courses', data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('Error creating course:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to create course');
    }
    console.error('Unexpected error:', err);
    throw new Error('An unexpected error occurred.');
  }
};

// ✅ Update an existing course
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
  const filteredApiKeys: Partial<APIKeys> = Object.fromEntries(
    Object.entries(apiKeys).filter(([_, value]) => value.trim() !== '')
  );

  const data: CourseUpdateInput = {
    name,
    description,
    apiKeys: filteredApiKeys,
    llmConstraints,
    owner,
    students,
    staff,
    whitelist,
  };

  try {
    await api.patch(`/courses/${id}`, data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('Error updating course:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update course');
    }
    console.error('Unexpected error:', err);
    throw new Error('An unexpected error occurred.');
  }
};

// ✅ Delete a course
export const DeleteCourse = async ({ id }: DeleteCoursePropsI) => {
  try {
    await api.delete(`/courses/${id}`);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('Error deleting course:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to delete course');
    }
    console.error('Unexpected error:', err);
    throw new Error('An unexpected error occurred.');
  }
};