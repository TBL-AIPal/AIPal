import React from 'react';

import { Course } from '@/lib/types/course';

import Gallery from '@/components/gallery/Gallery';

const IMAGE_COUNT = 8; // Update this to match the total number of images in your folder

const backgroundImages = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `/images/background/${i + 1}.png`
);

interface CourseGalleryProps {
  courses: Course[];
}

const CourseGallery: React.FC<CourseGalleryProps> = ({ courses }) => {
  const galleryItems = courses.map((course) => {
    // Randomly select an image
    const randomImage =
      backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    return {
      src: randomImage,
      href: `/courses/${course.id}/overview`,
      overlayContent: <h3 className='text-lg font-bold'>{course.name}</h3>,
      hoverContent: (
        <div className='text-center'>
          <h3 className='text-lg font-bold'>{course.name}</h3>
          <p className='mt-1 text-sm'>{course.description}</p>
        </div>
      ),
    };
  });

  return <Gallery images={galleryItems} />;
};

export default CourseGallery;
