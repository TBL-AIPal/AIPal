import React, { ReactNode } from 'react';

import ImageWithLoader from '@/components/ImageWithLoader';
import UnstyledLink from '@/components/links/UnstyledLink';

interface GalleryItemProps {
  src: string;
  href: string;
  overlayContent?: ReactNode;
  hoverContent?: ReactNode;
  imageAlt?: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  src,
  href,
  overlayContent,
  hoverContent,
  imageAlt = 'Gallery Image',
}) => {
  return (
    <UnstyledLink href={href} className='relative block group h-full'>
      {/* Image Container */}
      <div className='relative aspect-w-4 aspect-h-3 min-h-[300px] w-full rounded-lg overflow-hidden'>
        <ImageWithLoader
          src={src}
          alt={imageAlt}
          fill
          sizes='(max-width: 820px) 100vw, (max-width: 1080px) 50vw, (max-width: 1440px) 33vw, 25vw'
          className='object-cover transition-opacity duration-300'
        />
      </div>

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