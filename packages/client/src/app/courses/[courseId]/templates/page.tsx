'use client';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { GetDocumentsByCourseId } from '@/lib/API/document/queries'; // Import the document fetching function
import {
  CreateTemplate,
  DeleteTemplate,
  UpdateTemplate,
} from '@/lib/API/template/mutations';
import { GetTemplatesByCourseId } from '@/lib/API/template/queries';
import { Document } from '@/lib/types/document';
import { Template, TemplateUpdateInput } from '@/lib/types/template';
import logger from '@/lib/utils/logger';

import TextButton from '@/components/buttons/TextButton';
import { Modal } from '@/components/ui/Modal';

import { TemplateCreateForm } from './_PageSections/TemplateCreateForm';
import TemplateTable from './_PageSections/TemplateTable';

const TemplatesPage = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const fetchTemplates = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const templates = await GetTemplatesByCourseId(courseIdString);
      setTemplates(templates || []);
      logger(templates);
    } catch (error) {
      logger(error, 'Error fetching templates');
    }
  }, [courseIdString]);

  const fetchDocuments = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const fetchedDocuments = await GetDocumentsByCourseId(courseIdString);
      setDocuments(fetchedDocuments || []);
    } catch (err) {
      logger(err, 'Error fetching documents');
    }
  }, [courseIdString]);

  const handleAddTemplate = async (templateData: {
    name: string;
    constraints?: string[];
    documents?: string[];
  }) => {
    if (!courseIdString) return;
    setLoading(true);
    try {
      await CreateTemplate({
        courseId: courseIdString,
        name: templateData.name,
        constraints: templateData.constraints,
        documents: templateData.documents,
      });
      logger(templateData, 'Template added successfully');
      await fetchTemplates();
    } catch (error) {
      logger(error, 'Failed to add template');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!courseIdString) return;
    try {
      await DeleteTemplate({ courseId: courseIdString, templateId });
      logger('Template deleted successfully');
      await fetchTemplates();
    } catch (error) {
      logger(error, 'Failed to delete template');
    }
  };

  const handleUpdateTemplate = async (
    templateId: string,
    updatedData: TemplateUpdateInput
  ) => {
    if (!courseIdString) return;
    setLoading(true);
    try {
      await UpdateTemplate({
        courseId: courseIdString,
        templateId,
        name: updatedData.name,
        constraints: updatedData.constraints,
        documents: updatedData.documents,
      });
      logger('Template updated successfully');
      await fetchTemplates();
    } catch (error) {
      logger(error, 'Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchDocuments();
  }, [fetchTemplates, fetchDocuments]);

  return (
    <div className='p-4'>
      {/* Template Table */}
      <div>
        <h1 className='text-2xl font-semibold mb-2 text-blue-600'>Templates</h1>
        <TemplateTable
          templates={templates}
          courseDocuments={documents}
          onDelete={handleDeleteTemplate}
          onUpdate={handleUpdateTemplate}
        />
      </div>

      {/* Add Template Button */}
      <TextButton
        className='fixed bottom-6 right-6 bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg'
        variant='primary'
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
      >
        {loading ? 'Adding...' : '+ Add Template'}
      </TextButton>

      {/* Template Modal with the TemplateCreateForm */}
      {isModalOpen && (
        <Modal title='Add New Template' onClose={() => setIsModalOpen(false)}>
          <TemplateCreateForm
            onCreateTemplate={(newTemplate) => {
              handleAddTemplate(newTemplate);
            }}
            documents={documents}
          />
        </Modal>
      )}
    </div>
  );
};

export default TemplatesPage;
