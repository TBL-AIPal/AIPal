import React from 'react';

interface AccountTableProps {
  children: React.ReactNode;
}

const AccountTable: React.FC<AccountTableProps> = ({ children }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border border-gray-300'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-4 py-2 border-b'>Name</th>
            <th className='px-4 py-2 border-b'>Email</th>
            <th className='px-4 py-2 border-b'>Role</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default AccountTable;
