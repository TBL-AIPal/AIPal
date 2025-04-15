import { Document } from "./document";

export interface SendMessageInput {
  courseId: string; // The ID of the course
  roomId: string; // The ID of the room
  userId: string; // The ID of the user sending the message
  conversation: Message[]; // The conversation history (array of messages)
  documents?: Document[]; // Optional: Documents for multi-agent processing and RAG
  constraints?: string[]; // Optional: Constraints for the response
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  sender: string;
  content: string;
  modelUsed?: string;
}