import React from 'react';

interface AccountRowProps {
  name: string;
  email: string;
  role: string;
}

const AccountRow: React.FC<AccountRowProps> = ({ name, email, role }) => {
  return (
    <tr className='hover:bg-gray-50'>
      <td className='px-4 py-2 border-b'>{name}</td>
      <td className='px-4 py-2 border-b'>{email}</td>
      <td className='px-4 py-2 border-b'>{role}</td>
    </tr>
  );
};

export default AccountRow;
