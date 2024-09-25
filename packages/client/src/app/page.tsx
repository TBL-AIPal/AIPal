'use client';

import axios from 'axios';
import React, { useState } from 'react';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return; // Don't allow sending empty prompts
    setLoading(true);

    const userMessage = { role: 'user', content: prompt };
    const updatedConversation = [...conversation, userMessage]; // Add user message to the conversation

    setConversation(updatedConversation); // Update state to include user's new message
    setPrompt(''); // Clear the input

    try {
      // Call your Express server API, not OpenAI directly
      const res = await axios.post('http://localhost:5000/api/chatgpt', {
        conversation: updatedConversation,
      });

      const assistantMessage = {
        role: 'assistant',
        content: res.data.response,
      };

      setConversation((prev) => [...prev, assistantMessage]); // Add ChatGPT response to the conversation
    } catch (error) {
      // console.error('Error calling ChatGPT:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'An error occurred. Please try again.',
      };
      setConversation((prev) => [...prev, errorMessage]); // Add error message to conversation
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <h1 className='mt-4'>
            ChatGPT Conversation with Next.js and Express
          </h1>

          <div className='mt-4 w-full max-w-md'>
            {/* Conversation Log */}
            <div className='bg-gray-100 p-4 rounded max-h-96 overflow-y-auto'>
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`my-2 ${
                    msg.role === 'user' ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <strong>{msg.role === 'user' ? 'You' : 'ChatGPT'}:</strong>{' '}
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className='mt-4 w-full'>
              <textarea
                className='w-full rounded border p-2 text-gray-700'
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='Ask ChatGPT something...'
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
        </div>
      </section>
    </main>
  );
}
