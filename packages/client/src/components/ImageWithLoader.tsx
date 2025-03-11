import Image from 'next/image';
import React from 'react';

import Skeleton from '@/components/Skeleton';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  src,
  alt,
  fill = false,
  sizes,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <>
      {!isLoaded && (
        <Skeleton className='absolute inset-0 rounded-md' />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={`
          ${className}
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300
        `}
        onLoadingComplete={() => setIsLoaded(true)}
        style={{ objectFit: 'cover' }}
      />
    </>
  );
};

export default ImageWithLoader;