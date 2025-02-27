import * as React from 'react';

import { cn } from '@/lib/utils/utils';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl'; // New size prop for modal width
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ title, onClose, children, size = 'md', className, ...props }, ref) => {
    // Map size prop to width classes
    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-3xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'relative p-4 w-full',
            sizeClasses[size],
            'max-h-full animate-fade-in-up'
          )}
        >
          <div className='relative rounded-lg shadow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-300'>
            <div className='flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                {title}
              </h3>
              <button
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                onClick={onClose}
              >
                <svg
                  className='w-3 h-3'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <div className='p-4'>{children}</div>
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal };
