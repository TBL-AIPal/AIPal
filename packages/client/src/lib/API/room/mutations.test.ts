import { CreateRoom, UpdateRoom } from './mutations';
import api from '@/lib/API/auth/interceptor';
import logger from '@/lib/utils/logger';

jest.mock('@/lib/API/auth/interceptor', () => ({
  post: jest.fn(),
  patch: jest.fn(),
}));

jest.mock('@/lib/utils/logger', () => jest.fn());

describe('Room API Mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseRoomData = {
    courseId: 'course1',
    name: 'Room 1',
    description: 'Test room',
    code: '1234',
    template: 'template1',
    selectedModel: 'gpt-4',
    selectedMethod: 'direct',
  };

  it('CreateRoom - success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});
    await CreateRoom(baseRoomData);
    expect(api.post).toHaveBeenCalledWith('/courses/course1/rooms', {
      name: 'Room 1',
      description: 'Test room',
      code: '1234',
      template: 'template1',
      selectedModel: 'gpt-4',
      selectedMethod: 'direct',
    });
  });

  it('CreateRoom - failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await expect(CreateRoom(baseRoomData)).rejects.toThrow('Unable to create room');
    expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('Error creating room'));
  });

  it('UpdateRoom - success with all fields', async () => {
    (api.patch as jest.Mock).mockResolvedValueOnce({});
    await UpdateRoom({
      ...baseRoomData,
      roomId: 'room1',
      allowedUsers: ['u1', 'u2'],
    });
    expect(api.patch).toHaveBeenCalledWith('/courses/course1/rooms/room1', {
      name: 'Room 1',
      description: 'Test room',
      code: '1234',
      template: 'template1',
      allowedUsers: ['u1', 'u2'],
      selectedModel: 'gpt-4',
      selectedMethod: 'direct',
    });
  });

  it('UpdateRoom - only partial fields', async () => {
    (api.patch as jest.Mock).mockResolvedValueOnce({});
    await UpdateRoom({
      courseId: 'course1',
      roomId: 'room1',
      allowedUsers: ['u3'],
    });
    expect(api.patch).toHaveBeenCalledWith('/courses/course1/rooms/room1', {
      allowedUsers: ['u3'],
    });
  });

  it('UpdateRoom - failure logs and rethrows', async () => {
    const error = new Error('update fail');
    (api.patch as jest.Mock).mockRejectedValueOnce(error);
    await expect(UpdateRoom({ roomId: 'room1', courseId: 'course1' })).rejects.toThrow(error);
  });
});
