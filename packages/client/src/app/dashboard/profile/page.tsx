'use client';

import React, { useEffect, useState } from 'react';

import { ApproveUser, GetUsers, RejectUser } from '@/lib/API/user/queries';
import { User } from '@/lib/types/user';
import logger from '@/lib/utils/logger';
import { createErrorToast } from '@/lib/utils/toast';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        logger('User not authenticated', 'Error: No user in localStorage');
        createErrorToast('Access denied. Please log in to proceed.');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userString);
      setUser(userData);
      setIsAdmin(userData.role === 'admin');

      fetchAllUsers();
    } catch (err) {
      logger(err, 'Error fetching user data');
      createErrorToast(`Unable to retrieve user's information. Please try again later.`);
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const users = await GetUsers();
      setTeachers(users.filter((u) => u.role === 'teacher'));
    } catch (err) {
      createErrorToast('Unable to retrieve users information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'approved' | 'rejected') => {
    try {
      if (newStatus === 'approved') {
        await ApproveUser(userId);
      } else {
        await RejectUser(userId);
      }

      setTeachers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      logger(err, `Error changing status to ${newStatus}`);
      createErrorToast(`Unable to approve/reject user. Please try again later.`);
    }
  };

  const handleApproveAll = async () => {
    try {
      const usersToApprove = teachers.filter((u) => u.status === 'pending');
      if (usersToApprove.length === 0) return;

      await Promise.all(usersToApprove.map((user) => ApproveUser(user.id)));

      setTeachers((prev) =>
        prev.map((u) =>
          u.status === 'pending' ? { ...u, status: 'approved' } : u
        )
      );
    } catch (err) {
      logger(err, `Error approving teachers`);
      createErrorToast(`Unable to approve users. Please try again later.`);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (isAdmin) {
    return (
      <div className='p-4'>
        <h1 className='text-2xl font-semibold mb-4 text-blue-600'>User Management</h1>

        {/* Teachers Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Teachers</h2>
          
          {teachers.some((t) => t.status === 'pending') && (
            <button 
              onClick={handleApproveAll} 
              className="bg-green-600 text-white p-2 rounded mb-4 w-full"
            >
              Approve All Pending Teachers
            </button>
          )}

          {teachers.length > 0 ? (
            <ul className="mt-4">
              {teachers.map((teacher) => (
                <li key={teacher.id} className='flex justify-between p-2 border-b'>
                  <span>{teacher.name} ({teacher.email}) - <strong className={
                    teacher.status === 'approved' ? 'text-green-500' :
                    teacher.status === 'pending' ? 'text-yellow-500' :
                    'text-red-500'
                  }>
                    {teacher.status}
                  </strong></span>
                  <div>
                    <button
                      onClick={() => handleStatusChange(teacher.id, 'approved')}
                      className='bg-green-500 text-white p-2 rounded mr-2'
                    >Approve</button>
                    <button
                      onClick={() => handleStatusChange(teacher.id, 'rejected')}
                      className='bg-red-500 text-white p-2 rounded'
                    >Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No teachers found.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold mb-2 text-blue-600'>Profile</h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
