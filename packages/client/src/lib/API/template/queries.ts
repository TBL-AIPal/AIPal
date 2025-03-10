import api from '@/lib/API/auth/interceptor';
import { Template } from '@/lib/types/template';
import logger from '@/lib/utils/logger';

export const GetTemplatesByCourseId = async (
  courseId: string,
): Promise<Template[]> => {
  try {
    const response = await api.get(`/courses/${courseId}/templates`);
    return response.data;
  } catch (err) {
    logger(err, `Error fetching templates for course ${courseId}`);
    throw err;
  }
};

export const GetTemplateById = async (
  courseId: string,
  templateId: string,
): Promise<Template> => {
  try {
    const response = await api.get(
      `/courses/${courseId}/templates/${templateId}`,
    );
    return response.data;
  } catch (err) {
    logger(err, `Error fetching template ${templateId} in course ${courseId}`);
    throw err;
  }
};
