'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Get token from URL
import api from '@/lib/API/auth/interceptor';
import { createErrorToast, createInfoToast } from '@/lib/utils/toast';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Extract token from URL

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure passwords match
    if (password !== confirmPassword) {
        createErrorToast('Passwords do not match.');
        return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/reset-password', { token, password });
      createInfoToast('Password successfully reset! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/auth/login'; // Redirect after success
      }, 3000);
    } catch (err: any) {
      const backendError = err.response?.data?.message || 'Failed to reset password. Try again.';
      createErrorToast(backendError);
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

        <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="block text-sm font-medium mb-2 mt-4">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <button
            type="submit"
            className="w-full mt-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </main>
  );
}
