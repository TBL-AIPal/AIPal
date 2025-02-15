'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';

import { GetRoomById } from '@/lib/API/room/queries';
import { Room } from '@/lib/types/room';
import logger from '@/lib/utils/logger';

import TextButton from '@/components/buttons/TextButton';

const RoomChatPage: React.FC = () => {
  const { courseId, roomId } = useParams<{ courseId: string; roomId: string }>();

  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!courseId || !roomId) return;

      try {
        const fetchedRoom = await GetRoomById(courseId, roomId);
        setRoom(fetchedRoom);
        setMessages([
          { sender: 'System', text: `Welcome to ${fetchedRoom.name}!` },
        ]);
      } catch (err) {
        logger(err, 'Error fetching room details');
        setError('Failed to load room details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [courseId, roomId]);

  useEffect(() => {
    // Auto-scroll to latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [...prev, { sender: 'You', text: newMessage }]);
    setNewMessage('');
  };

  if (loading) return <div>Loading chat...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Room Title */}
      <h1 className="text-2xl font-semibold text-blue-600">{room?.name} - Chat</h1>

      {/* Chat Messages */}
      <div className="flex-1 mt-4 p-4 border rounded bg-gray-100 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
            <span className="font-bold">{msg.sender}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <TextButton className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSendMessage}>
          Send
        </TextButton>
      </div>
    </div>
  );
};

export default RoomChatPage;
