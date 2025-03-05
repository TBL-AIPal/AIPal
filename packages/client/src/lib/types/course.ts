export interface APIKeys {
  gemini?: string;
  llama?: string;
  chatgpt?: string;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  apiKeys: APIKeys; // ✅ Now allows partial API keys
  llmConstraints: string[];
  owner: string;
  students: string[];
  staff: string[];
  whitelist: string[]; // ✅ Supports email whitelisting
  documents: string[];
  templates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormValues {
  name: string;
  description?: string;
  apiKeys: Partial<APIKeys>; // ✅ Allows optional API keys
  llmConstraints?: string[];
  owner?: string;
  students?: string[];
  staff?: string[];
  whitelist?: string[]; // ✅ Included for form handling
  documents?: string[];
  templates?: string[];
}

export interface CourseCreateInput {
  name: string;
  description?: string;
  apiKeys?: Partial<APIKeys>; // ✅ Allows setting only some API keys
  whitelist?: string[]; // ✅ Allows optional whitelist when creating a course
}

export interface CourseUpdateInput {
  name?: string;
  description?: string;
  apiKeys?: Partial<APIKeys>; // ✅ Allows partial API key updates
  llmConstraints?: string[];
  owner?: string;
  students?: string[];
  staff?: string[];
  whitelist?: string[]; // ✅ Allows updating the whitelist
}