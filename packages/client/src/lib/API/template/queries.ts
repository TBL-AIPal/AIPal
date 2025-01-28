import axios, { AxiosError } from 'axios';
import { cache } from 'react';

import { Template } from '@/lib/types/template';
import { proxyUrl } from '@/constant/env';

export const GetTemplatesByCourseId = cache(
  async (id: string): Promise<Template[]> => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(`${proxyUrl}/courses/${id}/templates`, {
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

export const GetTemplateById = cache(
  async (courseId: string, templateId: string): Promise<Template> => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(
        `${proxyUrl}/courses/${courseId}/templates/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);
