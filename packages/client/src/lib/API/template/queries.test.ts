import api from '@/lib/API/auth/interceptor';
import MockAdapter from 'axios-mock-adapter';
import { GetTemplatesByCourseId, GetTemplateById } from './queries';
import logger from '@/lib/utils/logger';

jest.mock('@/lib/utils/logger');

const mock = new MockAdapter(api);

describe('template API queries', () => {
  const courseId = 'course123';
  const templateId = 'template456';
  const mockTemplates = [{ _id: 'template456', name: 'Mock Template' }];

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it('GetTemplatesByCourseId - returns templates on success', async () => {
    mock.onGet(`/courses/${courseId}/templates`).reply(200, mockTemplates);

    const result = await GetTemplatesByCourseId(courseId);
    expect(result).toEqual(mockTemplates);
  });

  it('GetTemplatesByCourseId - throws error on failure', async () => {
    mock.onGet(`/courses/${courseId}/templates`).networkError();

    await expect(GetTemplatesByCourseId(courseId)).rejects.toThrow();
    expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('Error fetching templates'));
  });

  it('GetTemplateById - returns template on success', async () => {
    mock
      .onGet(`/courses/${courseId}/templates/${templateId}`)
      .reply(200, mockTemplates[0]);

    const result = await GetTemplateById(courseId, templateId);
    expect(result).toEqual(mockTemplates[0]);
  });

  it('GetTemplateById - throws error on failure', async () => {
    mock
      .onGet(`/courses/${courseId}/templates/${templateId}`)
      .reply(500);

    await expect(GetTemplateById(courseId, templateId)).rejects.toThrow();
    expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('Error fetching template'));
  });
});
