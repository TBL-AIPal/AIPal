import logger from '@/lib/utils/logger';
import { createErrorToast } from '@/lib/utils/toast';
import React, { useState } from 'react';

interface FileUploadProps {
  onUpload: (files: FileList) => Promise<void>;
  isUploading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isUploading }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Validate file types (only PDFs allowed)
      const invalidFiles = Array.from(files).filter(
        (file) => !file.type.includes('application/pdf'),
      );
      if (invalidFiles.length > 0) {
        createErrorToast('Only PDF files are supported.');
        return;
      }

      // Update state with selected files
      setSelectedFiles(files);
    } else {
      setSelectedFiles(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFiles) return;

    try {
      await onUpload(selectedFiles);
    } catch (error) {
      createErrorToast('An error occurred while uploading files. Please try again.');
      logger(error, 'Error during file upload');
    } finally {
      setSelectedFiles(null);
    }
  };

  return (
    <div className='flex items-center'>
      {/* Hidden File Input */}
      <input
        className='hidden'
        aria-describedby='file_upload_help'
        id='file_upload'
        type='file'
        multiple
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Custom File Input Button */}
      <button
        type='button'
        className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
        onClick={() => document.getElementById('file_upload')?.click()}
        disabled={isUploading}
        aria-live='polite'
      >
        {selectedFiles
          ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
          : 'Choose files'}
      </button>

      {/* Divider */}
      <div className='mx-2'></div>

      {/* Upload Button */}
      <button
        type='button'
        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
          isUploading || !selectedFiles
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        style={{ minWidth: '100px' }}
        onClick={handleUpload}
        disabled={!selectedFiles || isUploading}
      >
        <div className='flex items-center justify-center space-x-2'>
          {isUploading ? (
            // Spinning Animation
            <svg
              className='animate-spin h-5 w-5 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8v8H4z'
              ></path>
            </svg>
          ) : (
            <span>Upload</span>
          )}
        </div>
      </button>
    </div>
  );
};

export default FileUpload;