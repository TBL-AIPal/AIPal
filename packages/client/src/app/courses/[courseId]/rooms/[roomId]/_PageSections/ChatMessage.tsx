import { Message } from '@/lib/types/message';

import MarkdownRenderer from "./MarkdownRenderer";

const ChatMessage = ({ message, userId }: { message: Message; userId: string }) => {
    const isUserMessage = message.sender === userId;
  
    return (
      <div
        className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[70%] p-4 rounded-lg ${
            isUserMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
          }`}
        >
          {isUserMessage ? (
            <span>{message.content}</span>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
      </div>
    );
  };

export default ChatMessage;