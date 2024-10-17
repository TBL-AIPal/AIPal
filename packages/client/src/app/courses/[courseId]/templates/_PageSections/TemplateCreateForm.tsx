'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { TemplateFormValues } from '@/lib/types/template';

import { Form } from '@/components/ui/Form';

import { ConstraintForm } from './ConstraintForm';
import { TemplateForm } from './TemplateForm';

interface TemplateCreateFormProps {
  onCreateTemplate: (template: TemplateFormValues) => void;
}

const TemplateCreateForm: React.FC<TemplateCreateFormProps> = ({
  onCreateTemplate,
}) => {
  const formMethods = useForm<TemplateFormValues>({
    defaultValues: {
      name: '',
      constraints: [],
    },
  });

  const { handleSubmit, reset, watch } = formMethods;

  const template = watch();

  const handleAddConstraint = (constraint: string) => {
    const currentConstraints = template.constraints || [];
    const newConstraints = [...currentConstraints, constraint];
    formMethods.setValue('constraints', newConstraints);
  };

  const onSubmit = (data: TemplateFormValues) => {
    if (data.name.trim()) {
      onCreateTemplate(data);
      reset();
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)} className='border rounded-md'>
        <TemplateForm
          template={template}
          onTemplateChange={formMethods.setValue}
        />
        <ConstraintForm
          constraints={template.constraints || []}
          onAddConstraint={handleAddConstraint}
        />
        <button
          type='submit'
          className='mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          Create Template
        </button>
      </Form>
    </FormProvider>
  );
};

export { TemplateCreateForm };
