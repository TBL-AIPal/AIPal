import React, { useState } from 'react';

interface RoomCreateFormProps {
  onCreateRoom: (roomData: { roomName: string; description: string }) => void;
}

const RoomCreateForm: React.FC<RoomCreateFormProps> = ({ onCreateRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (roomName && description) {
      onCreateRoom({ roomName, description });
    }
  };

  return (
    <div>
      <label className='block font-semibold'>Room Name:</label>
      <input
        type='text'
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className='border p-1 w-full mb-4'
      />

      <label className='block font-semibold'>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='border p-1 w-full mb-4'
      />

      <button
        onClick={handleSubmit}
        className='bg-blue-600 text-white px-4 py-2 rounded'
      >
        Create Room
      </button>
    </div>
  );
};

export default RoomCreateForm;
