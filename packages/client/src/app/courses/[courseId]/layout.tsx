'use client';

import { Menu } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { GetCourseById } from '@/lib/API/course/queries';
import { Course } from '@/lib/types/course';
import logger from '@/lib/utils/logger';
import { cn } from '@/lib/utils/utils';

import Button from '@/components/buttons/Button';

import CourseSidebar from './_PageSections/CourseSidebar';

const CourseLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Fetch course details
    const fetchCourse = async () => {
      try {
        const courseData = await GetCourseById(courseIdString);
        setCourse(courseData);
      } catch (err) {
        logger(err, 'Error fetching course details');
      }
    };
    fetchCourse();

    // Get user role
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      setUserRole(userData?.role || 'student');
    }
  }, [courseIdString]);

  return (
    <div className='grid md:grid-cols-[240px_1fr] grid-cols-1 h-screen'>
      {/* Mobile Toggle Button */}
      <div className='md:hidden p-4 bg-white dark:bg-gray-900 border-b'>
        <Button
          variant='ghost'
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='w-full justify-start'
        >
          <Menu className='mr-2' />
          {sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
        </Button>
      </div>

      {/* Responsive Sidebar */}
      <div
        className={cn(
          'relative md:sticky md:top-0 md:h-screen md:w-full overflow-y-auto bg-white dark:bg-gray-900 transition-all duration-300',
          isMobile && (sidebarOpen ? 'block' : 'hidden'),
          isMobile && sidebarOpen && 'z-50 shadow-lg',
        )}
      >
        <div className='md:sticky top-0'>
          <CourseSidebar
            courseId={courseIdString}
            headerText={course ? course.name : 'Course Details'}
            userRole={userRole}
            sidebarOpen={sidebarOpen}
          />
        </div>
      </div>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 p-6 overflow-y-auto transition-all duration-300',
          isMobile && sidebarOpen && 'md:ml-64',
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
