'use client';

import React, { useState } from 'react';
import { UpdateCourse } from '@/lib/API/course/mutations';
import { Course } from '@/lib/types/course';
import { createErrorToast, createInfoToast } from '@/lib/utils/toast';

interface UpdateCourseFormProps {
  course: Course;
  onClose: () => void;
  onCourseUpdated: () => void;
}

const UpdateCourseForm: React.FC<UpdateCourseFormProps> = ({ course, onClose, onCourseUpdated }) => {
    console.log("API Keys from course object:", JSON.stringify(course.apiKeys, null, 2));


    const [formData, setFormData] = useState<{
        name: string;
        description: string | undefined;
        apiKeys: { [key: string]: string }; // ✅ Explicitly define index signature
      }>({
        name: course.name,
        description: course.description,
        apiKeys: { ...course.apiKeys }, // Ensure it defaults to an empty object
      });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      apiKeys: { ...formData.apiKeys, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedApiKeys = Object.fromEntries(
        Object.entries(formData.apiKeys).filter(([_, value]) => value.trim() !== '')
      );
  
    try {
    await UpdateCourse({
          id: course.id,
          name: formData.name,
          description: formData.description,
          apiKeys: updatedApiKeys, // ✅ Only send entered API keys
    });
        createInfoToast('Course updated successfully!');
        onCourseUpdated(); // Refresh the course details
        onClose();
    } catch (err: any) {
        createErrorToast(err.message || 'Failed to update course.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium mb-2">Course Name</label>
        <input
          type="text"
          name="name"
          className="w-full px-3 py-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="block text-sm font-medium mt-4 mb-2">Description</label>
        <textarea
          name="description"
          className="w-full px-3 py-2 border rounded"
          value={formData.description}
          onChange={handleChange}
        />

        <h3 className="text-lg font-semibold mt-4">API Keys</h3>
        <p className="text-gray-500 text-sm mb-2">
          Enter new API keys to replace existing ones. Leave blank to keep current keys.
        </p>
        {['gemini', 'llama', 'chatgpt'].map((key) => (
          <div key={key} className="mb-2">
            <label className="block text-sm font-medium capitalize">{key}</label>
            <input
              type="text"
              name={key}
              className="w-full px-3 py-2 border rounded"
              value={formData.apiKeys[key]}
              onChange={handleApiKeyChange}
            />
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourseForm;
