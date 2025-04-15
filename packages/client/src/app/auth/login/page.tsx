'use client'

import React, { useState } from 'react';

import api from '@/lib/API/auth/interceptor'; // Use Axios interceptor
import { createErrorToast } from '@/lib/utils/toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });

      // Block login if user is not approved
      if (data.user.status !== 'approved' && data.user.role !== 'admin') {
        createErrorToast('Your account is not approved yet. Please contact support.')
        return;
      }

      // Store tokens securely
      localStorage.setItem('authToken', data.tokens.access.token);
      localStorage.setItem('refreshToken', data.tokens.refresh.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = '/dashboard/courses'; // Redirect on success
    } catch (err) {
      createErrorToast('Invalid credentials, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.location.href = '/auth/forgot-password';
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative p-8 bg-white shadow-md rounded-md">
      <div className="flex items-center pb-4">
          <button
            type="button"
            className="text-2xl text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-200"
            onClick={() => window.history.back()}
          >
            ←
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Forgot Password Button */}
          <div className="text-right mb-4">
            <button 
              type="button" 
              className="text-blue-500 text-sm hover:underline"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}