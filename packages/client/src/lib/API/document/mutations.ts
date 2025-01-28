import axios, { AxiosError } from 'axios';

import { DocumentFormValues } from '@/lib/types/document';

import { proxyUrl } from '@/constant/env';

interface DeleteDocumentPropsI {
  courseId: string;
  documentId: string;
}

export const CreateDocument = async ({
  courseId,
  formData,
}: DocumentFormValues) => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve token dynamically
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    await axios.post(`${proxyUrl}/courses/${courseId}/documents`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem('authToken'); // Retrieve token dynamically
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    await axios.delete(
      `${proxyUrl}/courses/${courseId}/documents/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    throw new AxiosError((err as Error).message);
  }
};
