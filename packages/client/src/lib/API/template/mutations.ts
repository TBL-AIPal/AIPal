import axios, { AxiosError } from 'axios';

import {
  TemplateCreateInput,
  TemplateFormValues,
  TemplateUpdateInput,
} from '@/lib/types/template';

import { jwtToken, proxyUrl } from '@/constant/env';

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

export const CreateTemplate = async ({
  courseId,
  name,
  constraints,
}: CreateTemplatePropsI) => {
  const data: TemplateCreateInput = {
    name,
    constraints,
  };

  try {
    await axios.post(`${proxyUrl}/courses/${courseId}/templates`, data, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};

export const UpdateTemplate = async ({
  courseId,
  templateId,
  name,
  constraints,
}: UpdateTemplatePropsI) => {
  const data: TemplateUpdateInput = {
    name,
    constraints,
  };

  try {
    await axios.patch(
      `${proxyUrl}/courses/${courseId}/templates/${templateId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};

export const DeleteTemplate = async ({
  courseId,
  templateId,
}: DeleteTemplatePropsI) => {
  try {
    await axios.delete(
      `${proxyUrl}/courses/${courseId}/templates/${templateId}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};
