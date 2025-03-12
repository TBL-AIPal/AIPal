export interface Document extends DocumentMetadata {
  data: Buffer;
  text: string;
}

export interface DocumentMetadata {
  id: string;
  filename: string;
  contentType: DocumentContentType;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentFormValues {
  courseId: string;
  formData: FormData;
}

export enum DocumentContentType {
  PDF = 'application/pdf',
  // Add other content types here
}
