'use client';

import { useParams } from 'next/navigation';
import React, { useCallback,useEffect, useState } from 'react';

import { UpdateCourse } from '@/lib/API/course/mutations';
import { GetCourseById } from '@/lib/API/course/queries';
import { GetUsers, GetUsersByCourseId } from '@/lib/API/user/queries';
import { Course } from '@/lib/types/course';
import { User } from '@/lib/types/user';
import logger from '@/lib/utils/logger';
import { createErrorToast } from '@/lib/utils/toast';

import AccountRow from './_PageSections/AccountRow';
import AccountTable from './_PageSections/AccountTable';

const Overview: React.FC = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;

  const [accounts, setAccounts] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [emailList, setEmailList] = useState<string>('');
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'student' | null>(null);
  const [courseOwner, setCourseOwner] = useState<User | null>(null); //

  const fetchUsers = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const users = await GetUsersByCourseId(courseIdString);
      logger(users, 'Fetched users successfully');
      // Determine current user's role
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUser = users.find((user) => user.email === storedUser?.email);

      if (currentUser) {
        setUserRole(currentUser.role as 'admin' | 'teacher' | 'student');
      }

      setAccounts(users || []);
    } catch (error) {
      createErrorToast('Failed to fetch the course participants. Please try again later.');
    }
  }, [courseIdString]);

  const fetchAllUsers = useCallback(async () => {
    try {
      const users = await GetUsers();
      setAllUsers(users || []);
    } catch (error) {
      createErrorToast('Failed to fetch the course participants. Please try again later.');
    }
  }, []);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const course = await GetCourseById(courseIdString);
      logger(course, 'Course retrieved successfully');
      setCourseDetails(course);

      // Fetch owner details if available
      if (course.owner) {
        const ownerUser = await GetUsers().then(users => users.find(user => user.id === course.owner));
        if (ownerUser) {
          setCourseOwner(ownerUser);
        }
      }
    } catch (error) {
      createErrorToast('Unable to retrieve course details. Please try again later.');
    }
  }, [courseIdString]);

  useEffect(() => {
    fetchUsers();
    fetchAllUsers();
    fetchCourseDetails();
  }, [fetchUsers, fetchAllUsers, fetchCourseDetails]);

  const handleAddUsers = async () => {
    if (!courseIdString || !courseDetails || !emailList) return;
    try {
      const { name, apiKeys, whitelist } = courseDetails;
      const emails = emailList.split(',').map(email => email.trim());
      const existingUsers = allUsers.filter(user => emails.includes(user.email));
      const newUsers = emails.filter(email => !existingUsers.some(user => user.email === email));

      const staffIds = existingUsers.filter(user => user.role === 'teacher').map(user => user.id);
      const studentIds = existingUsers
        .filter(user => user.role !== 'teacher')
        .map(user => user.id);

      await UpdateCourse({
        id: courseIdString,
        name,
        apiKeys, // Updated to support multiple API keys
        students: [
          ...accounts.filter(user => user.role !== 'teacher').map(user => user.id), 
          ...studentIds,
        ],
        staff: [
          ...accounts.filter(user => user.role === 'teacher').map(user => user.id),
          ...staffIds,
        ],
        whitelist: [...whitelist, ...newUsers],
      });

      fetchUsers();
      setDialogOpen(false);
    } catch (error) {
      createErrorToast('Unable to add users. Please try again later.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-2 text-blue-600">Course Overview</h1>
      <p className="mb-4 text-gray-700">{courseDetails?.description || 'No description available for this course.'}</p>
      
      {/* Course Owner Section */}
      {courseOwner && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Course Owner</h2>
          <div className="p-4 border rounded bg-gray-100">
            <p className="text-gray-800 font-medium">{courseOwner.name} ({courseOwner.email})</p>
          </div>
        </div>
      )}
      
      {/* Staff and Students */}
      <h1 className="text-2xl font-semibold mb-2 text-blue-600">Staff and Students</h1>
      <AccountTable>
        {accounts.map((account) => (
          <AccountRow key={account.email} name={account.name} email={account.email} role={account.role} />
        ))}
      </AccountTable>

      {/* Show Whitelisted Emails */}
      {courseDetails?.whitelist && courseDetails.whitelist.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-700">Whitelisted Emails</h2>
          <ul className="border rounded p-4 bg-gray-100">
            {courseDetails.whitelist.map((email) => (
              <li key={email} className="text-gray-800 p-2 border-b last:border-b-0">{email}</li>
            ))}
          </ul>
        </div>
      )}
      
      {userRole !== 'student' && (
        <button onClick={() => setDialogOpen(true)} className="bg-blue-600 text-white p-2 rounded mt-4">
          Add Users
        </button>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Enter email addresses (comma separated):</h3>
            <textarea
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="user1@example.com, user2@example.com"
            />
            <div className="flex justify-between">
              <button onClick={() => setDialogOpen(false)} className="bg-gray-500 text-white p-2 rounded">
                Close
              </button>
              <button onClick={handleAddUsers} disabled={!emailList} className="bg-blue-600 text-white p-2 rounded">
                Add Users
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
