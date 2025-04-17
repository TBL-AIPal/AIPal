const ChatInput = ({
    newMessage,
    setNewMessage,
    handleSendMessage,
    loadingMessage,
  }: {
    newMessage: string;
    setNewMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: () => void;
    loadingMessage: boolean;
  }) => {
    return (
      <div className='sticky bottom-4 z-10 p-4 bg-white border-t flex gap-4 shadow-md rounded-2xl'>
        <div className='flex items-center w-full gap-2'>
          {/* Multiline Textarea */}
          <textarea
            rows={1}
            className='flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-auto'
            placeholder='Type a message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && !e.shiftKey && handleSendMessage()
            }
            disabled={loadingMessage}
            style={{ maxHeight: '10rem' }}
          />
          {/* Send Button */}
          <button
            aria-label="Send"
            className='p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-transform disabled:opacity-50'
            onClick={handleSendMessage}
            disabled={loadingMessage}
          >
            {loadingMessage ? (
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v8H4z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  };

export default ChatInput;