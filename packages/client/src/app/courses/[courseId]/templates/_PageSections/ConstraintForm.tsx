import { X } from 'lucide-react'; 
import React, { useState } from 'react';

import { FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';

import AddConstraintButton from './AddConstraintButton';

interface ConstraintFormProps {
  constraints: string[];
  onConstraintChange: (constraints: string[]) => void;
}

export const ConstraintForm: React.FC<ConstraintFormProps> = ({
  constraints,
  onConstraintChange,
}) => {
  const [newConstraint, setNewConstraint] = useState('');

  const handleAddConstraint = () => {
    if (newConstraint.trim()) {
      const updatedConstraints = [...constraints, newConstraint];
      onConstraintChange(updatedConstraints);
      setNewConstraint('');
    }
  };

  const handleRemoveConstraint = (indexToRemove: number) => {
    const updatedConstraints = constraints.filter(
      (_, index) => index !== indexToRemove
    );
    onConstraintChange(updatedConstraints);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddConstraint();
    }
  };

  return (
    <FormItem>
      <FormLabel htmlFor='newConstraint'>Add</FormLabel>
      <div className="flex gap-2">
        <Input
          id='newConstraint'
          value={newConstraint}
          onChange={(e) => setNewConstraint(e.target.value)}
          placeholder='Enter constraint'
          onKeyDown={handleKeyDown}
          required={false}
        />
        <AddConstraintButton
          onClick={handleAddConstraint}
          isDisabled={!newConstraint.trim()}
        />
      </div>

      <FormLabel htmlFor='addedConstraints' className="mt-4 block">Added Constraints</FormLabel>
      <div className="mt-2 flex flex-wrap gap-2">
        {constraints.length > 0 ? (
          constraints.map((constraint, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-900 dark:text-white"
            >
              <span>{constraint}</span>
              <button
                type="button"
                onClick={() => handleRemoveConstraint(index)}
                className="ml-1 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X size={14} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-900 dark:text-white">
            No constraints added yet.
          </p>
        )}
      </div>
    </FormItem>
  );
};