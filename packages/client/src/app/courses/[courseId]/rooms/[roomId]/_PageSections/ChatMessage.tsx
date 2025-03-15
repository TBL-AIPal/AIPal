import { Message } from '@/lib/types/message';
import logger from '@/lib/utils/logger';
import { createInfoToast } from '@/lib/utils/toast';

import MarkdownRenderer from './MarkdownRenderer';

const ChatMessage = ({
  message,
  userId,
}: {
  message: Message;
  userId: string;
}) => {
  const isUserMessage = message.sender === userId;

  // Function to copy text to clipboard
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      logger(content, 'Message copied to clipboard');
      createInfoToast('Copied!');
    });
  };

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      {/* Chat Bubble */}
      <div
        className={`relative max-w-[70%] p-4 rounded-lg shadow-md ${
          isUserMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
        style={{ paddingBottom: '3rem' }}
      >
        {/* User ID Display */}
        <div
          className={`text-xs font-medium mb-1 ${
            isUserMessage ? 'text-blue-200' : 'text-gray-600'
          }`}
        >
          {isUserMessage
            ? 'You'
            : message.sender === 'assistant'
              ? `${message.sender} (${message.modelUsed || 'unknown'})`
              : message.sender}
        </div>

        {/* Message Content */}
        <div>
          {isUserMessage ? (
            <span>{message.content}</span>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Copy Button */}
        <button
          className={`absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-500 hover:bg-gray-100 transition-all duration-200 ${
            isUserMessage ? 'text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => handleCopy(message.content)}
        >
          {/* Clipboard Icon */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
