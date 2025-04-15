import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from './page'; // The actual login page component
import api from '@/lib/API/auth/interceptor';

jest.mock('@/lib/API/auth/interceptor');
jest.mock('@/lib/utils/toast', () => ({
  createErrorToast: jest.fn(),
}));

describe('LoginPage', () => {
  const mockedApiPost = api.post as jest.Mock;
  const originalLocation = window.location;

  beforeEach(() => {
    mockedApiPost.mockReset();
    localStorage.clear();

    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: new URL('http://localhost'),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });

  it('logs in successfully and redirects for approved user', async () => {
    mockedApiPost.mockResolvedValue({
      data: {
        tokens: {
          access: { token: 'access123' },
          refresh: { token: 'refresh123' },
        },
        user: {
          email: 'user@example.com',
          status: 'approved',
          role: 'student',
        },
      },
    });

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockedApiPost).toHaveBeenCalledWith('/auth/login', {
        email: 'user@example.com',
        password: 'password123',
      });

      expect(localStorage.getItem('authToken')).toBe('access123');
      expect(window.location.href).toBe('/dashboard/courses');
    });
  });

  it('blocks login if user is not approved', async () => {
    mockedApiPost.mockResolvedValue({
      data: {
        tokens: {},
        user: {
          email: 'pending@example.com',
          status: 'pending',
          role: 'student',
        },
      },
    });

    const { createErrorToast } = require('@/lib/utils/toast');

    render(<Page />);
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'pending@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(createErrorToast).toHaveBeenCalledWith(
        'Your account is not approved yet. Please contact support.'
      );
    });
  });

  it('shows error on failed login', async () => {
    mockedApiPost.mockRejectedValue(new Error('Unauthorized'));

    const { createErrorToast } = require('@/lib/utils/toast');

    render(<Page />);
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(createErrorToast).toHaveBeenCalledWith(
        'Invalid credentials, please try again.'
      );
    });
  });
});