import React from 'react';

import { DocumentMetadata } from '@/lib/types/document';
import { Template, TemplateUpdateInput } from '@/lib/types/template';

import TemplateRow from '@/app/courses/[courseId]/templates/_PageSections/TemplateRow';
interface TemplateTableProps {
  templates: Template[];
  courseDocuments: DocumentMetadata[];
  onDelete: (templateId: string) => void;
  onUpdate: (templateId: string, updatedData: TemplateUpdateInput) => void;
}

const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
  courseDocuments,
  onDelete,
  onUpdate,
}) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border border-gray-300'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='border-b py-3 px-4 text-left'>Name</th>
            <th className='border-b py-3 px-4 text-left'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <TemplateRow
              key={template.id}
              template={template}
              courseDocuments={courseDocuments}
              onDelete={() => onDelete(template.id)}
              onUpdate={(updatedData) => onUpdate(template.id, updatedData)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TemplateTable;
