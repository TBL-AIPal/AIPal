import React from 'react';

interface DocumentRowProps {
  name: string;
  timestamp: string;
  size: string;
}

const DocumentRow: React.FC<DocumentRowProps> = ({ name, timestamp, size }) => {
  return (
    <tr className='hover:bg-gray-50'>
      <td className='px-4 py-2 border-b'>{name}</td>
      <td className='px-4 py-2 border-b'>{timestamp}</td>
      <td className='px-4 py-2 border-b'>{size}</td>
    </tr>
  );
};

export default DocumentRow;
