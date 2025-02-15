import axios, { AxiosError } from 'axios';

import {
  CourseCreateInput,
  CourseFormValues,
  CourseUpdateInput,
} from '@/lib/types/course';

import { proxyUrl } from '@/constant/env';

interface UpdateCoursePropsI extends CourseFormValues {
  id: string;
}

interface DeleteCoursePropsI {
  id: string;
}

export const CreateCourse = async ({
  name,
  description,
  apiKey,
}: CourseFormValues) => {
  const data: CourseCreateInput = {
    name,
    description,
    apiKey,
  };

  try {
    const token = localStorage.getItem('authToken'); // Retrieve token dynamically
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    await axios.post(`${proxyUrl}/courses`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};

export const UpdateCourse = async ({
  id,
  name,
  description,
  apiKey,
  llmConstraints,
  owner,
  students,
  staff,
  whitelist, // Add whitelist support
}: UpdateCoursePropsI) => {
  const data: CourseUpdateInput = {
    name,
    description,
    apiKey,
    llmConstraints,
    owner,
    students,
    staff,
    whitelist, // Include whitelist when updating the course
  };

  try {
    const token = localStorage.getItem('authToken'); // Retrieve token dynamically
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    await axios.patch(`${proxyUrl}/courses/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};

export const DeleteCourse = async ({ id }: DeleteCoursePropsI) => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve token dynamically
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    await axios.delete(`${proxyUrl}/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};
