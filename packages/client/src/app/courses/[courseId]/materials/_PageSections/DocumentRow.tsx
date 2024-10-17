import { Trash2 } from 'lucide-react';
import React from 'react';

import IconButton from '@/components/buttons/IconButton';

interface DocumentRowProps {
  name: string;
  timestamp: string;
  size: string;
  onDelete: () => void;
}

const DocumentRow: React.FC<DocumentRowProps> = ({
  name,
  timestamp,
  size,
  onDelete,
}) => {
  return (
    <tr className='hover:bg-gray-50'>
      <td className='px-4 py-2 border-b text-center'>{name}</td>
      <td className='px-4 py-2 border-b text-center'>{timestamp}</td>
      <td className='px-4 py-2 border-b text-center'>{size}</td>
      <td className='px-4 py-2 border-b text-center'>
        <IconButton
          icon={Trash2}
          variant='ghost'
          classNames={{ icon: 'text-red-500' }}
          onClick={onDelete}
        />
      </td>
    </tr>
  );
};

export default DocumentRow;
