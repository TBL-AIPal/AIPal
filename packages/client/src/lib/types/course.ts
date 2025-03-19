export interface APIKeys {
  gemini?: string;
  llama?: string;
  chatgpt?: string;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  apiKeys: APIKeys; // Updated to support multiple API keys
  llmConstraints: string[];
  owner: string;
  students: string[];
  staff: string[];
  whitelist: string[]; // New field for storing whitelisted emails
  documents: string[];
  templates: string[];
  tutorialGroups?: TutorialGroup[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface TutorialGroup {
  _id: string;
  name: string;
  students: Student[]; // Array of student objects instead of just IDs
}

export interface CourseFormValues {
  name: string;
  description?: string;
  apiKeys: Partial<APIKeys>; // Updated to support multiple API keys
  llmConstraints?: string[];
  owner?: string;
  students?: string[];
  staff?: string[];
  whitelist?: string[]; // Include whitelist field for form handling
  documents?: string[];
  templates?: string[];
}

export interface CourseCreateInput {
  name: string;
  description?: string;
  apiKeys?: Partial<APIKeys>; // Allow setting multiple API keys when creating a course
  whitelist?: string[]; // Allow setting a whitelist when creating a course
}

export interface CourseUpdateInput {
  name?: string;
  description?: string;
  apiKeys?: Partial<APIKeys>; // Allow updating multiple API keys
  llmConstraints?: string[];
  owner?: string;
  students?: string[];
  staff?: string[];
  whitelist?: string[]; // Allow updating the whitelist
}
