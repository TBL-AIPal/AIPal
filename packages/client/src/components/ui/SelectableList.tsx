import React, { useState } from 'react';

interface SelectableListProps<T> {
  items: T[];
  getId: (item: T) => string;
  getContent: (item: T) => React.ReactNode;
  onChange?: (selectedIds: string[]) => void;
  selectedIds?: string[];
}

const SelectableList = <T,>({
  items,
  getId,
  getContent,
  onChange,
  selectedIds: externalSelectedIds,
}: SelectableListProps<T>) => {
  // Use externalSelectedIds if provided, otherwise manage internally
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const selectedIds = externalSelectedIds ?? internalSelectedIds;

  const handleListChange = (itemId: string) => {
    const newSelectedIds = selectedIds.includes(itemId)
      ? selectedIds.filter((id) => id !== itemId)
      : [...selectedIds, itemId];

    // If controlled externally, only call onChange
    if (externalSelectedIds !== undefined) {
      onChange?.(newSelectedIds);
    } else {
      // Otherwise, update internal state
      setInternalSelectedIds(newSelectedIds);
      onChange?.(newSelectedIds);
    }
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item) => {
        const id = getId(item);
        const isSelected = selectedIds.includes(id);

        return (
          <li
            key={id}
            onClick={() => handleListChange(id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: isSelected ? '#f3f4f6' : '#ffffff',
              border: isSelected ? '1px solid #f3f4f6' : '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
            }}
          >
            {/* Content */}
            {getContent(item)}
          </li>
        );
      })}
    </ul>
  );
};

export default SelectableList;
