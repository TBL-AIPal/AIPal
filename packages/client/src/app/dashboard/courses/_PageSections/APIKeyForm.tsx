import { useFormContext } from 'react-hook-form';

import { FormItem, FormLabel } from '@/components/ui/Form';
import { CourseFormValues } from '@/lib/types/course';

export const APIKeyForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  return (
    <>
      <FormItem>
        <FormLabel htmlFor="apiKeys.gemini">Gemini API Key</FormLabel>
        <input
          id="apiKeys.gemini"
          {...register('apiKeys.gemini')}
          placeholder="Enter Gemini API key"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </FormItem>

      <FormItem>
        <FormLabel htmlFor="apiKeys.llama">Llama API Key</FormLabel>
        <input
          id="apiKeys.llama"
          {...register('apiKeys.llama')}
          placeholder="Enter Llama API key"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </FormItem>

      <FormItem>
        <FormLabel htmlFor="apiKeys.chatgpt">ChatGPT API Key <span className="text-red-500">*</span>
        </FormLabel>
        <input
          id="apiKeys.chatgpt"
          {...register('apiKeys.chatgpt', { required: 'ChatGPT API key is required.' })}
          placeholder="Enter ChatGPT API key"
          className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5
            ${errors.apiKeys?.chatgpt
              ? 'border-red-500 text-red-900 placeholder-red-400 dark:border-red-500 dark:text-red-400'
              : 'border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'}
          `}
        />
        {errors.apiKeys?.chatgpt && (
          <p className="text-red-500 text-sm mt-1">{errors.apiKeys.chatgpt.message}</p>
        )}
      </FormItem>
    </>
  );
};
