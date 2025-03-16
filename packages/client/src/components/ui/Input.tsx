import * as React from 'react';

import { cn } from '@/lib/utils/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      value,
      onChange,
      placeholder,
      type = 'text',
      required = true,
      ...props
    },
    ref
  ) => {
    return (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={cn(
          'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white',
          className
        )}
        placeholder={placeholder}
        ref={ref}
        required={required}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };