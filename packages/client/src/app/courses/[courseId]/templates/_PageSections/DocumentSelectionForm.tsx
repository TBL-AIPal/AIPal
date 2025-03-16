import React from 'react';

import { DocumentMetadata } from '@/lib/types/document';

import CheckboxList from '@/components/ui/CheckboxList';
import { FormItem, FormLabel } from '@/components/ui/Form';

interface DocumentSelectionFormProps {
  documents: DocumentMetadata[];
  onSelectionChange?: (selectedDocumentIds: string[]) => void;
}

const DocumentSelectionForm: React.FC<DocumentSelectionFormProps> = ({
  documents,
  onSelectionChange,
}) => {
  const getDocumentId = (document: DocumentMetadata): string => document.id;
  const getDocumentLabel = (document: DocumentMetadata): string => document.filename;

  return (
    <FormItem>
      {/* Label for the document selection */}
      <FormLabel htmlFor='documentSelection'>Select Documents</FormLabel>

      {/* Checkbox list for document selection */}
      <div id='document-selection'>
        <CheckboxList
          items={documents}
          getId={getDocumentId}
          getLabel={getDocumentLabel}
          onChange={onSelectionChange}
        />
      </div>
    </FormItem>
  );
};

export default DocumentSelectionForm;
