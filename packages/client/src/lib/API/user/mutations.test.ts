import { CreateUser } from './mutations';
import api from '@/lib/API/auth/interceptor';
import logger from '@/lib/utils/logger';

jest.mock('@/lib/API/auth/interceptor', () => ({
  post: jest.fn(),
}));

jest.mock('@/lib/utils/logger', () => jest.fn());

describe('CreateUser', () => {
  const mockUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'student',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends POST request to register endpoint and returns user', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: mockUser });

    const result = await CreateUser(mockUser);

    expect(api.post).toHaveBeenCalledWith('auth/register', mockUser, {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).toEqual(mockUser);
  });

  it('logs and throws error if request fails', async () => {
    const error = new Error('API failed');
    (api.post as jest.Mock).mockRejectedValueOnce(error);

    await expect(CreateUser(mockUser)).rejects.toThrow('An unexpected error occurred. Please try again.');
    expect(logger).toHaveBeenCalledWith(error, 'Unable to create a user');
  });
});
