import api from '@/lib/API/auth/interceptor';
import { DocumentFormValues } from '@/lib/types/document';

interface DeleteDocumentPropsI {
  courseId: string;
  documentId: string;
}

// Create a new document
export const CreateDocument = async ({ courseId, formData }: DocumentFormValues) => {
  try {
    await api.post(`/courses/${courseId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // ✅ Ensures correct handling of file uploads
      },
    });
  } catch (err) {
    console.error(`Error uploading document for course ${courseId}:`, err);
    throw err;
  }
};

// Delete a document
export const DeleteDocument = async ({ courseId, documentId }: DeleteDocumentPropsI) => {
  try {
    await api.delete(`/courses/${courseId}/documents/${documentId}`);
  } catch (err) {
    console.error(`Error deleting document ${documentId} from course ${courseId}:`, err);
    throw err;
  }
};
