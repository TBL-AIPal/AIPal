import api from '@/lib/API/auth/interceptor';
import { cache } from 'react';
import { Document } from '@/lib/types/document';

// Get all documents for a course
export const GetDocumentsByCourseId = cache(async (courseId: string): Promise<Document[]> => {
  try {
    const response = await api.get(`/courses/${courseId}/documents`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching documents for course ${courseId}:`, err);
    throw err;
  }
});

// Get a single document by its ID
export const GetDocumentById = cache(async (courseId: string, documentId: string): Promise<Document> => {
  try {
    const response = await api.get(`/courses/${courseId}/documents/${documentId}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching document ${documentId} from course ${courseId}:`, err);
    throw err;
  }
});
