import React, { useState } from 'react';

import { FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';

import AddConstraintButton from './AddConstraintButton';

interface ConstraintFormProps {
  constraints: string[];
  onAddConstraint: (constraint: string) => void;
}

export const ConstraintForm: React.FC<ConstraintFormProps> = ({
  constraints,
  onAddConstraint,
}) => {
  const [newConstraint, setNewConstraint] = useState('');

  const handleAddConstraint = () => {
    if (newConstraint.trim()) {
      onAddConstraint(newConstraint);
      setNewConstraint(''); // Clear the input after adding
    }
  };

  return (
    <FormItem>
      <FormLabel htmlFor='newConstraint'>Add Constraint</FormLabel>
      <form
        onSubmit={(event) => {
          event.preventDefault(); // Prevent default form submission
          handleAddConstraint();
        }}
      >
        <Input
          id='newConstraint'
          value={newConstraint}
          onChange={(e) => setNewConstraint(e.target.value)}
          placeholder='Enter constraint'
        />
        <AddConstraintButton
          onClick={handleAddConstraint}
          isDisabled={!newConstraint.trim()} // Disable button if the input is empty
        />
      </form>

      {/* Display constraints */}
      <div className='mt-4'>
        {constraints.length > 0 ? (
          <ul className='list-disc pl-5 space-y-1'>
            {constraints.map((constraint, index) => (
              <li
                key={index}
                className='flex items-center text-sm text-gray-900 dark:text-white'
              >
                <span className='mr-2'>•</span>
                {constraint}
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-gray-900 dark:text-white'>
            No constraints added yet.
          </p>
        )}
      </div>
    </FormItem>
  );
};
