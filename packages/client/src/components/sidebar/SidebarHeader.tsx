import React from 'react';

import { cn } from '@/lib/utils/utils';

interface SidebarHeaderProps {
  headerText: string;
  className?: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  headerText,
  className,
}) => {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-color-primary-900 flex items-center justify-between',
        className
      )}
    >
      <h1 className='text-xl font-semibold text-blue-600'>{headerText}</h1>
    </div>
  );
};

export default SidebarHeader;
