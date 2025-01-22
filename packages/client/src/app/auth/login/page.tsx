import React from 'react';

export default function LoginPage() {
  return (
    <main className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='p-8 bg-white shadow-md rounded-md'>
        <h1 className='text-2xl font-bold mb-4'>Login</h1>
        <form>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Email</label>
            <input
              type='email'
              className='w-full px-4 py-2 border rounded-md'
              placeholder='Enter your email'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Password</label>
            <input
              type='password'
              className='w-full px-4 py-2 border rounded-md'
              placeholder='Enter your password'
            />
          </div>
          <button
            type='submit'
            className='w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
