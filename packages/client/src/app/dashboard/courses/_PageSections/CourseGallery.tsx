import React from 'react';

import { Course } from '@/lib/types/course';

import Gallery from '@/components/gallery/Gallery';

interface CourseGalleryProps {
  courses: Course[];
}

const CourseGallery: React.FC<CourseGalleryProps> = ({ courses }) => {
  const galleryItems = courses.map((course) => ({
    // TODO: Set images randomly
    src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg',
    href: `/courses/${course.id}/overview`,
    overlayContent: <h3 className='text-lg font-bold'>{course.name}</h3>,
    hoverContent: (
      <div className='text-center'>
        <h3 className='text-lg font-bold'>{course.name}</h3>
        <p className='mt-1 text-sm'>{course.description}</p>
      </div>
    ),
  }));

  return <Gallery images={galleryItems} />;
};

export default CourseGallery;
