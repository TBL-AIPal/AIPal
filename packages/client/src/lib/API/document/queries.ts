import axios, { AxiosError } from 'axios';
import { cache } from 'react';

import { Document } from '@/lib/types/document';

import { proxyUrl } from '@/constant/env';

export const GetDocumentsByCourseId = cache(
  async (id: string): Promise<Document[]> => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const documents = await axios.get(`${proxyUrl}/courses/${id}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return documents.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);

export const GetDocumentById = cache(
  async (courseId: string, documentId: string): Promise<Document> => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const document = await axios.get(
        `${proxyUrl}/courses/${courseId}/documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return document.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);
