import api from '@/lib/API/auth/interceptor';

import {
  TemplateCreateInput,
  TemplateFormValues,
  TemplateUpdateInput,
} from '@/lib/types/template';
import logger from '@/lib/utils/logger';

interface CreateTemplatePropsI extends TemplateFormValues {
  courseId: string;
}

interface UpdateTemplatePropsI extends TemplateUpdateInput {
  courseId: string;
  templateId: string;
}

interface DeleteTemplatePropsI {
  courseId: string;
  templateId: string;
}

export const CreateTemplate = async ({
  courseId,
  name,
  constraints,
  documents,
}: CreateTemplatePropsI) => {
  const data: TemplateCreateInput = {
    name,
    constraints,
    documents,
  };

  try {
    await api.post(`/courses/${courseId}/templates`, data);
  } catch (err) {
    logger(err, `Error creating template in course ${courseId}`);
    throw new Error('Unable to create template. Please try again.');
  }
};

export const UpdateTemplate = async ({
  courseId,
  templateId,
  name,
  constraints,
  documents,
}: UpdateTemplatePropsI) => {
  const data: TemplateUpdateInput = {
    name,
    constraints,
    documents,
  };

  try {
    await api.patch(`/courses/${courseId}/templates/${templateId}`, data);
  } catch (err) {
    logger(err, `Error updating template ${templateId} in course ${courseId}`);
    throw new Error('Unable to update template. Please try again.');
  }
};

export const DeleteTemplate = async ({ courseId, templateId }: DeleteTemplatePropsI) => {
  try {
    await api.delete(`/courses/${courseId}/templates/${templateId}`);
  } catch (err) {
    logger(err, `Error deleting template ${templateId} in course ${courseId}`);
    throw new Error('Unable to delete template. Please try again.');
  }
};