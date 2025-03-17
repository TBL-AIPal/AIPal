'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';

import { GetUsers, GetUsersByCourseId } from '@/lib/API/user/queries';
import { GetCourseById } from '@/lib/API/course/queries';
import { User } from '@/lib/types/user';
import { Course } from '@/lib/types/course';
import logger from '@/lib/utils/logger';
import { UpdateCourse } from '@/lib/API/course/mutations';

import AccountRow from './_PageSections/AccountRow';
import AccountTable from './_PageSections/AccountTable';
import UpdateCourseForm from './_PageSections/UpdateCourseForm';

const Overview: React.FC = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;

  const [accounts, setAccounts] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [emailList, setEmailList] = useState<string>('');
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'student' | null>(null);
  const [courseOwner, setCourseOwner] = useState<User | null>(null); // ✅ Store course owner
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const users = await GetUsersByCourseId(courseIdString);
      logger(users, 'Fetched users successfully');

      // ✅ Determine current user's role
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (storedUser) {
        setUserRole(storedUser.role as 'admin' | 'teacher' | 'student');
      }

      setAccounts(users || []);
    } catch (error) {
      logger(error, 'Error fetching users');
    }
  }, [courseIdString]);

  const fetchAllUsers = useCallback(async () => {
    try {
      const users = await GetUsers();
      setAllUsers(users || []);
    } catch (error) {
      logger(error, 'Error fetching all users');
    }
  }, []);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const course = await GetCourseById(courseIdString);
      console.log(course);
      setCourseDetails(course);

      // ✅ Fetch owner details if available
      if (course.owner) {
        const ownerUser = await GetUsers().then(users => users.find(user => user.id === course.owner));
        if (ownerUser) {
          setCourseOwner(ownerUser);
        }
      }
    } catch (error) {
      logger(error, 'Error fetching course details');
    }
  }, [courseIdString]);

  useEffect(() => {
    fetchUsers();
    fetchAllUsers();
    fetchCourseDetails();
  }, [fetchUsers, fetchAllUsers, fetchCourseDetails]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser || null);
  }, []);

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
        apiKeys, // ✅ Updated to support multiple API keys
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

      // ✅ Immediately update state to trigger re-render
      setCourseDetails(prev => prev ? { ...prev, whitelist: [...prev.whitelist, ...newUsers] } : prev);

      setDialogOpen(false);
    } catch (error) {
      logger(error, 'Error adding users');
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
          <h2 className="text-xl font-semibold text-gray-700">Pending Invites</h2>
          <p className="text-gray-600 mb-2">
            These users have been whitelisted and will be automatically approved when they create an account.
          </p>
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

      {/* Edit Course Button (Only for Admins & Course Owners) */}
      {(userRole === 'admin' || courseOwner?.id === user?.id) && (
        <button
          onClick={() => setEditModalOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-500 text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-600"
        >
          Edit Course
        </button>
      )}

      {/* Edit Course Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <UpdateCourseForm
            course={courseDetails!}
            onClose={() => setEditModalOpen(false)}
            onCourseUpdated={fetchCourseDetails}
          />
        </div>
      )}
    </div>
  );
};

export default Overview;
