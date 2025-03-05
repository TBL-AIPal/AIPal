import { useFormContext } from 'react-hook-form';

import { FormItem, FormLabel } from '@/components/ui/Form';

export const APIKeyForm = () => {
  const { register } = useFormContext();

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
        <FormLabel htmlFor="apiKeys.chatgpt">ChatGPT API Key</FormLabel>
        <input
          id="apiKeys.chatgpt"
          {...register('apiKeys.chatgpt')}
          placeholder="Enter ChatGPT API key"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </FormItem>
    </>
  );
};