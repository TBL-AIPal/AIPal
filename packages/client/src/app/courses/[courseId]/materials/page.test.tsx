import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Materials from './page';

// Mocking next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ courseId: 'course123' })),
}));

// Mocking API functions
jest.mock('@/lib/API/document/queries', () => ({
  GetDocumentsByCourseId: jest.fn(),
}));

jest.mock('@/lib/API/document/mutations', () => ({
  CreateDocument: jest.fn(),
  DeleteDocument: jest.fn(),
}));

// Mocking utility functions
jest.mock('@/lib/utils/toast', () => ({
  createErrorToast: jest.fn(),
  createInfoToast: jest.fn(),
}));

jest.mock('@/lib/utils/logger', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mocking components
jest.mock('./_PageSections/FileUpload', () => ({
  __esModule: true,
  default: ({ onUpload }: { onUpload: (files: FileList) => void }) => (
    <input
      type="file"
      data-testid="file-input"
      onChange={(e) => {
        if (e.target.files) {
          onUpload(e.target.files);
        }
      }}
    />
  ),
}));

jest.mock('./_PageSections/DocumentRow', () => ({
  __esModule: true,
  default: ({
    name,
    onDelete,
  }: {
    name: string;
    onDelete: () => void;
  }) => (
    <div>
      <span>{name}</span>
      <button onClick={onDelete}>Delete</button>
    </div>
  ),
}));

jest.mock('./_PageSections/DocumentTable', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="document-table">{children}</div>
  ),
}));

jest.mock('./_PageSections/DocumentTableSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton">Loading...</div>,
}));

jest.mock('@/components/ui/EmptyState', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('Materials Component', () => {
  const mockDocuments = [
    {
      id: 'doc1',
      filename: 'test.pdf',
      createdAt: '2025-04-18T00:00:00Z',
      size: 2048,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton initially', async () => {
    const { GetDocumentsByCourseId } = require('@/lib/API/document/queries');
    GetDocumentsByCourseId.mockResolvedValueOnce([]);

    render(<Materials />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no documents are available', async () => {
    const { GetDocumentsByCourseId } = require('@/lib/API/document/queries');
    GetDocumentsByCourseId.mockResolvedValueOnce([]);

    render(<Materials />);
    await waitFor(() => {
      expect(screen.getByText('Hey there!')).toBeInTheDocument();
    });
  });

  it('renders documents when available', async () => {
    const { GetDocumentsByCourseId } = require('@/lib/API/document/queries');
    GetDocumentsByCourseId.mockResolvedValueOnce(mockDocuments);

    render(<Materials />);
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });

  it('handles file upload successfully', async () => {
    const { GetDocumentsByCourseId } = require('@/lib/API/document/queries');
    const { CreateDocument } = require('@/lib/API/document/mutations');
    const { createInfoToast } = require('@/lib/utils/toast');

    GetDocumentsByCourseId.mockResolvedValueOnce([]);
    CreateDocument.mockResolvedValueOnce({});
    GetDocumentsByCourseId.mockResolvedValueOnce(mockDocuments);

    render(<Materials />);

    const file = new File(['dummy content'], 'upload.txt', {
      type: 'text/plain',
    });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(CreateDocument).toHaveBeenCalledWith({
        courseId: 'course123',
        formData: expect.any(FormData),
      });
      expect(createInfoToast).toHaveBeenCalledWith(
        'Files have been uploaded successfully!'
      );
    });
  });

  it('handles file deletion successfully', async () => {
    const { GetDocumentsByCourseId } = require('@/lib/API/document/queries');
    const { DeleteDocument } = require('@/lib/API/document/mutations');
    const { createInfoToast } = require('@/lib/utils/toast');

    GetDocumentsByCourseId.mockResolvedValueOnce(mockDocuments);
    DeleteDocument.mockResolvedValueOnce({});
    GetDocumentsByCourseId.mockResolvedValueOnce([]);

    render(<Materials />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Delete');
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(DeleteDocument).toHaveBeenCalledWith({
        courseId: 'course123',
        documentId: 'doc1',
      });
      expect(createInfoToast).toHaveBeenCalledWith(
        'File have been deleted successfully!'
      );
    });
  });
});
