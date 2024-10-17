import axios, { AxiosError } from 'axios';
import { cache } from 'react';

import { Template } from '@/lib/types/template';

import { jwtToken, proxyUrl } from '@/constant/env';

export const GetTemplatesByCourseId = cache(
  async (id: string): Promise<Template[]> => {
    try {
      const templates = await axios.get(`${proxyUrl}/courses/${id}/templates`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return templates.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);

export const GetTemplateById = cache(
  async (courseId: string, templateId: string): Promise<Template> => {
    try {
      const template = await axios.get(
        `${proxyUrl}/courses/${courseId}/templates/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return template.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);
