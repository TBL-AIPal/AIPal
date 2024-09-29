import React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  link: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name, icon, link }) => {
  return (
    <UnstyledLink
      href={link}
      className='flex items-center p-2 mb-2 text-blue-600 hover:bg-gray-300 hover:text-white rounded-lg transition'
    >
      {icon}
      <span className='ml-3'>{name}</span>
    </UnstyledLink>
  );
};

export default SidebarItem;
