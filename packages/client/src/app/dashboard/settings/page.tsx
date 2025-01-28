'use client'; // This marks the component as a Client Component

import { useState } from 'react';
import axios from 'axios';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken'); // Retrieve the token
      if (!token) {
        throw new Error('User not authenticated.');
      }

      // Send a POST request to log out (refresh token)
      // await axios.post(
      //   'http://localhost:5000/v1/auth/logout', // Adjust the URL to your backend
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // Remove the token from localStorage after logout
      localStorage.removeItem('authToken');

      // Redirect to the login page
      window.location.href = '/'; // Redirect to the login page after logout
    } catch (err) {
      setError('Error logging out. Please try again.');
      console.error('Error logging out:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
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
