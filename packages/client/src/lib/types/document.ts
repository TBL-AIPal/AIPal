export interface Document {
  id: string;
  filename: string;
  data: Buffer;
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
