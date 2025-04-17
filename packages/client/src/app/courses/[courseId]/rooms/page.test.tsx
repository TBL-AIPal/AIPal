import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RoomsPage from './page';

// ⬇️ Reusable push mock
const mockPush = jest.fn();

// ⬇️ next/navigation mock
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ courseId: 'course123' })),
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

// ⬇️ lucide-react icon mocks
jest.mock('lucide-react', () => ({
  UserPlus: () => <svg data-testid="icon-user-plus" />,
  ArrowRightCircle: () => <svg data-testid="icon-arrow-right-circle" />,
}));

// ⬇️ Modal mock
jest.mock('@/components/ui/Modal', () => ({
  Modal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// ⬇️ Toast utility mock
jest.mock('@/lib/utils/toast', () => ({
  createErrorToast: jest.fn(),
  createInfoToast: jest.fn(),
}));

// ⬇️ Mutation mock
jest.mock('@/lib/API/room/mutations', () => ({
  UpdateRoom: jest.fn(() => Promise.resolve({})),
}));

// ⬇️ API mocks
jest.mock('@/lib/API/course/queries', () => ({
  GetCourseById: jest.fn(() =>
    Promise.resolve({
      _id: 'course123',
      name: 'Test Course',
      templates: ['template1'],
      tutorialGroups: [
        {
          _id: 'group1',
          name: 'TG1',
          students: [{ id: 'user2', name: 'Alice' }],
        },
      ],
    })
  ),
}));

jest.mock('@/lib/API/room/queries', () => ({
  GetRoomsByTemplateIds: jest.fn(() =>
    Promise.resolve([
      {
        id: 'room1',
        name: 'Room One',
        code: '12345',
        allowedUsers: ['user2'],
      },
    ])
  ),
}));

jest.mock('@/lib/API/user/queries', () => ({
  GetUsersByCourseId: jest.fn(() =>
    Promise.resolve([
      { id: 'user1', name: 'Bob', email: 'bob@example.com' },
      { id: 'user2', name: 'Alice', email: 'alice@example.com' },
    ])
  ),
}));

describe('RoomsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 'user1', role: 'teacher' })
    );
  });

  it('renders room list and handles open modal', async () => {
    render(<RoomsPage />);
    await waitFor(() => {
      expect(screen.getByText('Room One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('icon-user-plus'));
    await waitFor(() => {
      expect(screen.getByText('Select Users:')).toBeInTheDocument();
      expect(screen.getByText(/bob@example.com/)).toBeInTheDocument(); // ✅ Bob is unassigned
    });
  });

  it('allows teacher to click enter room directly', async () => {
    render(<RoomsPage />);
    await waitFor(() => {
      expect(screen.getByText('Room One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('icon-arrow-right-circle'));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/courses/course123/rooms/room1');
    });
  });
});
