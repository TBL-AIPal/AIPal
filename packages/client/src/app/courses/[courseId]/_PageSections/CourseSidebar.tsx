'use client'; // ✅ Ensure this runs only on the client

import React, { useEffect, useState } from 'react';

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
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseId,
  headerText,
  className,
  userRole,
}) => {
  const [items, setItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    setItems(sidebarConfig.getItems(courseId, userRole));
  }, [courseId, userRole]); // ✅ Only runs on the client when `courseId` or `userRole` changes

  return <Sidebar items={items} headerText={headerText} className={className} />;
};

export default CourseSidebar;