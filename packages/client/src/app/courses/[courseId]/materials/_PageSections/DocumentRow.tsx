import React from 'react';

import { DocumentStatus } from '@/lib/types/document';

import IconButton from '@/components/buttons/IconButton';
import { MaterialsIcons } from '@/components/Icons';

interface DocumentRowProps {
  name: string;
  timestamp: string;
  size: string;
  status: DocumentStatus;
  onDelete: () => void;
  onRetry: () => void;
}

const DocumentRow: React.FC<DocumentRowProps> = ({
  name,
  timestamp,
  size,
  status,
  onDelete,
  onRetry,
}) => {
  // Helper function to determine the status indicator
  const getStatusIndicator = (status: DocumentStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center">
            <MaterialsIcons.CheckCircle className="w-4 h-4 text-green-500 mr-2" />
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center">
            <MaterialsIcons.XCircle className="w-4 h-4 text-red-500 mr-2" />
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center">
            <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 border-b text-center">{getStatusIndicator(status)}</td>
      <td className="px-4 py-2 border-b text-center">{name}</td>
      <td className="px-4 py-2 border-b text-center">{timestamp}</td>
      <td className="px-4 py-2 border-b text-center">{size}</td>
      <td className="px-4 py-2 border-b text-center">
        <IconButton
          icon={MaterialsIcons.Trash2}
          variant="ghost"
          classNames={{ icon: 'text-red-500' }}
          onClick={onDelete}
        />
        {status === 'failed' && (
          <IconButton
            icon={MaterialsIcons.RotateCw}
            variant="ghost"
            classNames={{ icon: 'text-blue-500' }}
            onClick={onRetry}
          />
        )}
      </td>
    </tr>
  );
};

export default DocumentRow;