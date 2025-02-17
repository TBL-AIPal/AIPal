import Image from 'next/image';
import React, { ReactNode } from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

interface GalleryItemProps {
  src: string;
  href: string;
  overlayContent?: ReactNode; // Non-hover overlay content
  hoverContent?: ReactNode; // Hover overlay content
  imageAlt?: string;
  width?: number;
  height?: number;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  src,
  href,
  overlayContent,
  hoverContent,
  imageAlt = 'Gallery Image',
  width = 400,
  height = 300,
}) => {
  return (
    <UnstyledLink href={href} className='relative block group'>
      {/* Image */}
      <Image
        className='h-auto max-w-full rounded-lg'
        src={src}
        alt={imageAlt}
        layout='responsive'
        width={width}
        height={height}
      />

      {/* Non-hover overlay content */}
      <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-30 text-white p-4 group-hover:opacity-0 transition-opacity duration-300 rounded-lg'>
        <div className='w-full overflow-y-auto scrollbar-thin scrollbar-webkit'>
          {overlayContent}
        </div>
      </div>

      {/* Hover overlay content */}
      <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-60 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg'>
        <div className='w-full h-4/5 overflow-y-auto scrollbar-thin scrollbar-webkit'>
          {hoverContent}
        </div>
      </div>
    </UnstyledLink>
  );
};

export default GalleryItem;
