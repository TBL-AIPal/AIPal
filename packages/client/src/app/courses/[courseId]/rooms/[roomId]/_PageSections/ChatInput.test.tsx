import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from './ChatInput';

describe('ChatInput', () => {
  const setup = (props?: Partial<React.ComponentProps<typeof ChatInput>>) => {
    const defaultProps = {
      newMessage: '',
      setNewMessage: jest.fn(),
      handleSendMessage: jest.fn(),
      loadingMessage: false,
    };
    return render(<ChatInput {...defaultProps} {...props} />);
  };

  it('renders input and send button', () => {
    setup();
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('updates message on change', () => {
    const mockSetNewMessage = jest.fn();
    setup({ setNewMessage: mockSetNewMessage });

    fireEvent.change(screen.getByPlaceholderText('Type a message...'), {
      target: { value: 'Hello world' },
    });

    expect(mockSetNewMessage).toHaveBeenCalledWith('Hello world');
  });

  it('calls handleSendMessage on button click', () => {
    const mockHandleSend = jest.fn();
    setup({ handleSendMessage: mockHandleSend });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(mockHandleSend).toHaveBeenCalled();
  });

  it('calls handleSendMessage on Enter key, but not Shift+Enter', () => {
    const mockHandleSend = jest.fn();
    setup({ handleSendMessage: mockHandleSend });

    const textarea = screen.getByPlaceholderText('Type a message...');

    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(mockHandleSend).toHaveBeenCalled();

    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(mockHandleSend).toHaveBeenCalledTimes(1); // should not be called again
  });

  it('disables input and button when loadingMessage is true', () => {
    setup({ loadingMessage: true });

    const textarea = screen.getByPlaceholderText('Type a message...');
    const button = screen.getByRole('button', { name: /send/i });

    expect(textarea).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('shows loading spinner when loadingMessage is true', () => {
    setup({ loadingMessage: true });
  
    const svg = screen.getByRole('button', { name: /send/i }).querySelector('svg');
    expect(svg?.classList.contains('animate-spin')).toBe(true);
  });  
});
