export interface Course {
  id: string;
  name: string;
  description?: string;
  apiKey: string;
  llmConstraints: string[];
  owner: string;
  students: string[];
  staff: string[];
  documents: string[];
  templates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormValues {
  name: string;
  description?: string;
  apiKey: string;
  llmConstraints?: string[];
  owner?: string;
  students?: string[];
  staff?: string[];
  documents?: string[];
  templates?: string[];
}

export interface CourseCreateInput {
  name: string;
  description?: string;
  apiKey: string;
}

export interface CourseUpdateInput {
  name?: string;
  description?: string;
  apiKey?: string;
  llmConstraints?: string[];
  owner?: string;
  students?: string[];
  staff?: string[];
}
