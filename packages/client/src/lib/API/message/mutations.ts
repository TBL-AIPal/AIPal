import api from '@/lib/API/auth/interceptor';
import { SendMessageInput } from '@/lib/types/message';
import logger from '@/lib/utils/logger';

const extractErrorMessage = (err: any): string => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Unable to send message. Please try again.'
  );
};

export const createDirectMessage = async ({
  courseId,
  roomId,
  userId,
  conversation,
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/direct/${courseId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err: any) {
    logger(err, `Error creating direct message for room ${roomId}`);
    throw new Error(extractErrorMessage(err));
  }
};

export const createRAGMessage = async ({
  courseId,
  roomId,
  userId,
  conversation,
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/rag/${courseId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err: any) {
    logger(err, `Error creating RAG message for room ${roomId}`);
    throw new Error(extractErrorMessage(err));
  }
};

export const createMultiAgentMessage = async ({
  courseId,
  roomId,
  userId,
  conversation,
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/multi-agent/${courseId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err: any) {
    logger(err, `Error creating multi-agent message for room ${roomId}`);
    throw new Error(extractErrorMessage(err));
  }
};

export const createCombinedMessage = async ({
  courseId,
  roomId,
  userId,
  conversation,
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/combined/${courseId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err: any) {
    logger(err, `Error creating combined message for room ${roomId}`);
    throw new Error(extractErrorMessage(err));
  }
};

export const createGeminiMessage = async ({
  courseId,
  roomId,
  userId,
  conversation,
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/gemini/${courseId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err: any) {
    logger(err, `Error creating Gemini message for room ${roomId}`);
    throw new Error(extractErrorMessage(err));
  }
};

export const createLlama3Message = async ({
  courseId,
  roomId,
  userId,
  conversation,
}: SendMessageInput) => {
  try {
    const response = await api.post(`/messages/llama3/${courseId}`, {
      roomId,
      userId,
      conversation,
    });
    return response.data;
  } catch (err: any) {
    logger(err, `Error creating LLaMA 3 message for room ${roomId}`);

    if (err?.response?.status === 413) {
      throw new Error(
        'The total context size is too large for the model. Try reducing the document size or number of documents for the template.'
      );
    }

    throw new Error(extractErrorMessage(err));
  }
};