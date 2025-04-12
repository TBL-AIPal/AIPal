'use client';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { GetDocumentsByCourseId } from '@/lib/API/document/queries';
import {
  CreateTemplate,
  DeleteTemplate,
  UpdateTemplate,
} from '@/lib/API/template/mutations';
import { GetTemplatesByCourseId } from '@/lib/API/template/queries';
import { DocumentMetadata } from '@/lib/types/document';
import { Template, TemplateUpdateInput } from '@/lib/types/template';
import logger from '@/lib/utils/logger';
import { createErrorToast, createInfoToast } from '@/lib/utils/toast';

import TextButton from '@/components/buttons/TextButton';
import EmptyState from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

import { TemplateCreateForm } from './_PageSections/TemplateCreateForm';
import TemplateTable from './_PageSections/TemplateTable';

const TemplatesPage = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);

  const fetchTemplates = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const templates = await GetTemplatesByCourseId(courseIdString);
      setTemplates(templates || []);
      logger(templates);
    } catch (error) {
      createErrorToast('Unable to retrieve templates. Please try again later.');
    }
  }, [courseIdString]);

  const fetchDocuments = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const fetchedDocuments = await GetDocumentsByCourseId(courseIdString);
      setDocuments(fetchedDocuments || []);
    } catch (err) {
      createErrorToast('Unable to retrieve documents. Please try again later.');
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
      createInfoToast('Template created successfully!');
      await fetchTemplates();
    } catch (error) {
      createErrorToast('Unable to add template. Please try again later.');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!courseIdString) return;
    try {
      await DeleteTemplate({ courseId: courseIdString, templateId });
      createInfoToast('Template deleted successfully');
      await fetchTemplates();
    } catch (error) {
      createErrorToast('Unable to delete template. Please try again later.');
    }
  };

  const handleUpdateTemplate = async (
    templateId: string,
    updatedData: TemplateUpdateInput,
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
      createInfoToast('Template updated successfully');
      await fetchTemplates();
    } catch (error) {
      createErrorToast('Unable to update template. Please try again later.');
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
      <div>
        <h1 className='text-2xl font-semibold mb-4 text-blue-600'>Templates</h1>
        {templates.length === 0 ? (
          // Empty State
          <EmptyState
            title='Create Your First Template!'
            description={[
              'Templates let you customize how the AI responds in chat rooms.',
              'For example, ask for responses in Chinese or limit replies to certain materials.',
              'Choose which uploaded materials the AI should use for context.',
            ]}
          />
        ) : (
          // Template Table
          <TemplateTable
            templates={templates}
            courseDocuments={documents}
            onDelete={handleDeleteTemplate}
            onUpdate={handleUpdateTemplate}
          />
        )}
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
            onCreateTemplate={handleAddTemplate}
            documents={documents}
          />
        </Modal>
      )}
    </div>
  );
};

export default TemplatesPage;
