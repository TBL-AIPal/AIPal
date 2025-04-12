import React from 'react';

import { cn } from '@/lib/utils/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-sm font-medium rounded-full hover:bg-opacity-80 transition',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};

export { Tag };
