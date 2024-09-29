'use client';

import {
  DatabaseIcon,
  LayoutDashboardIcon,
  PanelsTopLeftIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import '@/styles/colors.css';

import { get } from '@/lib/apiUtils';
import logger from '@/lib/logger';

import Sidebar from '@/components/sidebar/Sidebar';

import { jwtToken } from '@/constant/env';

const getSidebarItems = (courseId: string) => [
  {
    name: 'Overview',
    icon: <PanelsTopLeftIcon />,
    link: `/courses/${courseId}/overview`,
  },
  {
    name: 'Materials',
    icon: <DatabaseIcon />,
    link: `/courses/${courseId}/materials`,
  },
  {
    name: 'Templates',
    icon: <SlidersHorizontalIcon />,
    link: `/courses/${courseId}/templates`,
  },
  { name: 'Dashboard', icon: <LayoutDashboardIcon />, link: `/dashboard/` },
];

interface Course {
  id: string;
  name: string;
  description?: string;
  apiKey: string;
  llmConstraints?: string[];
  owner: string;
  students?: string[];
  staff?: string[];
  documents?: string[];
  template?: string[];
}

interface CourseLayoutProps {
  children: React.ReactNode;
  params: { courseId: string };
}

const CourseLayout: React.FC<CourseLayoutProps> = ({ children, params }) => {
  const { courseId } = params;
  const [courseTitle, setCourseTitle] = useState<string>('Course Title');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await get<Course>(
          `/v1/courses/${courseId}?t=${Date.now()}`,
          jwtToken
        );
        logger(response, 'API RESPONSE');

        if (response) {
          setCourseTitle(response.name);
        } else {
          setError('Course details not found');
        }
      } catch (error) {
        logger(error, 'Failed to fetch course details');
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  return (
    <div className='flex'>
      <Sidebar
        items={getSidebarItems(courseId)}
        headerText={loading ? 'Loading...' : courseTitle}
      />
      <main className='flex-1 p-4 overflow-y-auto h-screen'>
        {loading && <p>Loading course content...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
