'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { GetCourseById } from '@/lib/API/course/queries';
import { Course } from '@/lib/types/course';
import logger from '@/lib/utils/logger';
import { cn } from '@/lib/utils/utils';

import SidebarItem from '@/components/sidebar/SidebarItem';

import { sidebarConfig } from '@/constant/config/course';

interface SidebarItemType {
  name: string;
  icon: React.ElementType;
  link: string;
}

const CourseLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { courseId } = useParams();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [userRole, setUserRole] = useState('student');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sidebarItems, setSidebarItems] = useState<SidebarItemType[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await GetCourseById(courseIdString);
        setCourse(courseData);
      } catch (error) {
        logger(error, 'Unable to fetch course');
      }
    };

    const user = localStorage.getItem('user');
    if (user) {
      const { role } = JSON.parse(user);
      setUserRole(role || 'student');
    }

    fetchCourse();
  }, [courseIdString]);

  useEffect(() => {
    if (courseIdString && userRole) {
      setSidebarItems(sidebarConfig.getItems(courseIdString, userRole));
    }
  }, [courseIdString, userRole]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 text-gray-800 rounded-r-lg shadow-md transition-transform duration-300 transform",
          !sidebarOpen && "-translate-x-full",
          isMobile ? 'md:hidden' : 'hidden'
        )}
      >
        <div className="h-full overflow-y-auto">
          {/* Mobile Header */}
          <div className="px-6 py-4 bg-color-primary-900 flex items-center justify-between">
            <h3 className="text-xxl font-semibold text-blue-600">
              {course?.name || 'Course'}
            </h3>
            <button 
              onClick={toggleSidebar}
              className="text-blue-600 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.link}
                name={item.name}
                icon={item.icon}
                link={item.link}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col w-64 bg-gray-100 text-gray-800 rounded-tr-lg shadow-md",
          !isMobile && "md:flex"
        )}
      >
        {/* Desktop Header */}
        <div className="px-6 pt-6 pb-4 bg-color-primary-900">
          <h3 className="text-xl font-semibold text-blue-600">
            {course?.name || 'Course Details'}
          </h3>
        </div>
        {/* Divider Line */}
        <div className="border-b border-gray-300 mx-4"></div>
        {/* Desktop Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto space-y-2">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.link}
              name={item.name}
              icon={item.icon}
              link={item.link}
            />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-y-auto">
        {/* Mobile Header */}
        <div
          className={cn(
            "md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-100 border-b",
            "flex items-center justify-between px-4 py-3 rounded-b-lg"
          )}
        >
          <button
            onClick={toggleSidebar}
            className="text-gray-800 text-2xl focus:outline-none"
          >
            ☰
          </button>
          <h2 className="text-xxl font-semibold text-blue-600">
            {course?.name || 'Course Details'}
          </h2>
          <div className="w-8"></div>
        </div>

        {/* Content Area */}
        <div className={cn(
          "p-6 pt-16 md:pt-6 h-full overflow-y-auto",
          sidebarOpen && "md:ml-64"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CourseLayout;