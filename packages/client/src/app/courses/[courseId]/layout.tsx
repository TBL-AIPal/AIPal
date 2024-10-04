'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { GetCourseById } from '@/lib/API/course/queries';
import { Course } from '@/lib/types/course';
import logger from '@/lib/utils/logger';

import CourseSidebar from './_PageSections/CourseSidebar';

const CourseLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;

  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await GetCourseById(courseIdString);
        setCourse(courseData);
      } catch (err) {
        logger(err, 'Error fetching course details');
      }
    };
    fetchCourse();
  }, [courseIdString]);

  return (
    <div className='flex'>
      <CourseSidebar
        courseId={courseIdString}
        headerText={course ? course.name : 'Course Details'}
      />
      <main className='flex-1 p-6'>{children}</main>
    </div>
  );
};

export default CourseLayout;
