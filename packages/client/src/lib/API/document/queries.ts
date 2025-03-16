import api from '@/lib/API/auth/interceptor';
import { Document, DocumentMetadata } from '@/lib/types/document';
import logger from '@/lib/utils/logger';

// Get all documents' metadata for a course
export const GetDocumentsByCourseId = async (
  courseId: string,
): Promise<DocumentMetadata[]> => {
  try {
    const response = await api.get(`/courses/${courseId}/documents`);
    return response.data;
  } catch (err) {
    logger(err, `Error fetching documents' metadata for course ${courseId}`);
    throw err;
  }
};

// Get a single document by its ID
export const GetDocumentById = async (
  courseId: string,
  documentId: string,
): Promise<Document> => {
  try {
    const response = await api.get(
      `/courses/${courseId}/documents/${documentId}`,
    );
    return response.data;
  } catch (err) {
    logger(err, `Error fetching document ${documentId} from course ${courseId}:`);
    throw err;
  }
};
