import api from '@/lib/API/auth/interceptor';
import { DocumentFormValues, DocumentUpdateInput } from '@/lib/types/document';
import { ApiError } from '@/lib/utils/error';
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
  } catch (err: any) {
    logger(err, `Error uploading document for course ${courseId}`);
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: 'An unexpected error occurred.' };
    const errorMessage = `Failed to upload document for course ${courseId}. ${
      data.message || 'Please try again later.'
    }`;
    throw new ApiError(errorMessage, status, data);
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
  } catch (err: any) {
    logger(err, `Error updating document ${documentId} in course ${courseId}`);
    const status = err.response?.status || 500;
    const responseData = err.response?.data || { message: 'An unexpected error occurred.' };
    const errorMessage = `Failed to update document "${filename}" (ID: ${documentId}) in course ${courseId}. ${
      responseData.message || 'Please try again later.'
    }`;
    throw new ApiError(errorMessage, status, responseData);
  }
};

// Delete a document
export const DeleteDocument = async ({ courseId, documentId }: DeleteDocumentPropsI) => {
  try {
    await api.delete(`/courses/${courseId}/documents/${documentId}`);
  } catch (err: any) {
    logger(err, `Error deleting document ${documentId} in course ${courseId}`);
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: 'An unexpected error occurred.' };
    const errorMessage = `Failed to delete document (ID: ${documentId}) in course ${courseId}. ${
      data.message || 'Please try again later.'
    }`;
    throw new ApiError(errorMessage, status, data);
  }
};