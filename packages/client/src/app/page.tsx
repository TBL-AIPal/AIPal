'use client';

import axios from 'axios';
import React, { useState } from 'react';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call your Express server API, not OpenAI directly
      const res = await axios.post('http://localhost:5000/api/chatgpt', {
        prompt,
      });
      setResponse(res.data.response); // Get the response from the server
    } catch (error) {
      // console.error('Error calling ChatGPT:', error);
      setResponse('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <h1 className='mt-4'>ChatGPT Wrapper with Next.js and Express</h1>

          <form onSubmit={handleSubmit} className='mt-4 w-full max-w-md'>
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

          {response && (
            <div className='mt-6 w-full max-w-md rounded bg-gray-100 p-4 text-left'>
              <h2 className='text-lg font-semibold'>Response:</h2>
              <p className='mt-2 text-gray-700'>{response}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
