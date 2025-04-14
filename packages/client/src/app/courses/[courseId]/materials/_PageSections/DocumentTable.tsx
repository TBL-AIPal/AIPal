import React from 'react';

interface DocumentTableProps {
  children: React.ReactNode;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ children }) => {
  return (
    <div className='my-6 overflow-x-auto rounded-lg shadow-md'>
      <table className='w-full border-collapse bg-white text-sm'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-4 py-2 border-b'></th>
            <th className='px-4 py-2 border-b'>Filename</th>
            <th className='px-4 py-2 border-b'>Timestamp</th>
            <th className='px-4 py-2 border-b'>Size</th>
            <th className='px-4 py-2 border-b'>Actions</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
