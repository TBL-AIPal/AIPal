'use client';

import React, { useEffect, useState } from 'react';

import { GetCourseByUserId } from '@/lib/API/course/queries';
import { Course } from '@/lib/types/course';
import logger from '@/lib/utils/logger';

import TextButton from '@/components/buttons/TextButton';
import { Modal } from '@/components/ui/Modal';

import CourseCreateForm from './_PageSections/CourseCreateForm';
import CourseGallery from './_PageSections/CourseGallery';

export default function CoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const fetchedCourses = await GetCourseByUserId();
      setCourses(fetchedCourses);
    } catch (err) {
      logger(err, 'Error fetching courses by user ID');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className='relative text-center'>
      <TextButton
        className='fixed bottom-6 right-6 bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg'
        variant='primary'
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
      >
        {loading ? 'Adding...' : '+ Add Course'}
      </TextButton>

      {isModalOpen && (
        <Modal title='Add New Course' onClose={handleModalClose}>
          <CourseCreateForm
            course={{ name: '', description: '', apiKey: '' }}
            onCourseCreated={() => {
              handleModalClose();
              fetchCourses();
            }}
          />
        </Modal>
      )}

      <div className='mt-8'>
        <CourseGallery courses={courses} />
      </div>
    </div>
  );
}
