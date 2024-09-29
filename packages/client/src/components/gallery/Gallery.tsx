import React from 'react';

import GalleryItem from '@/components/gallery/GalleryItem';

interface Image {
  src: string;
  title: string;
  description: string;
  href: string;
}

interface GalleryProps {
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      {images.map((image, index) => (
        <GalleryItem
          key={index}
          src={image.src}
          title={image.title}
          description={image.description}
          href={image.href}
        />
      ))}
    </div>
  );
};

export default Gallery;
