import api from '@/lib/API/auth/interceptor';

import {
  TemplateCreateInput,
  TemplateFormValues,
  TemplateUpdateInput,
} from '@/lib/types/template';

interface CreateTemplatePropsI extends TemplateFormValues {
  courseId: string;
}

interface UpdateTemplatePropsI extends TemplateFormValues {
  courseId: string;
  templateId: string;
}

interface DeleteTemplatePropsI {
  courseId: string;
  templateId: string;
}

export const CreateTemplate = async ({ courseId, name, constraints }: CreateTemplatePropsI) => {
  const data: TemplateCreateInput = { name, constraints };

  try {
    await api.post(`/courses/${courseId}/templates`, data);
  } catch (err) {
    console.error(`Error creating template in course ${courseId}:`, err);
    throw err;
  }
};

export const UpdateTemplate = async ({ courseId, templateId, name, constraints }: UpdateTemplatePropsI) => {
  const data: TemplateUpdateInput = { name, constraints };

  try {
    await api.patch(`/courses/${courseId}/templates/${templateId}`, data);
  } catch (err) {
    console.error(`Error updating template ${templateId} in course ${courseId}:`, err);
    throw err;
  }
};

export const DeleteTemplate = async ({ courseId, templateId }: DeleteTemplatePropsI) => {
  try {
    await api.delete(`/courses/${courseId}/templates/${templateId}`);
  } catch (err) {
    console.error(`Error deleting template ${templateId} in course ${courseId}:`, err);
    throw err;
  }
};