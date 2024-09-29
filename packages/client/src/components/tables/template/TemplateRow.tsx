import React, { useState } from 'react';

interface TemplateRowProps {
  name: string;
  constraints: string[];
}

const TemplateRow: React.FC<TemplateRowProps> = ({ name, constraints }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      <tr
        onClick={toggleExpand}
        className={`cursor-pointer transition-colors duration-300 ${
          isExpanded ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        <td className='border-b py-2 px-4'>{name}</td>
        <td className='border-b py-2 px-4'>
          {isExpanded ? 'Hide Constraints' : 'Show Constraints'}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={2} className='border-b py-2 px-4'>
            <ul className='list-disc pl-5'>
              {constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
};

export default TemplateRow;
