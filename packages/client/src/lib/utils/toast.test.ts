jest.mock('react-hot-toast', () => {
  const toastMock = {
    success: jest.fn(),
    error: jest.fn(),
  };
  return {
    __esModule: true,
    default: toastMock,
  };
});

import { createErrorToast, createInfoToast } from './toast';
import toast from 'react-hot-toast';

describe('toast utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).window = {};
  });

  it('calls toast.success in browser', () => {
    createInfoToast('Yay 🎉');
    expect(toast.success).toHaveBeenCalledWith('Yay 🎉');
  });

  it('calls toast.error in browser', () => {
    createErrorToast('Oops!');
    expect(toast.error).toHaveBeenCalledWith('Oops!');
  });

  it('does not call toast functions on server', () => {
    delete (global as any).window;
    createInfoToast('hi');
    createErrorToast('nope');
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
