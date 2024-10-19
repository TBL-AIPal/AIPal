import axios from 'axios';
import React, { useState } from 'react';

interface ChatRoomPageProps {
  roomName: string;
  roomDescription: string;
}

const ChatRoomPage: React.FC<ChatRoomPageProps> = ({
  roomName,
  roomDescription,
}) => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);

    const userMessage = { role: 'user', content: prompt };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setPrompt('');

    try {
      const res = await axios.post('http://localhost:5000/api/chatgpt', {
        conversation: updatedConversation,
      });

      const finalConversation = res.data.responses;
      setConversation(finalConversation);
    } catch {
      const errorMessage = {
        role: 'assistant',
        content: 'An error occurred. Please try again.',
      };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-bold'>{roomName}</h2>
      <p className='text-gray-600 mb-4'>{roomDescription}</p>
      <div className='bg-gray-100 p-4 rounded max-h-96 overflow-y-auto'>
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`my-2 ${
              msg.role === 'user' ? 'text-blue-700' : 'text-gray-700'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : msg.role}:</strong>{' '}
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className='mt-4 w-full'>
        <textarea
          className='w-full rounded border p-2 text-gray-700'
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Ask a question or enter a prompt...'
        />
        <button
          type='submit'
          className='mt-4 w-full rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600'
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatRoomPage;
