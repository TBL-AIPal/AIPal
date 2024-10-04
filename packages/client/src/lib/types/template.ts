export interface Template {
  id: string;
  name: string;
  constraints: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFormValues {
  name: string;
  constraints?: string[];
}

export interface TemplateCreateInput {
  name: string;
  constraints?: string[];
}

export interface TemplateUpdateInput {
  name?: string;
  constraints?: string[];
}
