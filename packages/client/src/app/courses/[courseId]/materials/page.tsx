'use client';

import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CreateDocument, DeleteDocument } from '@/lib/API/document/mutations';
import { GetDocumentsByCourseId } from '@/lib/API/document/queries';
import { DocumentMetadata } from '@/lib/types/document';
import logger from '@/lib/utils/logger';

import DocumentRow from './_PageSections/DocumentRow';
import DocumentTable from './_PageSections/DocumentTable';
import DocumentTableSkeleton from './_PageSections/DocumentTableSkeleton';
import FileUpload from './_PageSections/FileUpload';
import { createErrorToast, createInfoToast } from '@/lib/utils/toast';

const Materials: React.FC = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = useMemo(() => {
    return Array.isArray(courseId) ? courseId[0] : courseId;
  }, [courseId]);

  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!courseIdString) {
      throw Error('Unable to fetch documents due to missing course ID');
    }
    setIsLoading(true);
    try {
      const res = await GetDocumentsByCourseId(courseIdString);
      logger(res, 'Fetched documents successfully');
      setDocuments(res || []);
    } catch (error) {
      createErrorToast('Unable to retrieve uploaded documents. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [courseIdString]);

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        logger(`Attempting to upload file "${file.name}"`);
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
          createErrorToast(`Unable to upload "${file.name}". Please try again later.`);
        }
      }
      createInfoToast('Files have been uploaded successfully!');
    } catch (error) {
      logger(error, 'One or more files failed to upload.');
    } finally {
      await fetchDocuments();
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
      createInfoToast('File have been deleted successfully!');
      await fetchDocuments();
    } catch (error) {
      createErrorToast(`Unable to delete file. Please try again later.`);
    }
  };

  useEffect(() => {
    if (courseIdString) {
      fetchDocuments();
    }
  }, [courseIdString, fetchDocuments]);

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
      {isLoading || isUploading ? (
        <DocumentTableSkeleton />
      ) : (
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
      )}
    </div>
  );
};

export default Materials;