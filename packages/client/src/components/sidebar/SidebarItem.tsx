import React from 'react';

import { cn } from '@/lib/utils/utils';

import UnstyledLink from '@/components/links/UnstyledLink';

interface SidebarItemProps {
  name: string;
  icon: React.ElementType;
  link: string;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  icon: Icon,
  link,
  className,
}) => {
  return (
    <UnstyledLink
      href={link}
      className={cn(
        'flex items-center p-2 mb-2 text-blue-600 hover:bg-gray-300 hover:text-white rounded-lg transition',
        className
      )}
    >
      <Icon />
      <span className='ml-3'>{name}</span>
    </UnstyledLink>
  );
};

export default SidebarItem;
