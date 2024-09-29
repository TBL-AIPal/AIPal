import React, { useState } from 'react';

interface Template {
  name: string;
  constraints: string[];
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTemplate: (template: Template) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onAddTemplate,
}) => {
  const [newTemplate, setNewTemplate] = useState<Template>({
    name: '',
    constraints: [],
  });

  const handleConstraintsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedConstraints = [...newTemplate.constraints];
    updatedConstraints[index] = event.target.value;
    setNewTemplate({ ...newTemplate, constraints: updatedConstraints });
  };

  const addConstraintField = () => {
    setNewTemplate({
      ...newTemplate,
      constraints: [...newTemplate.constraints, ''],
    });
  };

  const removeConstraintField = (index: number) => {
    const updatedConstraints = newTemplate.constraints.filter(
      (_, i) => i !== index
    );
    setNewTemplate({ ...newTemplate, constraints: updatedConstraints });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTemplate(newTemplate);
    setNewTemplate({ name: '', constraints: [] }); // Reset fields after submission
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden'>
      <div className='relative p-4 w-full max-w-md max-h-full'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Create New Template
            </h3>
            <button
              type='button'
              className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={onClose}
            >
              <svg
                className='w-3 h-3'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 14'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                />
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          <form className='p-4' onSubmit={handleSubmit}>
            <div className='grid gap-4 mb-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Template Name
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Type template name'
                  required
                />
              </div>
              <div>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Constraints
                </label>
                {newTemplate.constraints.map((constraint, index) => (
                  <div key={index} className='flex items-center mb-2'>
                    <input
                      type='text'
                      value={constraint}
                      onChange={(e) => handleConstraintsChange(e, index)}
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      placeholder='Constraint'
                    />
                    <button
                      type='button'
                      className='ml-2 text-red-600 hover:text-red-800'
                      onClick={() => removeConstraintField(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  className='mt-2 text-blue-600 hover:text-blue-800'
                  onClick={addConstraintField}
                >
                  + Add another constraint
                </button>
              </div>
            </div>
            <button
              type='submit'
              className='text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700'
            >
              Add Template
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
