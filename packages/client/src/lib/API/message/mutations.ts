import api from '@/lib/API/auth/interceptor';
import { SendMessageInput } from '@/lib/types/message';

export const createDirectMessage = async ({
  courseId,
  templateId,
  roomId,
  userId,
  conversation,
  documents = [],
  constraints = [],
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/direct/${courseId}/${templateId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err) {
    console.error(`Error creating direct message for room ${roomId}:`, err);
    throw err;
  }
};

export const createRAGMessage = async ({
  courseId,
  templateId,
  roomId,
  userId,
  conversation,
  documents = [],
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/rag/${courseId}/${templateId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err) {
    console.error(`Error creating RAG message for room ${roomId}:`, err);
    throw err;
  }
};

export const createMultiAgentMessage = async ({
  courseId,
  templateId,
  roomId,
  userId,
  conversation,
  documents = [],
  constraints = [],
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/multi-agent/${courseId}/${templateId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err) {
    console.error(`Error creating multi-agent message for room ${roomId}:`, err);
    throw err;
  }
};

export const createCombinedMessage = async ({
  courseId,
  templateId,
  roomId,
  userId,
  conversation,
  documents = [],
  constraints = [],
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/combined/${courseId}/${templateId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err) {
    console.error(`Error creating combined message for room ${roomId}:`, err);
    throw err;
  }
};

export const createGeminiMessage = async ({
  courseId,
  templateId,
  roomId,
  userId,
  conversation,
  documents = [],
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/gemini/${courseId}/${templateId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err) {
    console.error(`Error creating Gemini message for room ${roomId}:`, err);
    throw err;
  }
};

export const createLlama3Message = async ({
  courseId,
  templateId,
  roomId,
  userId,
  conversation,
  documents = [],
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/llama3/${courseId}/${templateId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err) {
    console.error(`Error creating LLaMA 3 message for room ${roomId}:`, err);
    throw err;
  }
};