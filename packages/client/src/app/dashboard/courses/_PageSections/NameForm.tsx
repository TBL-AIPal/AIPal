import { useFormContext } from 'react-hook-form';

import { FormItem, FormLabel } from '@/components/ui/Form';
import { CourseFormValues } from '@/lib/types/course';

export const NameForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  return (
    <FormItem>
      <FormLabel htmlFor='name'>
        Course Name <span className="text-red-500">*</span>
      </FormLabel>
      <input
        id='name'
        {...register('name', { required: 'Course name is required.' })}
        placeholder='Enter course name'
        className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5
          ${errors.name
            ? 'border-red-500 text-red-900 placeholder-red-400 dark:border-red-500 dark:text-red-400'
            : 'border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
        `}
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
      )}
    </FormItem>
  );
};