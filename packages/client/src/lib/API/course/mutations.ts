import api from '@/lib/API/auth/interceptor';

import {
  CourseCreateInput,
  CourseFormValues,
  CourseUpdateInput,
} from '@/lib/types/course';

interface UpdateCoursePropsI extends CourseFormValues {
  id: string;
}

interface DeleteCoursePropsI {
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
    apiKeys, // ✅ Now supports multiple API keys
  };

  try {
    await api.post('/courses', data); // Token auto-attached ✅
  } catch (err) {
    console.error('Error creating course:', err);
    throw err;
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
  whitelist, // Keep whitelist support
}: UpdateCoursePropsI) => {
  const data: CourseUpdateInput = {
    name,
    description,
    apiKeys, // ✅ Now supports updating multiple API keys
    llmConstraints,
    owner,
    students,
    staff,
    whitelist, // Include whitelist when updating the course
  };

  try {
    await api.patch(`/courses/${id}`, data); // Token auto-attached ✅
  } catch (err) {
    console.error('Error updating course:', err);
    throw err;
  }
};

// Delete a course
export const DeleteCourse = async ({ id }: DeleteCoursePropsI) => {
  try {
    await api.delete(`/courses/${id}`); // Token auto-attached ✅
  } catch (err) {
    console.error('Error deleting course:', err);
    throw err;
  }
};
