import React from 'react';

interface DocumentTableProps {
  children: React.ReactNode;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ children }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border border-gray-300'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-4 py-2 border-b'>Filename</th>
            <th className='px-4 py-2 border-b'>Timestamp</th>
            <th className='px-4 py-2 border-b'>Size</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
