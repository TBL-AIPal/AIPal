import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsBar from './SettingsBar';

describe('SettingsBar', () => {
  const mockSetModel = jest.fn(() => Promise.resolve());
  const mockSetMethod = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders model and method dropdowns for teachers', () => {
    render(
      <SettingsBar
        selectedModel="chatgpt"
        setSelectedModel={mockSetModel}
        selectedMethod="direct"
        setSelectedMethod={mockSetMethod}
        isTeacher={true}
      />
    );

    expect(screen.getByDisplayValue('ChatGPT')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Direct')).toBeInTheDocument();
  });

  it('disables model selector when method is not "direct"', () => {
    render(
      <SettingsBar
        selectedModel="chatgpt"
        setSelectedModel={mockSetModel}
        selectedMethod="multi-agent"
        setSelectedMethod={mockSetMethod}
        isTeacher={true}
      />
    );

    expect(screen.getByText('Model selection disabled')).toBeInTheDocument();
  });

  it('calls setSelectedModel when model changes', async () => {
    render(
      <SettingsBar
        selectedModel="chatgpt"
        setSelectedModel={mockSetModel}
        selectedMethod="direct"
        setSelectedMethod={mockSetMethod}
        isTeacher={true}
      />
    );

    fireEvent.change(screen.getByDisplayValue('ChatGPT'), {
      target: { value: 'llama3' },
    });

    await waitFor(() => {
      expect(mockSetModel).toHaveBeenCalledWith('llama3');
    });
  });

  it('calls setSelectedMethod and resets model when method is not "direct"', async () => {
    render(
      <SettingsBar
        selectedModel="chatgpt"
        setSelectedModel={mockSetModel}
        selectedMethod="direct"
        setSelectedMethod={mockSetMethod}
        isTeacher={true}
      />
    );

    fireEvent.change(screen.getByDisplayValue('Direct'), {
      target: { value: 'multi-agent' },
    });

    await waitFor(() => {
      expect(mockSetMethod).toHaveBeenCalledWith('multi-agent');
      expect(mockSetModel).toHaveBeenCalledWith('chatgpt');
    });
  });

  it('renders read-only view for students', () => {
    const { container } = render(
      <SettingsBar
        selectedModel="llama3"
        setSelectedModel={jest.fn()}
        selectedMethod="rag"
        setSelectedMethod={jest.fn()}
        isTeacher={false}
      />
    );

    const text = container.textContent;
    expect(text).toContain('Model:');
    expect(text).toContain('llama3');
    expect(text).toContain('Method:');
    expect(text).toContain('rag');
  });
});
