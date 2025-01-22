'use client';

import * as React from 'react';
import '@/lib/env';

import ButtonLink from '@/components/links/ButtonLink';

export default function HomePage() {
  return (
    <main>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <h1 className='mt-4'>AI Pal</h1>
          <p className='mt-2 text-sm text-gray-800'>
            Collaborative Teaching Assistant Tool
          </p>
          {/* Login and Sign-Up Buttons */}
          <div className='mt-6 space-x-4'>
            <ButtonLink
              href='/auth/login'
              variant='light'
              className='px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600'
            >
              Login
            </ButtonLink>
            <ButtonLink
              href='/auth/signup'
              variant='light'
              className='px-6 py-2 rounded-md bg-green-500 text-white hover:bg-green-600'
            >
              Sign Up
            </ButtonLink>
          </div>

          {/* Navigation Links */}
          <ButtonLink
            className='mt-6'
            href='/dashboard/courses'
            variant='light'
          >
            Course List
          </ButtonLink>
          <ButtonLink className='mt-6' href='/components' variant='light'>
            See all components
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
