import { useFormContext } from 'react-hook-form';

import { FormItem, FormLabel } from '@/components/ui/Form';

export const DescriptionForm = () => {
  const { register } = useFormContext();

  return (
    <FormItem>
      <FormLabel htmlFor='description'>Description</FormLabel>
      <textarea
        id='description'
        {...register('description', { required: true })}
        placeholder='Enter course description'
        rows={4}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
      />
    </FormItem>
  );
};
