import React, { useState } from 'react';

interface Course {
  name: string;
  description: string;
  apiKey: string;
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: Course) => void;
}

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
}) => {
  const [newCourse, setNewCourse] = useState<Course>({
    name: '',
    description: '',
    apiKey: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddCourse(newCourse);
    setNewCourse({ name: '', description: '', apiKey: '' }); // Reset fields after submission
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden'>
      <div className='relative p-4 w-full max-w-md max-h-full'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Create New Course
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
                  Name
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Type course name'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='description'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Course Description
                </label>
                <textarea
                  id='description'
                  rows={4}
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Write course description here'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='apiKey'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  API Key
                </label>
                <input
                  type='text'
                  name='apiKey'
                  id='apiKey'
                  value={newCourse.apiKey}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, apiKey: e.target.value })
                  }
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Enter API key'
                  required
                />
              </div>
            </div>
            <button
              type='submit'
              className='text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700'
            >
              Add new course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
