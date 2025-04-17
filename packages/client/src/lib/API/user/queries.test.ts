import * as userAPI from './queries';
import api from '@/lib/API/auth/interceptor';
import logger from '@/lib/utils/logger';

jest.mock('@/lib/API/auth/interceptor', () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

jest.mock('@/lib/utils/logger', () => jest.fn());

const mockUser = { id: 'u1', name: 'Alice' };

describe('user API queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GetUsers - success', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { results: [mockUser] } });
    const users = await userAPI.GetUsers();
    expect(api.get).toHaveBeenCalledWith('/users', { params: { page: 1, limit: 10 } });
    expect(users).toEqual([mockUser]);
  });

  it('GetUsers - failure', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('API failed'));
    await expect(userAPI.GetUsers()).rejects.toThrow('Failed to fetch users');
    expect(logger).toHaveBeenCalledWith(expect.anything(), 'Error fetching users');
  });

  it('GetUsersByCourseId - success', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { results: [mockUser] } });
    const users = await userAPI.GetUsersByCourseId('c123');
    expect(api.get).toHaveBeenCalledWith('/users', { params: { courseId: 'c123', page: 1, limit: 10 } });
    expect(users).toEqual([mockUser]);
  });

  it('GetUserById - success', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockUser });
    const user = await userAPI.GetUserById('u1');
    expect(api.get).toHaveBeenCalledWith('/users/u1');
    expect(user).toEqual(mockUser);
  });

  it('GetUsersByRole - success', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { results: [mockUser] } });
    const users = await userAPI.GetUsersByRole('teacher');
    expect(api.get).toHaveBeenCalledWith('/users', { params: { role: 'teacher' } });
    expect(users).toEqual([mockUser]);
  });

  it('ApproveUser - success', async () => {
    (api.patch as jest.Mock).mockResolvedValueOnce({});
    await userAPI.ApproveUser('u1');
    expect(api.patch).toHaveBeenCalledWith('/users/u1', { status: 'approved' });
  });

  it('RejectUser - success', async () => {
    (api.patch as jest.Mock).mockResolvedValueOnce({});
    await userAPI.RejectUser('u1');
    expect(api.patch).toHaveBeenCalledWith('/users/u1', { status: 'rejected' });
  });

  it('RejectUser - failure', async () => {
    (api.patch as jest.Mock).mockRejectedValueOnce(new Error('bad'));
    await expect(userAPI.RejectUser('u1')).rejects.toThrow('Failed to reject user');
    expect(logger).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('rejecting'));
  });
});
