import React from 'react';

import GalleryItem from '@/components/gallery/GalleryItem';

interface Image {
  src: string;
  href: string;
  overlayContent?: React.ReactNode;
  hoverContent?: React.ReactNode;
}

interface GalleryProps {
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {images.map((image, index) => (
        <GalleryItem
          key={index}
          src={image.src}
          href={image.href}
          overlayContent={image.overlayContent}
          hoverContent={image.hoverContent}
        />
      ))}
    </div>
  );
};

export default Gallery;
