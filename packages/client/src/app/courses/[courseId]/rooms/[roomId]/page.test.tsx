import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoomChatPage from '@/app/courses/[courseId]/rooms/[roomId]/page'; // adjust if needed

import * as roomQueries from '@/lib/API/room/queries';
import * as userQueries from '@/lib/API/user/queries';
import * as messageAPI from '@/lib/API/message/mutations';

process.env.NEXT_PUBLIC_SERVER_HOST = 'localhost';
process.env.NEXT_PUBLIC_SERVER_PORT = '3001';

jest.mock('@/lib/API/room/queries');
jest.mock('@/lib/API/user/queries');
jest.mock('@/lib/API/message/mutations');
jest.mock('next/navigation', () => ({
  useParams: () => ({ courseId: 'course123', roomId: 'room456' }),
}));

describe('RoomChatPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 'user123', name: 'Test User', role: 'student' })
    );

    (roomQueries.GetRoomById as jest.Mock).mockResolvedValue({
      selectedModel: 'chatgpt',
      selectedMethod: 'direct',
    });

    (roomQueries.GetMessagesByRoomId as jest.Mock).mockResolvedValue([]);

    (userQueries.GetUsers as jest.Mock).mockResolvedValue([
      { id: 'user123', name: 'Test User', email: 'test@example.com' },
    ]);

    (messageAPI.createDirectMessage as jest.Mock).mockResolvedValue({
      responses: [
        {
          role: 'assistant',
          content: 'Hello from LLM',
          modelUsed: 'chatgpt',
        },
      ],
    });
  });

  it('sends a message and receives a response', async () => {
    render(<RoomChatPage />);

    const input = await screen.findByRole('textbox');
    const button = await screen.findByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Hello AI!' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Hello from LLM')).toBeInTheDocument();
    });
  });
});