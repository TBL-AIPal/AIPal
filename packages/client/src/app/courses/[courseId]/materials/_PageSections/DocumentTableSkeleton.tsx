import React from 'react';

import Skeleton from '@/components/Skeleton';

const DocumentTableSkeleton: React.FC = () => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border border-gray-300'>
        {/* Table Header */}
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-4 py-2 border-b'>
              <Skeleton width='5rem' height='1rem' className='mx-auto' />
            </th>
            <th className='px-4 py-2 border-b'>
              <Skeleton width='5rem' height='1rem' className='mx-auto' />
            </th>
            <th className='px-4 py-2 border-b'>
              <Skeleton width='5rem' height='1rem' className='mx-auto' />
            </th>
            <th className='px-4 py-2 border-b'>
              <Skeleton width='5rem' height='1rem' className='mx-auto' />
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className='hover:bg-gray-50'>
              <td className='px-4 py-2 border-b text-center'>
                <Skeleton width='80%' height='1rem' className='mx-auto' />
              </td>
              <td className='px-4 py-2 border-b text-center'>
                <Skeleton width='60%' height='1rem' className='mx-auto' />
              </td>
              <td className='px-4 py-2 border-b text-center'>
                <Skeleton width='40%' height='1rem' className='mx-auto' />
              </td>
              <td className='px-4 py-2 border-b text-center'>
                <Skeleton width='1.5rem' height='1.5rem' className='mx-auto' />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTableSkeleton;