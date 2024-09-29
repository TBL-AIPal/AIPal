import React from 'react';

interface SidebarHeaderProps {
  headerText: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ headerText }) => {
  return (
    <div className='px-6 py-4 bg-color-primary-900 flex items-center justify-between'>
      <h1 className='text-xl font-semibold text-blue-600'>{headerText}</h1>
    </div>
  );
};

export default SidebarHeader;
