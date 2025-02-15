import React, { useEffect, useState } from 'react';

import Sidebar from '@/components/sidebar/Sidebar';

import { sidebarConfig } from '@/constant/config/course';

interface CourseSidebarProps {
  courseId: string;
  headerText: string;
  className?: string;
  userRole: string; // New prop for user role
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseId,
  headerText,
  className,
  userRole, // Accept the user role as a prop
}) => {
  const items = sidebarConfig.getItems(courseId, userRole); // Pass user role to getItems

  return (
    <Sidebar items={items} headerText={headerText} className={className} />
  );
};

export default CourseSidebar;
