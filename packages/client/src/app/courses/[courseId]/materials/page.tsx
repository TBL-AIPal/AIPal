'use client';

import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { CreateDocument, DeleteDocument } from '@/lib/API/document/mutations';
import { GetDocumentsByCourseId } from '@/lib/API/document/queries';
import { Document } from '@/lib/types/document';
import logger from '@/lib/utils/logger';

import DocumentRow from './_PageSections/DocumentRow';
import DocumentTable from './_PageSections/DocumentTable';
import FileUpload from './_PageSections/FileUpload';

const Materials: React.FC = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const res = await GetDocumentsByCourseId(courseIdString);
      logger(res, 'Fetched documents successfully');
      setDocuments(res || []); // Use empty array as fallback
    } catch (error) {
      logger(error, 'Error fetching documents');
    }
  }, [courseIdString]);

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
  
    try {
      // Upload of documents is done sequentially rather than concurrently 
      // due to resource limitations
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          await CreateDocument({
            courseId: courseIdString,
            formData,
          });
          logger(`File "${file.name}" uploaded successfully!`);
        } catch (error) {
          logger(error, `File "${file.name}" upload failed.`);
          throw error;
        }
      }
      await fetchDocuments();
    } catch (error) {
      logger(error, 'One or more files failed to upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await DeleteDocument({
        courseId: courseIdString,
        documentId,
      });
      logger('Document deleted successfully');
      await fetchDocuments();
    } catch (error) {
      logger(error, 'Failed to delete document');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className='p-4'>
      {/* Upload section */}
      <h1 className='text-2xl font-semibold mb-4 text-blue-600'>Upload</h1>
      <FileUpload
        onUpload={handleUpload}
        isUploading={isUploading}
      />

      {/* Divider */}
      <div className='mt-4'></div>

      {/* Files section */}
      <h1 className='text-2xl font-semibold mb-2 text-blue-600'>Files</h1>
      <DocumentTable>
        {documents.map((document) => (
          <DocumentRow
            key={document.id}
            name={document.filename}
            timestamp={document.createdAt}
            size={`${(document.size / 1024).toFixed(2)} KB`}
            onDelete={() => handleDelete(document.id)}
          />
        ))}
      </DocumentTable>
    </div>
  );
};

export default Materials;