'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import {
  createCombinedMessage,
  createDirectMessage,
  createGeminiMessage,
  createLlama3Message,
  createMultiAgentMessage,
  createRAGMessage,
} from '@/lib/API/message/mutations';
import { GetRoomById } from '@/lib/API/room/queries';
import { GetMessagesByRoomId } from '@/lib/API/room/queries';
import { GetUsers } from '@/lib/API/user/queries';
import { GetTemplateById } from '@/lib/API/template/queries';
import { Message } from '@/lib/types/message';
import { Room } from '@/lib/types/room';
import { Template } from '@/lib/types/template';
import logger from '@/lib/utils/logger';
import { createErrorToast } from '@/lib/utils/toast';

import ChatContainer from './_PageSections/ChatCointainer';
import ChatInput from './_PageSections/ChatInput';
import SettingsBar from './_PageSections/SettingsBar';
import { UpdateRoom } from '@/lib/API/room/mutations';

const RoomChatPage: React.FC = () => {
  const { courseId, roomId } = useParams<{
    courseId: string;
    roomId: string;
  }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [selectedModel, setSelectedModel] = useState('chatgpt');
  const [selectedMethod, setSelectedMethod] = useState('direct');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [users, setUsers] = useState<Record<string, { name: string; email: string }>>({}); 

  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserId(user?.id || null);
      setUserRole(user?.role);
    }
  }, []);  
  
  useEffect(() => {
    if (!roomId) return;
  
    // ✅ Ensure WebSocket URL matches the backend server
    const wsUrl = `ws://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/rooms/${roomId}`;
  
    socketRef.current = new WebSocket(wsUrl);
  
    socketRef.current.onopen = () => {
      console.log(`Connected to WebSocket server: ${wsUrl}`);
    };
  
    socketRef.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, receivedMessage]); // ✅ Update chat messages
    };
  
    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };
  
    return () => {
      socketRef.current?.close(); // ✅ Cleanup WebSocket on unmount
    };
  }, [roomId]);  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await GetUsers(); // ✅ Fetch all users
        const userMap: Record<string, { name: string; email: string }> = {};

        userList.forEach((user) => {
          userMap[user.id] = { name: user.name, email: user.email };
        });

        setUsers(userMap); // ✅ Store users in state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!courseId || !roomId) return;
      try {
        const fetchedRoom = await GetRoomById(courseId, roomId);
        setRoom(fetchedRoom);

        if (fetchedRoom.template) {
          const fetchedTemplate = await GetTemplateById(
            courseId,
            fetchedRoom.template,
          );
          setTemplate(fetchedTemplate);
        }
        if (fetchedRoom.selectedModel) setSelectedModel(fetchedRoom.selectedModel);
        if (fetchedRoom.selectedMethod) setSelectedMethod(fetchedRoom.selectedMethod);

      } catch (err) {
        logger(err, 'Error fetching room details');
        createErrorToast(
          'Unable to load room details. Please try again later.',
        );
      }
    };
    fetchRoom();
  }, [courseId, roomId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const chatMessages = await GetMessagesByRoomId(courseId, roomId);
        const sanitizedMessages = chatMessages.map(
          ({ sender, content, modelUsed, role }) => ({
            role: role || (sender === 'assistant' ? 'assistant' : 'user'),
            sender,
            content,
            modelUsed: modelUsed || 'unknown',
          }),
        );

        setMessages(sanitizedMessages);
      } catch (error) {
        logger(error, 'Error loading chat history');
        createErrorToast(
          'Unable to retrieve chat history. Please try again later.',
        );
      }
    };

    fetchChatHistory();
  }, [courseId, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleModelChange = async (model: string) => {
    setSelectedModel(model);
    try {
      await UpdateRoom({
        courseId,
        roomId,
        selectedModel: model,
      });
    } catch (err) {
      logger(err, 'Failed to update selectedModel in room');
    }
  };
  
  const handleMethodChange = async (method: string) => {
    setSelectedMethod(method);
    try {
      await UpdateRoom({
        courseId,
        roomId,
        selectedMethod: method,
      });
    } catch (err) {
      logger(err, 'Failed to update selectedMethod in room');
    }
  };  

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoadingMessage(true);

    if (!userId) {
      logger('User ID not found', 'Error sending message');
      createErrorToast('Unable to send message since user ID is not found.');
      setLoadingMessage(false);
      return;
    }

    const userMessage = {
      role: 'user' as const,
      content: newMessage,
      sender: userId,
      modelUsed: selectedModel,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');

    try {
      let response;
      const templateId = template?.id ?? '';

      if (selectedMethod === 'multi-agent') {
        response = await createMultiAgentMessage({
          courseId,
          templateId,
          roomId,
          userId,
          conversation: updatedMessages,
        });
      } else if (selectedMethod === 'rag') {
        response = await createRAGMessage({
          courseId,
          templateId,
          roomId,
          userId,
          conversation: updatedMessages,
        });
      } else if (selectedMethod === 'combined') {
        response = await createCombinedMessage({
          courseId,
          templateId,
          roomId,
          userId,
          conversation: updatedMessages,
        });
      } else {
        switch (selectedModel) {
          case 'gemini':
            response = await createGeminiMessage({
              courseId,
              templateId,
              roomId,
              userId,
              conversation: updatedMessages,
            });
            break;
          case 'llama3':
            response = await createLlama3Message({
              courseId,
              templateId,
              roomId,
              userId,
              conversation: updatedMessages,
            });
            break;
          default: // includes 'chatgpt'
            response = await createDirectMessage({
              courseId,
              templateId,
              roomId,
              userId,
              conversation: updatedMessages,
            });
            break;
        }
      }

      logger(response, 'LLM API Response');

      setMessages(
        response.responses.map((msg: Message) => ({
          role: msg.role,
          sender:
            msg.role === 'user' ? (userId ?? 'unknown-user') : 'assistant',
          content: msg.content,
          modelUsed: msg.modelUsed || selectedModel,
        })),
      );
    } catch (error: any) {
      logger(error, 'Caught error in handleSendMessage');

      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as any).message;
      }


      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          sender: 'assistant',
          content: `Error: ${errorMessage}`,
          modelUsed: selectedModel,
        },
      ]);

    } finally {
      setLoadingMessage(false);
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      {/* Settings Bar */}
      <SettingsBar
        selectedModel={selectedModel}
        setSelectedModel={handleModelChange}
        selectedMethod={selectedMethod}
        setSelectedMethod={handleMethodChange}
        isTeacher={userRole !== 'student'}
      />

      {/* Chat Container */}
      <ChatContainer
        messages={messages}
        userId={userId || ''}
        messagesEndRef={messagesEndRef}
      />

      {/* Chat Input */}
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        loadingMessage={loadingMessage}
      />
    </div>
  );
};

export default RoomChatPage;
