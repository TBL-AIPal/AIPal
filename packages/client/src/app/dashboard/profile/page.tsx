'use client';

import React, { useEffect, useState } from 'react';

import { GetUsersByRole, ApproveUser, RejectUser } from '@/lib/API/user/queries';
import { User } from '@/lib/types/user';
import logger from '@/lib/utils/logger';

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
        setLoading(false); // Ensure loading is turned off
        return;
      }
  
      const userData = JSON.parse(userString);
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
  
      if (userData.role === 'admin') {
        fetchTeachers();
      } else {
        setLoading(false); // Mark loading as false for non-admin users
      }
    } catch (err) {
      logger(err, 'Error fetching user data');
      setLoading(false); // Ensure loading is turned off in case of error
    }
  };  

  const fetchTeachers = async () => {
    try {
      const allTeachers = await GetUsersByRole('teacher');
      setTeachers(allTeachers);
    } catch (err) {
      logger(err, 'Error fetching teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      if (newStatus === 'approved') {
        await ApproveUser(userId);
      } else {
        await RejectUser(userId);
      }
      setTeachers((prev) =>
        prev.map((teacher) => (teacher.id === userId ? { ...teacher, status: newStatus } : teacher))
      );
    } catch (err) {
      logger(err, `Error changing status to ${newStatus}`);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (isAdmin) {
    return (
      <div className='p-4'>
        <h1 className='text-2xl font-semibold mb-2 text-blue-600'>Teacher Approvals</h1>
        {teachers.length > 0 ? (
          <ul>
            {teachers.map((teacher) => (
              <li key={teacher.id} className='flex justify-between p-2 border-b'>
                <span>{teacher.name} ({teacher.email}) - <strong>{teacher.status}</strong></span>
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
          <p>No teachers pending approval.</p>
        )}
      </div>
    );
  }

  if (user?.status === 'pending') {
    return (
      <div className='p-4'>
        <h1 className='text-2xl font-semibold mb-2 text-yellow-500'>Account Pending Approval</h1>
        <p>Your account is awaiting admin approval. Please check back later.</p>
      </div>
    );
  }

  if (user?.status === 'rejected') {
    return (
      <div className='p-4'>
        <h1 className='text-2xl font-semibold mb-2 text-red-500'>Account Rejected</h1>
        <p>Your account has been rejected by the admin. Please contact support for assistance.</p>
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
