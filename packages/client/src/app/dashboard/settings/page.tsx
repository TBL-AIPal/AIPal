'use client';

import { useState } from 'react';
import { createErrorToast } from '@/lib/utils/toast';
import logger from '@/lib/utils/logger';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken'); // Retrieve the token
      if (!token) {
        throw new Error('User not authenticated.');
      }

      // Remove the token from localStorage after logout
      localStorage.removeItem('authToken');

      // Redirect to the login page
      window.location.href = '/'; // Redirect to the login page after logout
    } catch (err) {
      logger(err, 'Error logging out');
      createErrorToast('Unable to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}
