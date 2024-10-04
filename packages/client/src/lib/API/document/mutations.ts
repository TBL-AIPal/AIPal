import axios, { AxiosError } from 'axios';

import { DocumentFormValues } from '@/lib/types/document';

import { jwtToken, proxyUrl } from '@/constant/env';

interface DeleteDocumentPropsI {
  courseId: string;
  documentId: string;
}

export const CreateDocument = async ({
  courseId,
  formData,
}: DocumentFormValues) => {
  try {
    await axios.post(`${proxyUrl}/courses/${courseId}/documents`, formData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};

export const DeleteDocument = async ({
  courseId,
  documentId,
}: DeleteDocumentPropsI) => {
  try {
    await axios.delete(
      `${proxyUrl}/courses/${courseId}/documents/${documentId}`,
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
