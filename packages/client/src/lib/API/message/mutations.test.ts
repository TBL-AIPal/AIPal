import api from '@/lib/API/auth/interceptor';
import MockAdapter from 'axios-mock-adapter';
import {
  createDirectMessage,
  createRAGMessage,
  createMultiAgentMessage,
  createCombinedMessage,
  createGeminiMessage,
  createLlama3Message,
} from './mutations';
import logger from '@/lib/utils/logger';

jest.mock('@/lib/utils/logger');
const mock = new MockAdapter(api);

describe('message API mutations', () => {
  const baseInput = {
    courseId: 'course123',
    templateId: 'template456',
    roomId: 'room789',
    userId: 'user123',
    conversation: ['hello', 'hi'],
  };

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  const testCases = [
    {
      name: 'Direct',
      fn: createDirectMessage,
      url: `/messages/direct/course123/template456`,
      error: 'Error creating direct message',
    },
    {
      name: 'RAG',
      fn: createRAGMessage,
      url: `/messages/rag/course123/template456`,
      error: 'Error creating RAG message',
    },
    {
      name: 'Multi-Agent',
      fn: createMultiAgentMessage,
      url: `/messages/multi-agent/course123/template456`,
      error: 'Error creating multi-agent message',
    },
    {
      name: 'Combined',
      fn: createCombinedMessage,
      url: `/messages/combined/course123/template456`,
      error: 'Error creating combined message',
    },
    {
      name: 'Gemini',
      fn: createGeminiMessage,
      url: `/messages/gemini/course123/template456`,
      error: 'Error creating Gemini message',
    },
    {
      name: 'LLaMA 3',
      fn: createLlama3Message,
      url: `/messages/llama3/course123/template456`,
      error: 'Error creating LLaMA 3 message',
    },
  ];

  testCases.forEach(({ name, fn, url, error }) => {
    it(`${name} message - succeeds`, async () => {
      mock.onPost(url).reply(200, { result: 'ok' });

      const res = await fn(baseInput);
      expect(res).toEqual({ result: 'ok' });
    });

    it(`${name} message - handles error`, async () => {
      mock.onPost(url).networkError();

      await expect(fn(baseInput)).rejects.toThrow('Unable to send message');
      expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining(error));
    });
  });
});
