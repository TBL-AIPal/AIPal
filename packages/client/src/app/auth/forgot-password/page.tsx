'use client';

import React, { useState } from 'react';
import api from '@/lib/API/auth/interceptor';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Reset link sent! Check your email.');
      setTimeout(() => {
        window.location.href = '/auth/login'; // Redirect after 3 seconds
      }, 3000);
    } catch (err: any) {
      // Extract the actual error message from the backend response
      const backendError = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-md w-96">
        
        {/* Back Button (Top-Left) */}
        <div className="flex items-center pb-4">
          <button
            type="button"
            className="text-2xl text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-200 p-1"
            onClick={() => window.history.back()}
          >
            ←
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">Forgot Password?</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Success & Error Messages */}
          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </main>
  );
}
