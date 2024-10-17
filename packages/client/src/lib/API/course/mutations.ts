import axios, { AxiosError } from 'axios';

import {
  CourseCreateInput,
  CourseFormValues,
  CourseUpdateInput,
} from '@/lib/types/course';

import { jwtToken, proxyUrl } from '@/constant/env';

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
    await axios.post(`${proxyUrl}/courses`, data, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
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
}: UpdateCoursePropsI) => {
  const data: CourseUpdateInput = {
    name,
    description,
    apiKey,
    llmConstraints,
    owner,
    students,
    staff,
  };

  try {
    await axios.patch(`${proxyUrl}/courses/${id}`, data, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};

export const DeleteCourse = async ({ id }: DeleteCoursePropsI) => {
  try {
    await axios.delete(`${proxyUrl}/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};
