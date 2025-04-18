'use client';
import React, { useEffect, useState } from 'react';

import { GetCoursesForUser } from '@/lib/API/course/queries';
import { Course } from '@/lib/types/course';
import { User } from '@/lib/types/user';
import logger from '@/lib/utils/logger';
import { createErrorToast, createInfoToast } from '@/lib/utils/toast';

import TextButton from '@/components/buttons/TextButton';
import { Modal } from '@/components/ui/Modal';

import CourseCreateForm from './_PageSections/CourseCreateForm';
import CourseGallery from './_PageSections/CourseGallery';

export default function CoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<User | null>(null); // To store user data
  const [canAddCourse, setCanAddCourse] = useState(false); // To track if user can add courses
  const [isAdmin, setIsAdmin] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const fetchedCourses = await GetCoursesForUser(); // Fetch courses based on user role
      setCourses(fetchedCourses);
    } catch (err) {
      createErrorToast('Unable to retrieve courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data and check permissions
  const fetchUser = async () => {
    try {
      const userString = localStorage.getItem('user'); // Get the user object from localStorage
      if (!userString) {
        logger('User not authenticated', 'Error: No user in localStorage');
        createErrorToast('Access denied. Please log in to proceed.');
        return;
      }

      const userData = JSON.parse(userString); // Parse the stored user object
      setUser(userData); // Store user data in state

      // Check if the user is admin
      if (userData.role === 'admin') {
        setIsAdmin(true);
        setCanAddCourse(true); // Admins can add courses
      } else if (
        userData.role === 'teacher' &&
        userData.status === 'approved'
      ) {
        setCanAddCourse(true); // Approved teachers can add courses
      }
    } catch (err) {
      logger(err, 'Error fetching user data');
      createErrorToast(`Unable to retrieve user's data. Please try again later.`);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user, isAdmin]);

  return (
    <div className='relative text-center'>
      {/* Conditionally show the Add Course button if the user is an admin or approved teacher */}
      {canAddCourse && (
        <TextButton
          className='fixed bottom-6 right-6 bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg'
          variant='basic'
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          Add Course
        </TextButton>
      )}

      {/* Modal for Adding a New Course */}
      {isModalOpen && (
        <Modal title='Add New Course' onClose={handleModalClose}>
          <CourseCreateForm
            course={{
              name: '',
              description: '',
              apiKeys: { gemini: '', llama: '', chatgpt: '' }, // Updated to include multiple API keys
            }}
            onCourseCreated={() => {
              handleModalClose();
              fetchCourses();
              createInfoToast('Course added successfully!');
            }}
          />
        </Modal>
      )}

      {/* Course Gallery */}
      <div className='mt-8'>
        <CourseGallery courses={courses} isLoading={loading} onDelete={() => {
          fetchCourses();
          createInfoToast('Course deleted successfully!');
        }}/>
      </div>
    </div>
  );
}
