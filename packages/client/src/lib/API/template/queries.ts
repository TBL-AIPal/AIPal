import api from '@/lib/API/auth/interceptor';
import { cache } from 'react';

import { Template } from '@/lib/types/template';

export const GetTemplatesByCourseId = cache(
  async (courseId: string): Promise<Template[]> => {
    try {
      const response = await api.get(`/courses/${courseId}/templates`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching templates for course ${courseId}:`, err);
      throw err;
    }
  }
);

export const GetTemplateById = cache(
  async (courseId: string, templateId: string): Promise<Template> => {
    try {
      const response = await api.get(`/courses/${courseId}/templates/${templateId}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching template ${templateId} in course ${courseId}:`, err);
      throw err;
    }
  }
);