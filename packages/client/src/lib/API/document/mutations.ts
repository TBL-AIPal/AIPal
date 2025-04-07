import api from '@/lib/API/auth/interceptor';
import { DocumentFormValues, DocumentUpdateInput } from '@/lib/types/document';
import logger from '@/lib/utils/logger';

interface DeleteDocumentPropsI {
  courseId: string;
  documentId: string;
}

interface UpdateDocumentPropsI extends DocumentUpdateInput {
  courseId: string;
  documentId: string;
}

// Create a new document
export const CreateDocument = async ({ courseId, formData }: DocumentFormValues) => {
  try {
    await api.post(`/courses/${courseId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (err) {
    logger(err, `Error uploading document for course ${courseId}`);
    throw new Error('Unable to upload document. Please try again.');
  }
};

// Update a document
export const UpdateDocument = async ({
  courseId,
  documentId,
  filename,
  status,
}: UpdateDocumentPropsI) => {
  const data: DocumentUpdateInput = {
    filename,
    status,
  };

  try {
    await api.patch(`/courses/${courseId}/documents/${documentId}`, data);
  } catch (err) {
    logger(err, `Error updating document ${documentId} in course ${courseId}`);
    throw new Error('Unable to update document. Please try again.');
  }
};


// Delete a document
export const DeleteDocument = async ({ courseId, documentId }: DeleteDocumentPropsI) => {
  try {
    await api.delete(`/courses/${courseId}/documents/${documentId}`);
  } catch (err) {
    logger(err, `Error deleting document ${documentId} in course ${courseId}`);
    throw new Error('Unable to delete document. Please try again.');
  }
};
