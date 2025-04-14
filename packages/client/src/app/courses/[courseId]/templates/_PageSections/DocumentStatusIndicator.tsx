import React from 'react';

import { DocumentStatus } from '@/lib/types/document';

import { MaterialsIcons } from '@/components/Icons';

interface DocumentStatusIndicatorProps {
  status: DocumentStatus;
}

const DocumentStatusIndicator: React.FC<DocumentStatusIndicatorProps> = ({
  status,
}) => {
  let icon, color;

  switch (status) {
    case 'completed':
      icon = <MaterialsIcons.CheckCircle className='w-4 h-4' />;
      color = 'text-green-500';
      break;
    case 'failed':
      icon = <MaterialsIcons.XCircle className='w-4 h-4' />;
      color = 'text-red-500';
      break;
    case 'processing':
      icon = (
        <div className='animate-pulse w-2 h-2 bg-yellow-500 rounded-full'></div>
      );
      color = '';
      break;
    default:
      return null;
  }

  return <span className={`inline-flex items-center ${color}`}>{icon}</span>;
};

export default DocumentStatusIndicator;
