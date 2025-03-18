'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';

import { GetRoomsByTemplateIds } from '@/lib/API/room/queries';
import { GetCourseById } from '@/lib/API/course/queries';
import { GetUsersByCourseId } from '@/lib/API/user/queries';
import { Room } from '@/lib/types/room';
import { Course, TutorialGroup } from '@/lib/types/course';
import logger from '@/lib/utils/logger';

import { Modal } from '@/components/ui/Modal';
import TextButton from '@/components/buttons/TextButton';
import { UserPlusIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { User } from '@/lib/types/user';
import { UpdateRoom } from '@/lib/API/room/mutations';

const RoomsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tutorialGroups, setTutorialGroups] = useState<TutorialGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showAllRooms, setShowAllRooms] = useState(false);

  const fetchRooms = useCallback(async () => {
    if (!courseIdString) return;
    try {
      const courseData = await GetCourseById(courseIdString);
      setCourse(courseData);
  
      if (courseData.templates.length > 0) {
        const fetchedRooms = await GetRoomsByTemplateIds(courseIdString, courseData.templates);
        setRooms(fetchedRooms);
      }
  
      const fetchedUsers = await GetUsersByCourseId(courseIdString);
      setUsers(fetchedUsers);
  
      setTutorialGroups(courseData.tutorialGroups || []);
    } catch (error) {
      logger(error, 'Error fetching rooms');
    } finally {
      setLoading(false);
    }
  }, [courseIdString]); // Depend on courseIdString

  useEffect(() => {
    fetchRooms();

    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      setCurrentUser(userData);
      setUserRole(userData?.role || 'student');
    }
  }, [courseIdString]);

  const handleOpenModal = (room: Room) => {
    setSelectedRoom(room);
    setRoomCode('');
    setError(null);
    if (currentUser?.role !== 'student' || room.allowedUsers?.includes(currentUser?.id ?? "")) {
      logger(`User ${currentUser?.id} is already allowed. Entering room ${room.name}...`);
      router.push(`/courses/${courseIdString}/rooms/${room.id}`);
    } else {
    setIsModalOpen(true);
    }
  };

  const handleEnterRoom = async () => {
    if (!selectedRoom || !roomCode.trim()) {
      setError('Please enter a code.');
      return;
    }
  
    if (roomCode === selectedRoom.code) {
      logger(`Correct code entered. Adding user ${currentUser?.id} to allowedUsers for room ${selectedRoom.name}...`);
  
      const newAllowedUsers = Array.from(new Set([
        ...(selectedRoom.allowedUsers || []),
        currentUser?.id, // Could be undefined
      ])).filter((id): id is string => Boolean(id));
  
      try {
        await UpdateRoom({ 
          roomId: selectedRoom.id, 
          courseId: courseIdString,
          allowedUsers: newAllowedUsers
        });
  
        // ✅ Close modal and navigate to the room
        setIsModalOpen(false);
        router.push(`/courses/${courseIdString}/rooms/${selectedRoom.id}`);
      } catch (error) {
        logger(error, "Error updating allowedUsers for room entry");
        setError('Failed to update user access. Please try again.');
      }
    } else {
      setError('Invalid code. Please try again.');
    }
  };  

  const handleAddUsersToRoom = async () => {
    if (!selectedRoom) return;
  
    // Get users from selected tutorial groups
    const groupUsers = tutorialGroups
      .filter((group) => selectedGroups.includes(group._id))
      .flatMap((group) => group.students.map((s) => s.id));
  
    // Ensure selectedRoom.allowedUsers exists before spreading
    const newAllowedUsers = Array.from(new Set([
      ...selectedUsers, 
      ...groupUsers
    ]));

    console.log(selectedGroups)
  
    try {
      await UpdateRoom({ 
        roomId: selectedRoom.id, 
        courseId: courseIdString,  // ✅ Ensure courseId is included
        allowedUsers: newAllowedUsers 
      });
  
      setIsAddUserModalOpen(false);
      fetchRooms(); // ✅ Refresh room data after updating users
    } catch (error) {
      logger(error, "Error adding users to room");
    }
  };  

  if (loading) return <div>Loading rooms...</div>;

  const handleOpenAddUserModal = (room: Room) => {
    setSelectedRoom(room);
  
    // ✅ Find all users assigned to any tutorial group in this course
    const assignedUserIds = new Set(
      tutorialGroups.flatMap((group) => group.students.map((s) => s.id))
    );
  
    // ✅ Get only users NOT in any tutorial group
    const unassignedUsers = users.filter((user) => !assignedUserIds.has(user.id));

    const allowedUnassignedUsers = (room.allowedUsers || []).filter(userId => 
      unassignedUsers.some(user => user.id === userId)
  );    
  setSelectedUsers(allowedUnassignedUsers);
  
    // ✅ Find tutorial groups that contain users already in the room
    const groupsWithUsersInRoom = tutorialGroups
      .filter((group) =>
        group.students.some((student) => room.allowedUsers?.includes(student.id))
      )
      .map((group) => group._id);
  
    setUsers(unassignedUsers); // ✅ Show only unassigned users
    setSelectedGroups(groupsWithUsersInRoom); // ✅ Preselect tutorial groups in the room
    setIsAddUserModalOpen(true);
  };

  const accessibleRooms = rooms.filter((room) => 
    userRole !== 'student' || room.allowedUsers?.includes(currentUser?.id ?? "")
  );

  return (
    <div className="p-4">

      {accessibleRooms.length > 0 ? (
        <ul className="border rounded p-4 bg-gray-100">
          {accessibleRooms.map((room) => (
            <li key={room.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
              <span className="font-semibold">{room.name}</span>
              <div className="flex space-x-2 ml-auto">
              {userRole !== 'student' && (
                  <TextButton className="bg-blue-600 text-white py-2 px-4 rounded" onClick={() => handleOpenAddUserModal(room)}>
                    <UserPlusIcon className="w-5 h-5" />
                  </TextButton>
                )}
              <TextButton
                className="bg-blue-600 text-white py-2 px-4 rounded"
                onClick={() => handleOpenModal(room)}
              >
                <ArrowRightCircleIcon className="w-5 h-5" />
              </TextButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available for you.</p>
      )}

{userRole === 'student' && rooms.length > accessibleRooms.length && (
        <div className="mt-4">
          <button
            onClick={() => setShowAllRooms(!showAllRooms)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            {showAllRooms ? "Hide All Rooms" : "Show All Rooms"}
          </button>
          {showAllRooms && (
            <ul className="border rounded p-4 bg-gray-200 mt-2">
              {rooms.map((room) => (
                <li key={room.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                  <span className="font-semibold">{room.name}</span>
                  <TextButton
                    className="bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={() => handleOpenModal(room)}
                  >
                    <ArrowRightCircleIcon className="w-5 h-5" />
                  </TextButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Room Code Modal */}
      {isModalOpen && (
        <Modal title={`Enter Room: ${selectedRoom?.name}`} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col space-y-4">
            <label className="text-lg font-medium">Enter Access Code:</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              placeholder="Enter room code..."
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
                setError(null); // Clear error when user types
              }}
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end space-x-2">
              <TextButton className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>
                Cancel
              </TextButton>
              <TextButton className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleEnterRoom}>
                Enter Room
              </TextButton>
            </div>
          </div>
        </Modal>
      )}
      {isAddUserModalOpen && (
      <Modal title="Add Users to Room" onClose={() => setIsAddUserModalOpen(false)}>
        <div className="flex flex-col space-y-4">
        {users.length > 0 && (
        <>
          <label className="text-lg font-medium">Select Users:</label>
          <div className="border rounded p-2 max-h-40 overflow-y-auto">
            {users.map((user) => (
              <label key={user.id} className="flex items-center space-x-2 p-1">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() =>
                    setSelectedUsers((prev) =>
                      prev.includes(user.id)
                        ? prev.filter((id) => id !== user.id) // ✅ Remove if already selected
                        : [...prev, user.id] // ✅ Add if not selected
                    )
                  }
                />
                <span>{user.name} ({user.email})</span>
              </label>
            ))}
          </div>
        </>
      )}

          {/* ✅ Select Tutorial Groups (Checkboxes instead of dropdown) */}
          {tutorialGroups.length > 0 && (
        <>
          <label className="text-lg font-medium">Select Tutorial Groups:</label>
          <div className="border rounded p-2 max-h-40 overflow-y-auto">
            {tutorialGroups.map((group) => (
              <label key={group._id} className="flex items-center space-x-2 p-1">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedGroups.includes(group._id)}
                  onChange={() =>
                    setSelectedGroups((prev) =>
                      prev.includes(group._id)
                        ? prev.filter((id) => id !== group._id) // ✅ Remove if already selected
                        : [...prev, group._id] // ✅ Add if not selected
                    )
                  }
                />
                <span>{group.name}</span>
              </label>
            ))}
          </div>
        </>
      )}

          {/* ✅ Hide buttons if there's nothing to select */}
      {(users.length > 0 || tutorialGroups.length > 0) && (
        <div className="flex justify-end space-x-2">
          <TextButton className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsAddUserModalOpen(false)}>
            Cancel
          </TextButton>
          <TextButton
            className={`px-4 py-2 rounded ${'bg-green-600 text-white'}`}
            onClick={handleAddUsersToRoom}
          >
            Confirm
          </TextButton>
        </div>
      )}

      {/* ✅ If there are no users/groups, show a message instead */}
      {users.length === 0 && tutorialGroups.length === 0 && (
        <p className="text-gray-500 italic text-center">No users or tutorial groups available to add.</p>
      )}
        </div>
      </Modal>
    )}
    </div>
  );
};

export default RoomsPage;
