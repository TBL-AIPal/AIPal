import React, { useState } from 'react';

interface FileUploadProps {
  onUpload: (files: FileList) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (selectedFiles) {
      await onUpload(selectedFiles);
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
        <input
          className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none'
          aria-describedby='file_upload_help'
          id='file_upload'
          type='file'
          multiple
          onChange={handleFileChange}
        />
        <button
          type='button'
          className='ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          onClick={handleUpload}
          disabled={!selectedFiles}
        >
          Upload
        </button>
      </div>
      <div className='mt-1 text-sm text-gray-500' id='file_upload_help'>
        Make sure the file format is supported.
      </div>
    </form>
  );
};

export default FileUpload;
