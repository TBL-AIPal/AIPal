import React from 'react';

import { cn } from '@/lib/utils/utils';

import SidebarHeader from '@/components/sidebar/SidebarHeader';
import SidebarItem from '@/components/sidebar/SidebarItem';

interface SidebarProps {
  items: Array<{ name: string; icon: React.ElementType; link: string }>;
  headerText: string;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, headerText, className }) => {
  return (
    <aside
      className={cn(
        'p-4 w-64 h-screen bg-gray-100 text-gray-800 rounded-lg shadow-md flex flex-col',
        className
      )}
    >
      <SidebarHeader headerText={headerText} />
      <nav className='flex-1 mt-5'>
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            name={item.name}
            icon={item.icon}
            link={item.link}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
