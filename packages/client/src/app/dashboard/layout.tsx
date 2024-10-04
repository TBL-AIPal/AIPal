import React from 'react';

import Tabs from '@/components/ui/Tabs';

import { tabsConfig } from '@/constant/config/dashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='p-4'>
      <Tabs tabs={tabsConfig.tabs} />
      <div className='p-4'>{children}</div>
    </div>
  );
}
