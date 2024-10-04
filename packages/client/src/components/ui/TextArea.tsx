import * as React from 'react';

import { cn } from '@/lib/utils/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, value, onChange, placeholder, ...props }, ref) => {
    return (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className={cn(
          'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white',
          className
        )}
        placeholder={placeholder}
        ref={ref}
        rows={4}
        required
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
