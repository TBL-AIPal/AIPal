'use client';

import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { del, get, postWithFile } from '@/lib/apiUtils';
import logger from '@/lib/logger';

import FileUpload from '@/components/FileUpload';
import DocumentRow from '@/components/tables/document/DocumentRow';
import DocumentTable from '@/components/tables/document/DocumentTable';

import { jwtToken } from '@/constant/env';

type Document = {
  id: string;
  filename: string;
  createdAt: string;
  size: number;
};

const Materials: React.FC = () => {
  const { courseId } = useParams();
  const [documents, setDocuments] = useState<Document[]>([]);

  const fetchDocuments = useCallback(async () => {
    if (!courseId) return;

    try {
      const res = await get<Document[]>(`/v1/documents/${courseId}`, jwtToken);
      logger(res, 'Fetched documents successfully');
      setDocuments(res || []); // Use empty array as fallback
    } catch (error) {
      logger(error, 'Error fetching documents');
    }
  }, [courseId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('file', file));

    try {
      const response = await postWithFile(
        `/v1/documents/${courseId}`,
        formData,
        jwtToken
      );
      logger(response, 'Files uploaded successfully!');

      // Refetch documents after a successful upload
      await fetchDocuments();
    } catch (error) {
      logger(error, 'File upload failed.');
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await del(`/v1/documents/${courseId}/${documentId}`, jwtToken);
      logger('Document deleted successfully');
      await fetchDocuments();
    } catch (error) {
      logger(error, 'Failed to delete document');
    }
  };

  return (
    <div className='p-4'>
      {/* Upload section */}
      <h1 className='text-2xl font-semibold mb-4 text-blue-600'>Upload</h1>
      <FileUpload onUpload={handleUpload} />

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
