import React from 'react';

import TemplateRow from '@/components/tables/template/TemplateRow';

interface Template {
  name: string;
  constraints: string[];
}

interface TemplateTableProps {
  templates: Template[];
}

const TemplateTable: React.FC<TemplateTableProps> = ({ templates }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border border-gray-300'>
        <thead className='bg-gray-100'>
          <th className='border-b py-3 px-4 text-left'>Template Name</th>
          <th className='border-b py-3 px-4 text-left'>Constraints</th>
        </thead>
        <tbody>
          {templates.map((template, index) => (
            <TemplateRow
              key={index}
              name={template.name}
              constraints={template.constraints}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TemplateTable;
