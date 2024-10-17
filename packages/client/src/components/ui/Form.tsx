import * as React from 'react';

import { cn } from '@/lib/utils/utils';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: () => void;
  children: React.ReactNode;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmit, children, className, ...props }, ref) => (
    <form
      ref={ref}
      className={cn('p-4', className)}
      onSubmit={onSubmit}
      {...props}
    >
      <div className='grid gap-4 mb-4'>{children}</div>
    </form>
  )
);
Form.displayName = 'Form';

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  )
);
FormItem.displayName = 'FormItem';

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  children: React.ReactNode;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ htmlFor, children, className, ...props }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
);
FormLabel.displayName = 'FormLabel';

export { Form, FormItem, FormLabel };
