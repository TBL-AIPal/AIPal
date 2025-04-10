'use client';

import { useParams } from 'next/navigation';
import React, { useCallback,useEffect, useState } from 'react';

import { GetCourseById } from '@/lib/API/course/queries';

import { User } from '@/lib/types/user';
import { Course, TutorialGroup } from '@/lib/types/course';
import logger from '@/lib/utils/logger';
import { UpdateCourse, CreateTutorialGroup } from '@/lib/API/course/mutations';
import { UpdateTutorialGroup } from '@/lib/API/tutorialgroup/mutations';
import { ChevronDown, ChevronRight } from 'lucide-react';

import AccountRow from './_PageSections/AccountRow';
import AccountTable from './_PageSections/AccountTable';
import { createErrorToast } from '@/lib/utils/toast';
import UpdateCourseForm from './_PageSections/UpdateCourseForm';
import { GetUsers, GetUsersByCourseId } from '@/lib/API/user/queries';


const Overview: React.FC = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;

  const [accounts, setAccounts] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [isTutorialDialogOpen, setTutorialDialogOpen] = useState(false);
  const [emailList, setEmailList] = useState<string>('');
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'student' | null>(null);
  const [courseOwner, setCourseOwner] = useState<User | null>(null); //
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tutorialGroups, setTutorialGroups] = useState<TutorialGroup[]>([]);
  const [groupName, setGroupName] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [selectedTutorialGroup, setSelectedTutorialGroup] = useState<string>("");

  const toggleSection = (groupId: string) => {
    console.log(groupId)
    setExpandedSections((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const fetchUsers = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const users = await GetUsersByCourseId(courseIdString);
      logger(users, 'Fetched users successfully');
      // Determine current user's role
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (storedUser) {
        setUserRole(storedUser.role as 'admin' | 'teacher' | 'student');
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
      setTutorialGroups(course.tutorialGroups || []);

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
      const userIds = existingUsers.map(user => user.id);

      await UpdateCourse({
        id: courseIdString,
        name,
        apiKeys, // Updated to support multiple API keys
        students: Array.from(new Set([
          ...accounts.filter(user => user.role !== 'teacher').map(user => user.id), 
          ...studentIds,
        ])),
        staff: Array.from(new Set([
          ...accounts.filter(user => user.role === 'teacher').map(user => user.id),
          ...staffIds,
        ])),
        whitelist: Array.from(new Set([...whitelist, ...newUsers])),
      });      

      if (selectedTutorialGroup) {
        // First: remove all selected users from any group they're currently in
        for (const group of tutorialGroups) {
          const currentUserIds = group.students.map((s) => s.id);
          const updatedUserIds = currentUserIds.filter((id) => !userIds.includes(id));
      
          if (updatedUserIds.length !== currentUserIds.length) {
            await UpdateTutorialGroup({
              courseId: courseIdString,
              tutorialGroupId: group._id,
              userIds: updatedUserIds,
            });
          }
        }
      
        // Then: assign selected users only to the chosen group
        const selectedGroup = tutorialGroups.find((g) => g._id === selectedTutorialGroup);
        const existingUserIds = selectedGroup?.students.map((s) => s.id) || [];
      
        // We override any past value, just add the new users cleanly
        const updatedUserIds = Array.from(new Set([...existingUserIds.filter(id => !userIds.includes(id)), ...userIds]));
      
        await UpdateTutorialGroup({
          courseId: courseIdString,
          tutorialGroupId: selectedTutorialGroup,
          userIds: updatedUserIds,
        });
      } else {
        // No group selected – remove the users from any group they're in
        for (const group of tutorialGroups) {
          const currentUserIds = group.students.map((s) => s.id);
          const updatedUserIds = currentUserIds.filter((id) => !userIds.includes(id));
      
          if (updatedUserIds.length !== currentUserIds.length) {
            await UpdateTutorialGroup({
              courseId: courseIdString,
              tutorialGroupId: group._id,
              userIds: updatedUserIds,
            });
          }
        }
      }      
       

      await fetchUsers();
      await fetchCourseDetails();
      setUserDialogOpen(false);
    } catch (error) {
      createErrorToast('Unable to add users. Please try again later.');
    }
  };

  const handleCreateGroup = async () => {
    if (!courseIdString || !groupName) return;
    
    try {
      await CreateTutorialGroup(courseIdString, groupName);
      fetchCourseDetails(); // Refresh tutorial groups
      setTutorialDialogOpen(false);
    } catch (error) {
      logger(error, 'Error creating tutorial group');
    }
  };


  const unassignedUsers = accounts.filter(
    (user) =>
      !tutorialGroups.some((group) =>
        group.students.some((student) => student.id === user.id) // Compare student.id with user.id
      )
  );  

  return (
    <div className="p-4">
      <div className="p-4">
      <h1 className="text-2xl font-semibold mb-2 text-blue-600">Key Information</h1>
      <p className="mb-4 text-gray-700">{courseDetails?.description || 'No description available for this course.'}</p>
      
      {courseOwner && (
        <p className="text-sm text-gray-600 mt-2">
          Coordinator: <span className="font-medium text-gray-800">{courseOwner.name} ({courseOwner.email})</span>
        </p>
      )}
       {/* Edit Course Button (Only for Admins & Course Owners) */}
       {(userRole === 'admin' || courseOwner?.id === user?.id) && (
        <button
          onClick={() => setEditModalOpen(true)}
          className="bg-blue-600 text-white p-2 rounded mt-4"
        >
          Edit Course
        </button>
      )}
      </div>
      
      <div className="p-4">
      {/* Tutorial Groups Section */}
      <h1 className="text-2xl font-semibold mb-2 text-blue-600">Staff and Students</h1>
      <ul className="border rounded p-4 bg-gray-100">
      <div className="text-gray-800 p-2 border-b last:border-b-0">
      <span>Tutorial Groups</span>
      </div>
        {tutorialGroups.length > 0 ? (
          tutorialGroups.map((group) => (
            <li key={group._id} className="text-gray-800 p-2 border-b last:border-b-0">
              <div
                className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-200 rounded-md"
                onClick={() => toggleSection(group._id)}
              >
                <span>{group.name} ({group.students.length})</span>
                {expandedSections[group._id] ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {/* Show users when expanded */}
              {expandedSections[group._id] && (
              <div className="ml-4 mt-2 p-2 bg-white border rounded shadow">
                {group.students.length > 0 ? (
                  <AccountTable>
                    {group.students.map((student) => {
                      const matchedUser = allUsers.find((user) => user.id === student.id); // Find user by ID
                      return (
                        <AccountRow
                          key={student.id}
                          name={student.name}
                          email={student.email}
                          role={matchedUser ? matchedUser.role : "Unknown"} // Get role dynamically
                        />
                      );
                    })}
                </AccountTable>
                
                ) : (
                  <p className="text-gray-500 px-2 py-1">No students in this group.</p>
                )}
              </div>
            )}

            </li>
          ))
        ) : (
          <div className="ml-4 mt-2 p-2 bg-white border rounded shadow">
          <p className="text-gray-500">No tutorial groups yet.</p>
          </div>
        )}
      </ul>
      <ul className="border rounded p-4 bg-gray-100">
        <li className="text-gray-800 p-2 border-b last:border-b-0">
          <div
            className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-200 rounded-md"
            onClick={() => toggleSection('unassignedUsers')}
          >
            <span>Unassigned ({unassignedUsers.length})</span>
            {expandedSections['unassignedUsers'] ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>

          {expandedSections['unassignedUsers'] && (
          <div className="ml-4 mt-2 p-2 bg-white border rounded shadow">
            {unassignedUsers.length > 0 ? (
              <AccountTable>
                  {unassignedUsers.map((user) => (
                    <AccountRow key={user.email} name={user.name} email={user.email} role={user.role} />
                  ))}
              </AccountTable>
            ) : (
              <p className="text-gray-500 px-2 py-1">No unassigned users.</p>
            )}
          </div>
        )}
        </li>
      </ul>

      <ul className="border rounded p-4 bg-gray-100">
        <li className="text-gray-800 p-2 border-b last:border-b-0">
          <div
            className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-200 rounded-md"
            onClick={() => toggleSection('pendingInvites')}
          >
            <span>Pending AIPal Invite ({courseDetails?.whitelist.length || 0})</span>
            {expandedSections['pendingInvites'] ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>

          {expandedSections['pendingInvites'] && (
          <div className="ml-4 mt-2 p-2 bg-white border rounded shadow">
            {courseDetails?.whitelist && courseDetails.whitelist.length > 0 ? (
              <AccountTable>
                  {courseDetails.whitelist.map((email) => (
                    <AccountRow key={email} name="-" email={email} role="-" />
                  ))}
              </AccountTable>
            ) : (
              <p className="text-gray-500 px-2 py-1">
                No pending invites.
              </p>
            )}
          </div>
        )}
                </li>
      </ul>

      <div className="rounded flex gap-4">
      {userRole !== 'student' && (
        <button onClick={() => setUserDialogOpen(true)} className="bg-blue-600 text-white p-2 rounded mt-4">
          Add Users
        </button>
      )}

      {userRole !== 'student' && (
      <button
        onClick={() => setTutorialDialogOpen(true)}
        className="bg-blue-600 text-white p-2 rounded mt-4"
      >
        Add Tutorial Group
      </button>)}
      </div>


      {isUserDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Enter email addresses (comma separated):</h3>
            <textarea
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="user1@example.com, user2@example.com"
            />
            <label className="block text-sm font-medium text-gray-700">Assign to Tutorial Group (Optional)</label>
            <select
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => setSelectedTutorialGroup(e.target.value)}
              value={selectedTutorialGroup}
            >
              <option value="">No Group</option>
              {tutorialGroups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button onClick={() => setUserDialogOpen(false)} className="bg-gray-500 text-white p-2 rounded">
                Close
              </button>
              <button onClick={handleAddUsers} disabled={!emailList} className="bg-blue-600 text-white p-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    {isTutorialDialogOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-1/3">
          <h3 className="text-xl font-semibold mb-4">Create Tutorial Group</h3>
          <input
            type="text"
            placeholder="Group Name"
            className="w-full p-2 border rounded mb-4"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="flex justify-between">
            <button onClick={() => setTutorialDialogOpen(false)} className="bg-gray-500 text-white p-2 rounded">
              Close
            </button>
            <button onClick={handleCreateGroup} className="bg-green-500 text-white p-2 rounded">
              Create Group
            </button>
          </div>
        </div>
      </div>
    )}
      </div>

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
