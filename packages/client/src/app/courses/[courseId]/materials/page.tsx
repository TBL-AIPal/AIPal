'use client';

import React from 'react';

import logger from '@/lib/logger';

import FileUpload from '@/components/FileUpload';
import DocumentRow from '@/components/tables/document/DocumentRow';
import DocumentTable from '@/components/tables/document/DocumentTable';

// TODO: Replace with API call
const documents = [
  {
    name: 'Project Proposal',
    timestamp: '2024-09-01T12:34:56Z',
    size: '1.2 MB',
  },
  { name: 'Research Paper', timestamp: '2024-09-10T09:15:30Z', size: '2.5 MB' },
  { name: 'Meeting Notes', timestamp: '2024-09-15T14:45:00Z', size: '800 KB' },
  {
    name: 'Presentation Slides',
    timestamp: '2024-09-20T11:20:10Z',
    size: '3.4 MB',
  },
  {
    name: 'Financial Report',
    timestamp: '2024-09-22T08:50:15Z',
    size: '1.5 MB',
  },
  { name: 'User Manual', timestamp: '2024-09-25T16:30:25Z', size: '2.1 MB' },
  {
    name: 'Code Documentation',
    timestamp: '2024-09-28T10:00:00Z',
    size: '500 KB',
  },
];

const Materials: React.FC = () => {
  // TODO: Connect to actual API endpoint
  const handleUpload = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        logger('Files uploaded successfully!');
      } else {
        logger('File upload failed.');
      }
    } catch (error) {
      logger(error, 'Error uploading file');
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
        {documents.map((document, index) => (
          <DocumentRow
            key={index}
            name={document.name}
            timestamp={document.timestamp}
            size={document.size}
          />
        ))}
      </DocumentTable>
    </div>
  );
};

export default Materials;
