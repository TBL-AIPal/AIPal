'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CreateCourse } from '@/lib/API/course/mutations';
import { APIKeys, CourseCreateInput, CourseFormValues } from '@/lib/types/course';
import logger from '@/lib/utils/logger';

import { Form } from '@/components/ui/Form';

import { APIKeyForm } from './APIKeyForm';
import { DescriptionForm } from './DescriptionForm';
import { NameForm } from './NameForm';

interface AddFormProps {
  course: CourseCreateInput;
  onCourseCreated: () => void;
}

export default function CourseCreateForm({ course, onCourseCreated }: AddFormProps) {
  const router = useRouter();
  const { name, description, apiKeys } = course;

  const formMethods = useForm<CourseFormValues>({
    defaultValues: {
      name,
      description,
      apiKeys: apiKeys || { gemini: '', llama: '', chatgpt: '' },
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = async (values: CourseFormValues) => {
    const { name, description, apiKeys } = values;

    // ✅ Ensure filteredApiKeys has the correct type
    const filteredApiKeys: Partial<APIKeys> = Object.fromEntries(
      Object.entries(apiKeys).filter(([_, value]) => value.trim() !== '')
    );

    // Ensure at least one key is provided
    if (Object.keys(filteredApiKeys).length === 0) {
      alert('Please provide at least one API key.');
      return;
    }
    
    try {
      await CreateCourse({ name, description, apiKeys: filteredApiKeys });
      reset({ name: '', description: '', apiKeys: { gemini: '', llama: '', chatgpt: '' } });
      router.refresh();
      onCourseCreated();
    } catch (err) {
      logger(err);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <NameForm />
        <DescriptionForm />
        <APIKeyForm />

        <button
          type='submit'
          disabled={isSubmitting}
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700'
        >
          {isSubmitting ? 'Submitting...' : 'Create Course'}
        </button>
      </Form>
    </FormProvider>
  );
}
