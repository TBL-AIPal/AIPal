export interface Document extends DocumentMetadata {
  data: Buffer;
  text: string;
}

export interface DocumentMetadata {
  id: string;
  filename: string;
  contentType: DocumentContentType;
  status: DocumentStatus;
  error?: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentFormValues {
  courseId: string;
  formData: FormData;
}

export interface DocumentUpdateInput {
  filename?: string;
  status?: DocumentStatus;
}

export enum DocumentContentType {
  PDF = 'application/pdf',
  // Add other content types here
}

export enum DocumentStatus {
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
};