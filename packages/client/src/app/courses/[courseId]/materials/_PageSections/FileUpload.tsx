import React, { useState } from 'react';

interface FileUploadProps {
  onUpload: (files: FileList) => Promise<void>;
  isUploading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isUploading }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    try {
      await onUpload(selectedFiles);
    } catch (error) {
      console.error('Error during file upload:', error);
    } finally {
      setSelectedFiles(null);
    }
  };

  return (
    <form className='max-w-lg mx-auto'>
      <label
        className='block mb-2 text-sm font-medium text-gray-900'
        htmlFor='file_upload'
      >
        Upload files
      </label>
      <div className='flex items-center justify-between'>
        {/* File Input */}
        <input
          className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none'
          aria-describedby='file_upload_help'
          id='file_upload'
          type='file'
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {/* Upload Button */}
        <button
          type='button'
          className='ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none'
          style={{ minWidth: '100px' }}
          onClick={handleUpload}
          disabled={!selectedFiles || isUploading} // Disable button if no files are selected or upload is in progress
        >
          <div
            className={`flex items-center justify-center space-x-2 ${
              isUploading ? 'cursor-not-allowed' : ''
            }`}
            style={{ width: '80px', height: '20px' }}
          >
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
      {/* Help Text */}
      <div className='mt-1 text-sm text-gray-500' id='file_upload_help'>
        Only PDF files are supported.
      </div>
    </form>
  );
};

export default FileUpload;