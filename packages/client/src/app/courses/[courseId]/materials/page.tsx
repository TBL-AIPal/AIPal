'use client';

import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  CreateDocument,
  DeleteDocument,
  UpdateDocument,
} from '@/lib/API/document/mutations';
import { GetDocumentsByCourseId } from '@/lib/API/document/queries';
import { DocumentMetadata, DocumentStatus } from '@/lib/types/document';
import logger from '@/lib/utils/logger';
import { createErrorToast, createInfoToast } from '@/lib/utils/toast';

import EmptyState from '@/components/ui/EmptyState';

import DocumentRow from './_PageSections/DocumentRow';
import DocumentTable from './_PageSections/DocumentTable';
import DocumentTableSkeleton from './_PageSections/DocumentTableSkeleton';
import FileUpload from './_PageSections/FileUpload';
import { isApiError } from '@/lib/utils/error';
import IconButton from '@/components/buttons/IconButton';
import { MaterialsIcons } from '@/components/Icons';

const Materials: React.FC = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = useMemo(() => {
    return Array.isArray(courseId) ? courseId[0] : courseId;
  }, [courseId]);

  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRetrieved, setLastRetrieved] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!courseIdString) {
      throw Error('Unable to fetch documents due to missing course ID');
    }
    try {
      const res = await GetDocumentsByCourseId(courseIdString);
      logger(res, 'Fetched documents successfully');
      setDocuments(res || []);
      setLastRetrieved(`Last retrieved: ${new Date().toLocaleString()}`);
    } catch (error) {
      if (isApiError(error)) {
        createErrorToast(error.message);
      } else {
        createErrorToast(`An unexpected error occurred.`);
      }
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
        } catch (error) {
          logger(error, `${file.name} fails to upload.`);
          if (isApiError(error)) {
            createErrorToast(error.message);
          } else {
            createErrorToast(`An unexpected error occurred.`);
          }
        }
      }
      createInfoToast('File(s) have been uploaded successfully!');
    } finally {
      await fetchDocuments();
      setIsUploading(false);
    }
  };

  const handleRetry = async (documentId: string) => {
    try {
      await UpdateDocument({
        courseId: courseIdString,
        documentId,
        status: DocumentStatus.Processing,
      });
      logger('Document updated successfully');
      await fetchDocuments();
    } catch (error) {
      logger(error, `${documentId} fails to retry.`);
      if (isApiError(error)) {
        createErrorToast(error.message);
      } else {
        createErrorToast(`An unexpected error occurred.`);
      }
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
      logger(error, `${documentId} fails to delete.`);
      if (isApiError(error)) {
        createErrorToast(error.message);
      } else {
        createErrorToast(`An unexpected error occurred.`);
      }
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (courseIdString) {
      fetchDocuments();
      setIsLoading(false);
      intervalId = setInterval(fetchDocuments, 60000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [courseIdString, fetchDocuments]);

  return (
    <div className='p-4'>
      {/* Files section */}
      <h1 className='text-2xl font-semibold mb-4 text-blue-600'>
        Course Materials
      </h1>

      {/* Upload section */}
      <div className='mb-4'>
        <FileUpload onUpload={handleUpload} isUploading={isUploading} />
      </div>

      {/* Files section */}
      <div className='mb-2'>
        {isLoading ? (
          <DocumentTableSkeleton />
        ) : documents.length === 0 ? (
          <EmptyState
            title='Hey there!'
            description={[
              'Upload your course materials here.',
              'AI Pal will process them to build a smart knowledge base.',
              'This helps the AI give you better, more personalized answers!',
            ]}
            tip='Tip: Smaller documents work best! Customize templates for faster responses and more precise results.'
          />
        ) : (
          <DocumentTable>
            {documents.map((document) => (
              <DocumentRow
                key={document.id}
                name={document.filename}
                status={document.status}
                error={document.error}
                timestamp={document.createdAt}
                size={`${(document.size / 1024).toFixed(2)} KB`}
                onDelete={() => handleDelete(document.id)}
                onRetry={() => handleRetry(document.id)}
              />
            ))}
          </DocumentTable>
        )}
      </div>

      {/* Refresh section */}
      <div className='flex items-center mb-4'>
        {lastRetrieved && (
          <p className='text-sm text-gray-500 ml-2'>{lastRetrieved}</p>
        )}
        <IconButton
          variant='ghost'
          icon={MaterialsIcons.RefreshCcw}
          onClick={fetchDocuments}
          className='text-gray-500 hover:text-primary-500'
        />
      </div>
    </div>
  );
};

export default Materials;
