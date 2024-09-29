'use client';

import React, { useState } from 'react';

import logger from '@/lib/logger';

import TextButton from '@/components/buttons/TextButton';
import TemplateModal from '@/components/modals/TemplateModal';
import TemplateTable from '@/components/tables/template/TemplateTable';

const TemplatesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: replace with fetched data
  const [templates, setTemplates] = useState([
    { name: 'Template 1', constraints: ['Constraint A', 'Constraint B'] },
    { name: 'Template 2', constraints: ['Constraint C'] },
  ]);

  // TODO: Connect to the correct API endpoints
  const handleAddTemplate = async (templateData: {
    name: string;
    constraints: string[];
  }) => {
    setLoading(true);
    try {
      // Simulate adding the template and update the state
      setTemplates((prev) => [...prev, templateData]);
      logger(templateData, 'Template data');
    } catch (error) {
      logger(error, 'Failed to add template');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className='p-4'>
      {/* Template Table */}
      <div>
        <h1 className='text-2xl font-semibold mb-2 text-blue-600'>Templates</h1>
        <TemplateTable templates={templates} />
      </div>

      {/* Add template button */}
      <TextButton
        className='fixed bottom-6 right-6 bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg'
        variant='primary'
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
      >
        {loading ? 'Adding...' : '+ Add Template'}
      </TextButton>

      {/* Template Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTemplate={handleAddTemplate}
      />
    </div>
  );
};

export default TemplatesPage;
