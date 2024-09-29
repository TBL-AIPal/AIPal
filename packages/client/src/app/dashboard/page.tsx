'use client';

import * as React from 'react';

import '@/styles/colors.css';

import Tabs from '@/components/Tabs';

import CoursesContent from './CoursesContent';

const tabsData = [
  { name: 'Profile', content: <div>Your profile content</div> },
  { name: 'Courses', content: <CoursesContent /> },
  { name: 'Settings', content: <div>Your settings content</div> },
  { name: 'Contacts', content: <div>Your contacts content</div> },
  { name: 'Disabled', content: <div>Disabled content</div> },
];

export default function DashboardPage() {
  return (
    <div className='p-4'>
      <Tabs tabs={tabsData} />
    </div>
  );
}
