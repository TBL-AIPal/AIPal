import api from '@/lib/API/auth/interceptor';
import MockAdapter from 'axios-mock-adapter';
import { CreateTemplate, UpdateTemplate, DeleteTemplate } from './mutations';
import logger from '@/lib/utils/logger';

jest.mock('@/lib/utils/logger');

const mock = new MockAdapter(api);

describe('template API mutations', () => {
  const courseId = 'course123';
  const templateId = 'template456';

  const baseData = {
    name: 'Sample Template',
    constraints: ['constraint1'],
    documents: ['doc1'],
  };

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it('CreateTemplate - succeeds', async () => {
    mock.onPost(`/courses/${courseId}/templates`).reply(200);

    await expect(
      CreateTemplate({ courseId, ...baseData })
    ).resolves.toBeUndefined();
  });

  it('CreateTemplate - handles failure', async () => {
    mock.onPost(`/courses/${courseId}/templates`).networkError();

    await expect(
      CreateTemplate({ courseId, ...baseData })
    ).rejects.toThrow('Unable to create template');
    expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('Error creating template'));
  });

  it('UpdateTemplate - succeeds', async () => {
    mock.onPatch(`/courses/${courseId}/templates/${templateId}`).reply(200);

    await expect(
      UpdateTemplate({ courseId, templateId, ...baseData })
    ).resolves.toBeUndefined();
  });

  it('UpdateTemplate - handles failure', async () => {
    mock.onPatch(`/courses/${courseId}/templates/${templateId}`).reply(500);

    await expect(
      UpdateTemplate({ courseId, templateId, ...baseData })
    ).rejects.toThrow('Unable to update template');
    expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('Error updating template'));
  });

  it('DeleteTemplate - succeeds', async () => {
    mock.onDelete(`/courses/${courseId}/templates/${templateId}`).reply(200);

    await expect(
      DeleteTemplate({ courseId, templateId })
    ).resolves.toBeUndefined();
  });

  it('DeleteTemplate - handles failure', async () => {
    mock.onDelete(`/courses/${courseId}/templates/${templateId}`).networkError();

    await expect(
      DeleteTemplate({ courseId, templateId })
    ).rejects.toThrow('Unable to delete template');
    expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('Error deleting template'));
  });
});
