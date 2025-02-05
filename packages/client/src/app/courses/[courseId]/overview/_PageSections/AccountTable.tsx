import React from 'react';

interface AccountTableProps {
  children: React.ReactNode;
}

const AccountTable: React.FC<AccountTableProps> = ({ children }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border-collapse border border-gray-300'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-4 py-2 border-b text-left'>Name</th>
            <th className='px-4 py-2 border-b text-left'>Email</th>
            <th className='px-4 py-2 border-b text-left'>Role</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default AccountTable;
