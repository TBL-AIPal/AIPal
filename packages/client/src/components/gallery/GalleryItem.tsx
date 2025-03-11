import ImageWithLoader from '@/components/ImageWithLoader';
import UnstyledLink from '@/components/links/UnstyledLink';

interface GalleryItemProps {
  src: string;
  href: string;
  overlayContent?: React.ReactNode;
  hoverContent?: React.ReactNode;
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
      <div className='relative h-48 w-full rounded-lg overflow-hidden'>
        <ImageWithLoader
          src={src}
          alt={imageAlt}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover transition-opacity duration-300'
        />
      </div>

      {/* Non-hover overlay */}
      <div className='absolute inset-0 flex items-center justify-center bg-black/30 p-4 transition-opacity duration-300 group-hover:opacity-0'>
        <div className='overflow-y-auto w-full h-full'>
          {overlayContent}
        </div>
      </div>

      {/* Hover overlay */}
      <div className='absolute inset-0 flex items-center justify-center bg-black/60 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
        <div className='overflow-y-auto w-full h-full'>
          {hoverContent}
        </div>
      </div>
    </UnstyledLink>
  );
};

export default GalleryItem;