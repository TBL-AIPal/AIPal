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
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await CreateUser(formData);
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
    </main>
  );
}