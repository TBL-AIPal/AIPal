import axios from 'axios';

import { SendMessageInput } from '@/lib/types/message';

import { jwtToken, proxyUrl } from '@/constant/env';

export const createDirectMessage = async ({
  courseId,
  conversation,
}: SendMessageInput) => {
  const endpoint = `${proxyUrl}/messages/direct/${courseId}`;

  const data = { conversation };

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const createRAGMessage = async ({
  courseId,
  conversation,
}: SendMessageInput) => {
  const endpoint = `${proxyUrl}/messages/rag/${courseId}`;

  const data = { conversation };

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const createMultiAgentMessage = async ({
  courseId,
  conversation,
  documents = [],
  constraints = [],
}: SendMessageInput) => {
  const endpoint = `${proxyUrl}/messages/multi-agent/${courseId}`;

  const data = { conversation, documents, constraints };

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const createCombinedMessage = async ({
  courseId,
  conversation,
  documents = [],
  constraints = [],
}: SendMessageInput) => {
  const endpoint = `${proxyUrl}/messages/combined/${courseId}`;

  const data = { conversation, documents, constraints };

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
