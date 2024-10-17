'use client';

import React, { useState } from 'react';

import AccountRow from './_PageSections/AccountRow';
import AccountTable from './_PageSections/AccountTable';

const Overview: React.FC = () => {
  // TODO: Replace with data from API
  const accounts = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ];

  // TODO: Securely fetch API key
  const [apiKey] = useState('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

  return (
    <div className='p-4'>
      {/* Description Section */}
      <h1 className='text-2xl font-semibold mb-2 text-blue-600'>Description</h1>
      <p className='mb-4 text-gray-700'>
        This page is still work in progress. We will update this page once
        authentication feature is ready.
      </p>

      {/* Divider */}
      <div className='mt-4'></div>

      {/* Staff and Students Section */}
      <h1 className='text-2xl font-semibold mb-2 text-blue-600'>
        Staff and Students
      </h1>
      <AccountTable>
        {accounts.map((account, index) => (
          <AccountRow
            key={index}
            name={account.name}
            email={account.email}
            role={account.role}
          />
        ))}
      </AccountTable>

      {/* Divider */}
      <div className='mt-4'></div>

      {/* API Key Section */}
      <h1 className='text-2xl font-semibold mb-2 text-blue-600'>API Key</h1>
      <input
        type='password'
        id='apiKey'
        value={apiKey}
        readOnly
        className='p-2 border border-gray-300 rounded w-full'
        placeholder='Your API Key'
      />
    </div>
  );
};

export default Overview;
