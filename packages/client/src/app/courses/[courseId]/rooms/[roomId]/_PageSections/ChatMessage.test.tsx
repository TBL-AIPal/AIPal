'use client';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatMessage from './ChatMessage';
import * as toast from '@/lib/utils/toast';
import * as logger from '@/lib/utils/logger';

// ✅ Fully mock GetUserById module
jest.mock('@/lib/API/user/queries', () => ({
  GetUserById: jest.fn(),
}));

// Mock other modules
jest.mock('@/lib/utils/logger');
jest.mock('@/lib/utils/toast');
jest.mock('./MarkdownRenderer', () => ({ content }: { content: string }) => (
  <div data-testid="markdown">{content}</div>
));

// Setup clipboard mock
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

describe('ChatMessage component', () => {
  const userId = 'currentUser';
  const { GetUserById } = require('@/lib/API/user/queries');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user message correctly', () => {
    render(
      <ChatMessage
        userId={userId}
        message={{ sender: userId, content: 'Hello from me!' }}
      />
    );

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Hello from me!')).toBeInTheDocument();
  });

  it('renders assistant message with model', () => {
    render(
      <ChatMessage
        userId={userId}
        message={{
          sender: 'assistant',
          content: 'Assistant reply',
          modelUsed: 'chatgpt',
        }}
      />
    );

    expect(screen.getByText('assistant (chatgpt)')).toBeInTheDocument();
    expect(screen.getByTestId('markdown')).toHaveTextContent('Assistant reply');
  });

  it('renders other user message and fetches name', async () => {
    (GetUserById as jest.Mock).mockResolvedValue({ name: 'Alice' });

    render(
      <ChatMessage
        userId={userId}
        message={{ sender: 'user456', content: 'Hi from someone else' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
    expect(screen.getByTestId('markdown')).toHaveTextContent('Hi from someone else');
  });

  it('displays "Unknown User" on fetch error', async () => {
    (GetUserById as jest.Mock).mockRejectedValue(new Error('fail'));

    render(
      <ChatMessage
        userId={userId}
        message={{ sender: 'user789', content: 'Oops' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Unknown User')).toBeInTheDocument();
    });
  });

  it('copies message to clipboard and shows toast', async () => {
    render(
      <ChatMessage
        userId={userId}
        message={{ sender: userId, content: 'Copy me!' }}
      />
    );

    const copyButton = screen.getByRole('button');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy me!');
      expect(toast.createInfoToast).toHaveBeenCalledWith('Copied!');
    });
  });
});
