'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the backend returns tokens with keys `access` and `refresh`
        localStorage.setItem('authToken', data.tokens.access.token); // Save access token for later use
        console.log('Login Successful:', data);

        // Optionally, save the refresh token as well
        // localStorage.setItem('refreshToken', data.tokens.refresh.token);

        // Save the current user details (e.g., user id) to localStorage
        localStorage.setItem('user', JSON.stringify(data.user)); // Save user details

        window.location.href = '/dashboard/courses'; // Redirect to the courses page
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='p-8 bg-white shadow-md rounded-md'>
        <h1 className='text-2xl font-bold mb-4'>Login</h1>
        <form onSubmit={handleLogin}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Email</label>
            <input
              type='email'
              className='w-full px-4 py-2 border rounded-md'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Password</label>
            <input
              type='password'
              className='w-full px-4 py-2 border rounded-md'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className='mb-4 text-sm text-red-600'>{error}</p>}
          <button
            type='submit'
            className='w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
