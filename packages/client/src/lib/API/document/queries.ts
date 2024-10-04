import axios, { AxiosError } from 'axios';
import { cache } from 'react';

import { Document } from '@/lib/types/document';

import { jwtToken, proxyUrl } from '@/constant/env';

export const GetDocumentsByCourseId = cache(
  async (id: string): Promise<Document[]> => {
    try {
      const documents = await axios.get(`${proxyUrl}/courses/${id}/documents`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
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
      const document = await axios.get(
        `${proxyUrl}/courses/${courseId}/documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return document.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);
