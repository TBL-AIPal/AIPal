import React from 'react';

import { TemplateFormValues } from '@/lib/types/template';

import { FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';

interface TemplateFormProps {
  template: TemplateFormValues;
  onTemplateChange: (field: keyof TemplateFormValues, value: string) => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  onTemplateChange,
}) => {
  return (
    <div className='space-y-4'>
      <FormItem>
        <FormLabel htmlFor='templateName'>Template Name</FormLabel>
        <Input
          id='templateName'
          type='text'
          value={template.name}
          onChange={(e) => onTemplateChange('name', e.target.value)}
          placeholder='Enter template name'
        />
      </FormItem>
    </div>
  );
};

export { TemplateForm };
