import React from 'react';
import { Info } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string[];
  tip?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, tip }) => {
  return (
    <div className='rounded-2xl px-8 py-16 text-center space-y-4 bg-gray-50 shadow-sm my-8'>
      {/* Icon */}
      <Info className='h-16 w-16 mx-auto text-gray-300' />

      {/* Title */}
      <h2 className='text-xl font-semibold text-gray-800 py-4'>{title}</h2>

      {/* Description */}
      <p className='text-base text-gray-600 leading-relaxed py-2'>
        {description.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>

      {/* Tip (if provided) */}
      {tip && (
        <p className='text-sm text-gray-500 mt-4'>
          {tip}
        </p>
      )}
    </div>
  );
};

export default EmptyState;