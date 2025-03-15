import { Message } from '@/lib/types/message';

import ChatMessage from './ChatMessage';

const ChatContainer = ({
  messages,
  userId,
  messagesEndRef,
}: {
  messages: Message[];
  userId: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div className='flex-1 overflow-y-auto px-4 py-6 space-y-4'>
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} userId={userId || ''} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
