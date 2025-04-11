import React from 'react';

import { DocumentStatus } from '@/lib/types/document';

import IconButton from '@/components/buttons/IconButton';
import { MaterialsIcons } from '@/components/Icons';
import { createErrorToast } from '@/lib/utils/toast';

interface DocumentRowProps {
  name: string;
  timestamp: string;
  size: string;
  status: DocumentStatus;
  error?: string;
  onDelete: () => void;
  onRetry: () => void;
}

const DocumentRow: React.FC<DocumentRowProps> = ({
  name,
  timestamp,
  size,
  status,
  error,
  onDelete,
  onRetry,
}) => {
  // Helper function to determine the status indicator
  const getStatusIndicator = (status: DocumentStatus) => {
    let icon, color, tooltipText;

    switch (status) {
      case 'completed':
        icon = <MaterialsIcons.CheckCircle className="w-4 h-4" />;
        color = 'text-green-500';
        tooltipText = 'Successfully processed. Ready for use!';
        break;
      case 'failed':
        icon = <MaterialsIcons.XCircle className="w-4 h-4" />;
        color = 'text-red-500';
        tooltipText = 'Processing failed. Click to view details.';
        break;
      case 'processing':
        icon = (
          <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full"></div>
        );
        color = '';
        tooltipText = 'Processing... Please wait.';
        break;
      default:
        return null;
    }

    return (
      <div className="relative inline-flex items-center group">
        {/* Status Indicator */}
        <span className={`inline-flex items-center ${color}`}>{icon}</span>
        {/* Tooltip */}
        <div
          className={`absolute left-full top-1/2 transform -translate-y-1/2 translate-x-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
            status === 'failed' ? 'cursor-pointer' : ''
          }`}
          onClick={() => {
            if (status === 'failed') {
              createErrorToast(error || 'Unexpected error occurred. Please contact admin.');
            }
          }}
        >
          {tooltipText}
        </div>
      </div>
    );
  };


  return (
    <tr className='hover:bg-gray-50'>
      <td className='px-4 py-2 border-b text-center'>
        {getStatusIndicator(status)}
      </td>
      <td className='px-4 py-2 border-b text-center'>{name}</td>
      <td className='px-4 py-2 border-b text-center'>{timestamp}</td>
      <td className='px-4 py-2 border-b text-center'>{size}</td>
      <td className='px-4 py-2 border-b text-center'>
        <IconButton
          icon={MaterialsIcons.Trash2}
          variant='ghost'
          classNames={{ icon: 'text-red-500' }}
          onClick={onDelete}
        />
        {status === 'failed' && (
          <IconButton
            icon={MaterialsIcons.RotateCw}
            variant='ghost'
            classNames={{ icon: 'text-blue-500' }}
            onClick={onRetry}
          />
        )}
      </td>
    </tr>
  );
};

export default DocumentRow;
