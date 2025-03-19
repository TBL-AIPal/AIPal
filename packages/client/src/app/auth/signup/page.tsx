'use client';

import React, { useState } from 'react';
import { CreateUser } from '@/lib/API/user/mutations';
import { createErrorToast, createInfoToast } from '@/lib/utils/toast';

export default function SignupPage() {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher'; // Explicitly define role type
  }>({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await CreateUser(formData);
      setShowSuccess(true); // Show success popup instead of console logging
      setTimeout(() => {
        window.location.href = '/'; // Redirect after 3 seconds
      }, 3000);
      createInfoToast('Account registration is successful!');
      window.location.href = '/'; // Redirect to home page after signup
    } catch (err: any) {
      createErrorToast(err.response?.data?.message || 'Unable to register account. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='p-8 bg-white shadow-md rounded-md'>
      <div className="flex items-center pb-4">
          <button
            type="button"
            className="text-2xl text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-200"
            onClick={() => window.history.back()}
          >
            ←
          </button>
        </div>
        <h1 className='text-2xl font-bold mb-4'>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Name</label>
            <input
              type='text'
              name='name'
              className='w-full px-4 py-2 border rounded-md'
              placeholder='Enter your name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Email</label>
            <input
              type='email'
              name='email'
              className='w-full px-4 py-2 border rounded-md'
              placeholder='Enter your email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Password</label>
            <input
              type='password'
              name='password'
              className='w-full px-4 py-2 border rounded-md'
              placeholder='Enter your password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Confirm Password</label>
            <input
              type='password'
              name='confirmPassword'
              className='w-full px-4 py-2 border rounded-md'
              placeholder='Confirm your password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Role</label>
            <select
              name='role'
              className='w-full px-4 py-2 border rounded-md'
              value={formData.role}
              onChange={handleChange}
            >
              <option value='teacher'>Teacher</option>
              <option value='student'>Student</option>
            </select>
          </div>
          <button
            type='submit'
            className='w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600'
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>

      {/* Success Popup Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center w-80">
            <h2 className="text-xl font-semibold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-700 mb-4">Your account has been created.</p>
            <p className="text-sm text-gray-500">Redirecting to home...</p>
          </div>
        </div>
      )}
    </main>
  );
}