'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { GetCourseById } from '@/lib/API/course/queries';
import { GetRoomsByTemplateIds } from '@/lib/API/room/queries';
import { Course } from '@/lib/types/course';
import { Room } from '@/lib/types/room';
import logger from '@/lib/utils/logger';

import TextButton from '@/components/buttons/TextButton';
import { Modal } from '@/components/ui/Modal';

const RoomsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string | string[] }>();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!courseIdString) return;
      try {
        // Fetch course details to get the template IDs
        const courseData = await GetCourseById(courseIdString);
        setCourse(courseData);

        if (courseData.templates.length > 0) {
          // Fetch rooms using the template IDs
          const fetchedRooms = await GetRoomsByTemplateIds(courseIdString, courseData.templates);
          setRooms(fetchedRooms);
        }
      } catch (error) {
        logger(error, 'Error fetching rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [courseIdString]);

  const handleOpenModal = (room: Room) => {
    setSelectedRoom(room);
    setRoomCode('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleEnterRoom = () => {
    if (!roomCode.trim()) {
      setError('Please enter a code.');
      return;
    }

    if (roomCode === selectedRoom?.code) {
      logger(`Entering room ${selectedRoom.name}...`);
      setIsModalOpen(false);
      router.push(`/courses/${courseIdString}/rooms/${selectedRoom.id}`);
    } else {
      setError('Invalid code. Please try again.');
    }
  };

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-blue-600">Rooms for {course?.name}</h1>

      {rooms.length > 0 ? (
        <ul className="border rounded p-4 bg-gray-100">
          {rooms.map((room) => (
            <li key={room.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
              <span className="font-semibold">{room.name}</span>
              <TextButton
                className="bg-blue-600 text-white py-2 px-4 rounded"
                onClick={() => handleOpenModal(room)}
              >
                Enter
              </TextButton>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available for this course.</p>
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
    </div>
  );
};

export default RoomsPage;
