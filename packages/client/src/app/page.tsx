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
          <ButtonLink className='mt-6' href='/dashboard' variant='light'>
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
