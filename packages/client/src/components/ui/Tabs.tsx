'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Tab {
  name: string;
  link: string;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  // Set the active tab based on the current path
  useEffect(() => {
    const activeIndex = tabs.findIndex(
      (tab) => tab.link === window.location.pathname
    );
    if (activeIndex !== -1) {
      setActiveTab(activeIndex);
    }
  }, [tabs]);

  const handleTabClick = (index: number, link: string) => {
    setActiveTab(index);
    router.push(link);
  };

  return (
    <div>
      <div className='flex border-b border-gray-200'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 p-4 text-sm font-medium text-center border-b-2 rounded-t-lg 
              ${
                activeTab === index
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
            onClick={() => handleTabClick(index, tab.link)}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
