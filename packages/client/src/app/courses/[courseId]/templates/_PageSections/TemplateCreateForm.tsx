'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { DocumentMetadata } from '@/lib/types/document';
import { TemplateFormValues } from '@/lib/types/template';

import { Form } from '@/components/ui/Form';

import { ConstraintForm } from './ConstraintForm';
import DocumentSelectionForm from './DocumentSelectionForm';
import { TemplateForm } from './TemplateForm';

interface TemplateCreateFormProps {
  onCreateTemplate: (template: TemplateFormValues) => void;
  documents: DocumentMetadata[];
}

const TemplateCreateForm: React.FC<TemplateCreateFormProps> = ({
  onCreateTemplate,
  documents,
}) => {
  const formMethods = useForm<TemplateFormValues>({
    defaultValues: {
      name: '',
      constraints: [],
      documents: [],
    },
  });

  const { handleSubmit, reset, watch } = formMethods;
  const template = watch();

  const handleConstraintChange = (newConstraints: string[]) => {
    formMethods.setValue('constraints', newConstraints);
  };

  const handleDocumentSelectionChange = (selectedDocumentIds: string[]) => {
    formMethods.setValue('documents', selectedDocumentIds);
  };

  const onSubmit = (data: TemplateFormValues) => {
    if (data.name.trim()) {
      onCreateTemplate(data);
      reset();
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)} className='border rounded-md p-4'>
        {/* Template Form */}
        <TemplateForm
          template={template}
          onTemplateChange={formMethods.setValue}
        />

        {/* Constraint Form */}
        <ConstraintForm
          constraints={template.constraints || []}
          onConstraintChange={handleConstraintChange}
        />

        {/* Document Selection Form */}
        <div className='mt-4'>
          {documents.length > 0 ? (
            <DocumentSelectionForm
              documents={documents}
              onSelectionChange={handleDocumentSelectionChange}
            />
          ) : (
            <p>No documents uploaded yet.</p>
          )}
        </div>

        {/* Submit Button */}
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