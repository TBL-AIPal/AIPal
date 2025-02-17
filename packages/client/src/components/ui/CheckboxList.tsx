import React, { useState } from 'react';

interface CheckboxListProps<T> {
  items: T[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  onChange?: (selectedIds: string[]) => void;
}

const CheckboxList = <T,>({
  items,
  getId,
  getLabel,
  onChange,
}: CheckboxListProps<T>) => {
  // State to track selected item IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCheckboxChange = (itemId: string) => {
    const newSelectedIds = selectedIds.includes(itemId)
      ? selectedIds.filter((id) => id !== itemId) // Remove if already selected
      : [...selectedIds, itemId]; // Add if not selected

    setSelectedIds(newSelectedIds);
    onChange?.(newSelectedIds); // Trigger the callback if provided
  };

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => {
          const id = getId(item);
          const label = getLabel(item);

          return (
            <li key={id} style={{ marginBottom: '8px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <input
                  type='checkbox'
                  checked={selectedIds.includes(id)}
                  onChange={() => handleCheckboxChange(id)}
                />
                <span className='block text-sm font-normal text-gray-900 dark:text-white'>
                  {label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CheckboxList;
