import axios from 'axios';

import { SendMessageInput } from '@/lib/types/message';

import { jwtToken, proxyUrl } from '@/constant/env';

export const createDirectMessage = async ({
  courseId,
  templateId,
  conversation,
}: SendMessageInput) => {
  const endpoint = `${proxyUrl}/messages/direct/${courseId}/${templateId}`;

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
  templateId,
  conversation,
}: SendMessageInput) => {
  const endpoint = `${proxyUrl}/messages/rag/${courseId}/${templateId}`;

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
  templateId,
  conversation,
  constraints = [],
}: SendMessageInput) => {
  const endpoint = `${proxyUrl}/messages/multi-agent/${courseId}/${templateId}`;

  const data = { conversation, constraints };

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
  templateId,
  conversation,
  constraints = [],
}: SendMessageInput) => {
  const endpoint = `${proxyUrl}/messages/combined/${courseId}/${templateId}`;

  const data = { conversation, constraints };

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
