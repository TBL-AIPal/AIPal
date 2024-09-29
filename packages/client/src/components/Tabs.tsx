// Tabs.tsx
import React, { useState } from 'react';

interface Tab {
  name: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

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
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className='p-4'>{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
