import Image from 'next/image';
import React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

interface GalleryItemProps {
  src: string;
  title: string;
  description: string;
  href: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  src,
  title,
  description,
  href,
}) => {
  return (
    <UnstyledLink href={href} className='relative block group'>
      <Image
        className='h-auto max-w-full rounded-lg'
        src={src}
        alt={title}
        layout='responsive'
        width={400}
        height={300}
      />
      {/* Title overlay */}
      <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-2 transition-opacity duration-300 opacity-100 group-hover:opacity-0 rounded-lg'>
        {title}
      </div>
      {/* Description overlay */}
      <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg'>
        {description}
      </div>
    </UnstyledLink>
  );
};

export default GalleryItem;
