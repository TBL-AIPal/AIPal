'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';

import { GetUsers, GetUsersByCourseId } from '@/lib/API/user/queries';
import { GetCourseById } from '@/lib/API/course/queries';
import { User } from '@/lib/types/user';
import logger from '@/lib/utils/logger';
import { UpdateCourse } from '@/lib/API/course/mutations';

import AccountRow from './_PageSections/AccountRow';
import AccountTable from './_PageSections/AccountTable';

const Overview: React.FC = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;

  const [accounts, setAccounts] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [courseDetails, setCourseDetails] = useState<{ name: string; apiKey: string } | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const users = await GetUsersByCourseId(courseIdString);
      logger(users, 'Fetched users successfully');
      setAccounts(users || []);
    } catch (error) {
      logger(error, 'Error fetching users');
    }
  }, [courseIdString]);

  const fetchAllUsers = useCallback(async () => {
    try {
      const users = await GetUsers(); // Fetch all users for selection
      setAllUsers(users || []);
    } catch (error) {
      logger(error, 'Error fetching all users');
    }
  }, []);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const course = await GetCourseById(courseIdString); // Fetch course details
      setCourseDetails({ name: course.name, apiKey: course.apiKey });
    } catch (error) {
      logger(error, 'Error fetching course details');
    }
  }, [courseIdString]);

  const handleAddUser = async () => {
    if (!courseIdString || !courseDetails || !selectedUserId) return;

    try {
      const { name, apiKey } = courseDetails;

      // Update the course with the new student added
      await UpdateCourse({
        id: courseIdString,
        name,
        apiKey,
        students: [...accounts.map(account => account.id), selectedUserId],
        staff: [], // Assuming no staff for simplicity, modify as needed
      });

      fetchUsers(); // Re-fetch the users after adding the new one
      setDialogOpen(false); // Close the dialog after adding the user
    } catch (error) {
      logger(error, 'Error adding user');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllUsers();
    fetchCourseDetails();
  }, [fetchUsers, fetchAllUsers, fetchCourseDetails]);

  return (
    <div className="p-4">
      {/* Description Section */}
      <h1 className="text-2xl font-semibold mb-2 text-blue-600">Description</h1>
      <p className="mb-4 text-gray-700">
        This page is still a work in progress. We will update this page once the authentication feature is ready.
      </p>

      {/* Divider */}
      <div className="mt-4"></div>

      {/* Dialog for Adding User */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Select a user to add:</h3>
            <ul className="mb-4">
              {allUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between mb-2 cursor-pointer"
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <span>{user.name} ({user.role})</span>
                  {selectedUserId === user.id && (
                    <span className="text-blue-600">Selected</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex justify-between">
              <button
                onClick={() => setDialogOpen(false)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Close
              </button>
              <button
                onClick={handleAddUser}
                disabled={!selectedUserId}
                className="bg-blue-600 text-white p-2 rounded"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff and Students Section */}
      <h1 className="text-2xl font-semibold mb-2 text-blue-600">Staff and Students</h1>
      <AccountTable>
        {accounts.map((account) => (
          <AccountRow
            key={account.email}
            name={account.name}
            email={account.email}
            role={account.role}
          />
        ))}
      </AccountTable>
            {/* Add User Section (Button) */}
            <button
        onClick={() => setDialogOpen(true)}
        className="bg-blue-600 text-white p-2 rounded mt-4"
      >
        Add User
      </button>
    </div>
  );
};

export default Overview;
