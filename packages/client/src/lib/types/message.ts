export interface SendMessageInput {
  courseId: string; // The ID of the course
  templateId: string; // The ID of the template
  conversation: Message[]; // The conversation history (array of messages)
  documents?: string[]; // Optional: Documents for multi-agent processing and RAG
  constraints?: string[]; // Optional: Constraints for the response
}

interface Message {
  role: string;
  content: string;
}
