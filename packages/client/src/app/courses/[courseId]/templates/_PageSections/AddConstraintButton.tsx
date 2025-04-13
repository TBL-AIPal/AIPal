import React from 'react';

interface AddConstraintButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
}

const AddConstraintButton: React.FC<AddConstraintButtonProps> = ({
  onClick,
  isDisabled,
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={isDisabled}
      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      Add
    </button>
  );
};

export default AddConstraintButton;
