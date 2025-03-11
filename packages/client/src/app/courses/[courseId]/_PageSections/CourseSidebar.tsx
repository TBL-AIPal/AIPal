'use client';

import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils/utils';

import Sidebar from '@/components/sidebar/Sidebar';

import { sidebarConfig } from '@/constant/config/course';

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  link: string;
}

interface CourseSidebarProps {
  courseId: string;
  headerText: string;
  className?: string;
  userRole: string; // New prop for user role
  sidebarOpen: boolean;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseId,
  headerText,
  className,
  userRole,
  sidebarOpen,
}) => {
  const [items, setItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    setItems(sidebarConfig.getItems(courseId, userRole));
  }, [courseId, userRole]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className='md:hidden p-4 bg-white dark:bg-gray-900 border-b'>
        <button
          onClick={() => {}}
          className='w-full flex items-center justify-between text-blue-600 font-semibold'
        >
          {headerText}
          <span>{sidebarOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'md:relative md:w-64 md:h-screen md:overflow-y-auto bg-white dark:bg-gray-900 transition-all duration-300',
          sidebarOpen ? 'block' : 'hidden md:block',
          className,
        )}
      >
        <Sidebar
          items={items}
          headerText={headerText}
          className='h-full'
        />
      </aside>
    </>
  );
};

export default CourseSidebar;