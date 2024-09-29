import React, { useEffect, useState } from 'react';

import { get, post } from '@/lib/apiUtils';
import logger from '@/lib/logger';

import TextButton from '@/components/buttons/TextButton';
import Gallery from '@/components/gallery/Gallery';
import CourseModal from '@/components/modals/CourseModal';

import { jwtToken } from '@/constant/env';

interface Course {
  id: string;
  name: string;
  description: string;
  apiKey: string;
}

const CoursesContent = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await get<{ results: Course[] }>('/v1/courses', jwtToken);
        setCourses(data.results);
      } catch (error) {
        logger(error, 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const images = courses.map((course) => ({
    src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg',
    title: course.name,
    description: course.description,
    href: `/courses/${course.id}/overview`,
  }));

  const handleAddCourse = async (newCourse: {
    name: string;
    description: string;
    apiKey: string;
  }) => {
    setLoading(true);
    // TODO: Modify how owner is set upon creation
    const courseWithOwner = { ...newCourse, owner: '66f7eb4b31e23a3668e5b2ad' };
    const optimisticCourse: Course = {
      id: Date.now().toString(),
      ...courseWithOwner,
    };

    try {
      setCourses((prevCourses) => [...prevCourses, optimisticCourse]);

      const response = await post<Course, typeof courseWithOwner>(
        '/v1/courses',
        courseWithOwner,
        jwtToken
      );

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === optimisticCourse.id ? response : course
        )
      );
      logger(response, 'Successfully added a new course');
    } catch (error) {
      logger(error, 'Failed to add course');
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== optimisticCourse.id)
      );
      setError('Failed to add course. Please try again.');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className='relative text-center'>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <Gallery images={images} />
      )}

      {/* Add Course button */}
      <TextButton
        className='fixed bottom-6 right-6 bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg'
        variant='primary'
        onClick={() => setIsModalOpen(true)}
        disabled={loading} // Disable button while loading
      >
        {loading ? 'Adding...' : '+ Add Course'}
      </TextButton>

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </div>
  );
};

export default CoursesContent;
