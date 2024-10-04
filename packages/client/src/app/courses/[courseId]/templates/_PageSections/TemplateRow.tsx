import React, { useState } from 'react';

interface TemplateRowProps {
  name: string;
  constraints: string[];
  onDelete: () => void;
  onUpdate: (updatedData: { name: string; constraints: string[] }) => void;
}

const TemplateRow: React.FC<TemplateRowProps> = ({
  name,
  constraints,
  onDelete,
  onUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editConstraints, setEditConstraints] = useState(constraints);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setIsEditing(false);
  };

  const toggleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing((prev) => !prev);
  };

  const handleUpdate = () => {
    onUpdate({ name: editName, constraints: editConstraints });
    setIsEditing(false);
  };

  return (
    <>
      {/* Main Row */}
      <tr
        onClick={toggleExpand}
        className={`cursor-pointer transition-colors duration-300 ${
          isExpanded ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        {/* Name Column */}
        <td className='border-b py-2 px-4'>
          {isEditing ? (
            <input
              type='text'
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className='border p-1'
            />
          ) : (
            name
          )}
        </td>

        {/* Action Column */}
        <td className='border-b py-2 px-4 flex space-x-2'>
          {/* Edit/Save Button */}
          {isEditing ? (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent row toggle on clicking Save
                handleUpdate();
              }}
              className='bg-blue-600 text-white px-2 py-1 rounded'
            >
              Save
            </button>
          ) : (
            <button
              onClick={toggleEdit}
              className='text-blue-600 px-2 py-1 rounded'
            >
              Edit
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row toggle when clicking Delete
              onDelete();
            }}
            className='text-red-600 px-2 py-1 rounded'
          >
            Delete
          </button>
        </td>
      </tr>

      {/* Expanded Row */}
      {isExpanded && (
        <tr>
          <td colSpan={2} className='border-b py-2 px-4'>
            {isEditing ? (
              <div className='mb-2'>
                <label className='font-semibold'>Constraints:</label>
                <textarea
                  value={editConstraints.join(', ')}
                  onChange={(e) =>
                    setEditConstraints(
                      e.target.value.split(',').map((c) => c.trim())
                    )
                  }
                  className='border p-1 w-full'
                />
              </div>
            ) : (
              <ul className='list-disc pl-5'>
                {constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

export default TemplateRow;
