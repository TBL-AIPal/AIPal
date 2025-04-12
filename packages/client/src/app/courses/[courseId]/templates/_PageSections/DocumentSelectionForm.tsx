import React from 'react';

import { DocumentMetadata } from '@/lib/types/document';

import { FormItem, FormLabel } from '@/components/ui/Form';
import SelectableList from '@/components/ui/SelectableList';

import DocumentStatusIndicator from './DocumentStatusIndicator';

interface DocumentSelectionFormProps {
  documents: DocumentMetadata[];
  onSelectionChange?: (selectedDocumentIds: string[]) => void;
  initialSelectedIds?: string[];
}

const DocumentSelectionForm: React.FC<DocumentSelectionFormProps> = ({
  documents,
  onSelectionChange,
  initialSelectedIds,
}) => {
  const getDocumentId = (document: DocumentMetadata): string => document.id;

  // Function to generate the content for each document
  const getDocumentContent = (document: DocumentMetadata): React.ReactNode => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          gap: '8px',
        }}
      >
        {/* Status Indicator */}
        <DocumentStatusIndicator status={document.status} />
        {/* Document Name */}
        <span
          style={{
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#374151',
          }}
        >
          {document.filename}
        </span>
      </div>
    );
  };

  return (
    <FormItem>
      {/* Label */}
      <FormLabel htmlFor='documentSelection'>Course Materials</FormLabel>

      {/* Document List */}
      {documents.length > 0 ? (
        <div id='document-selection'>
          <SelectableList
            items={documents}
            getId={getDocumentId}
            getContent={getDocumentContent}
            onChange={onSelectionChange}
            selectedIds={initialSelectedIds}
          />
        </div>
      ) : (
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          No course materials added yet.
        </p>
      )}
    </FormItem>
  );
};

export default DocumentSelectionForm;
