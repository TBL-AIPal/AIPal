import React from 'react';
import { Course } from '@/lib/types/course';
import Gallery from '@/components/gallery/Gallery';
import Skeleton from '@/components/Skeleton';

import { DeleteCourse } from '@/lib/API/course/mutations';
import { createErrorToast } from '@/lib/utils/toast';

const IMAGE_COUNT = 8;
const backgroundImages = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `/images/background/${i + 1}.png`,
);

interface CourseGalleryProps {
  courses: Course[];
  isLoading: boolean;
  onDelete: () => void;
}

const CourseGallery: React.FC<CourseGalleryProps> = ({
  courses,
  isLoading,
  onDelete,
}) => {
  const handleDelete = async (courseId: string) => {
    try {
      await DeleteCourse(courseId);
      onDelete();
    } catch (error) {
      createErrorToast('Failed to delete course. Please try again.');
    }
  };

  const galleryItems = courses.map((course, index) => {
    const imageIndex = index % IMAGE_COUNT;
    const sequentialImage = backgroundImages[imageIndex];

    return {
      src: sequentialImage,
      href: `/courses/${course.id}/overview`,
      overlayContent: <h3 className='text-lg font-bold'>{course.name}</h3>,
      hoverContent: (
        <div className='relative h-full'>
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete(course.id);
            }}
            className='absolute top-2 right-2 p-2 bg-transparent text-white hover:bg-grey-800'
            aria-label='Delete course'
          >
            {/* X Icon */}
            <span className='text-xl font-bold text-white hover:bg-grey-800'>×</span>
          </button>
          {/* Course details */}
          <div className='text-center'>
            <h3 className='text-lg font-bold'>{course.name}</h3>
            <p className='mt-1 text-sm'>{course.description}</p>
          </div>
        </div>
      ),
    };
  });

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[...Array(6)].map((_, index) => (
          <div key={index} className='space-y-2'>
            <Skeleton className='w-full h-48 rounded-md' />
            <Skeleton className='w-3/4 h-6 rounded' />
            <Skeleton className='w-1/2 h-4 rounded' />
          </div>
        ))}
      </div>
    );
  }

  return <Gallery images={galleryItems} />;
};

export default CourseGallery;
