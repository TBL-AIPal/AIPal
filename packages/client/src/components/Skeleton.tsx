import * as React from 'react';

import { cn } from '@/lib/utils/utils';

interface SkeletonProps extends React.ComponentPropsWithoutRef<'div'> {
  width?: string;
  height?: string;
}

export default function Skeleton({ className, width, height, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn('animate-shimmer bg-[#f6f7f8]', className)}
      style={{
        backgroundImage:
          'linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)',
        backgroundSize: '700px 100%',
        backgroundRepeat: 'no-repeat',
        width: width || '100%',
        height: height || '1rem',
      }}
      {...rest}
    />
  );
}
