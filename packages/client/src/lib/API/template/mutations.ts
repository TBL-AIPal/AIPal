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
  documents,
}: UpdateTemplatePropsI) => {
  const data: TemplateUpdateInput = {
    name,
    constraints,
    documents,
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
