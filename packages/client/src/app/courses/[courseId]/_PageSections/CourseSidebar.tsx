import React from 'react';

import Sidebar from '@/components/sidebar/Sidebar';

import { sidebarConfig } from '@/constant/config/course';

interface CourseSidebarProps {
  courseId: string;
  headerText: string;
  className?: string;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseId,
  headerText,
  className,
}) => {
  const items = sidebarConfig.getItems(courseId);

  return (
    <Sidebar items={items} headerText={headerText} className={className} />
  );
};

export default CourseSidebar;
