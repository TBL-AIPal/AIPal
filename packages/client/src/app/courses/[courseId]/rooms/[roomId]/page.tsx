'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useRef,useState } from 'react';

import { createCombinedMessage, createDirectMessage, createGeminiMessage, createLlama3Message,createMultiAgentMessage, createRAGMessage } from '@/lib/API/message/mutations';
import { GetUsers } from '@/lib/API/user/queries';
import { GetRoomById } from '@/lib/API/room/queries';
import { GetMessagesByRoomId } from '@/lib/API/room/queries';
import { GetTemplateById } from '@/lib/API/template/queries';
import { Message } from '@/lib/types/message';
import { Room } from '@/lib/types/room';
import { Template } from '@/lib/types/template';
import logger from '@/lib/utils/logger';

import TextButton from '@/components/buttons/TextButton';

const RoomChatPage: React.FC = () => {
  const { courseId, roomId } = useParams<{ courseId: string; roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [messages, setMessages] = useState<{ 
    role: 'user' | 'assistant' | 'system';
    sender: string;
    content: string;
    modelUsed?: string;
  }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('chatgpt-direct');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<Record<string, { name: string; email: string }>>({}); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserId(user?.id || null);
    }
  }, []);  
  
  useEffect(() => {
    if (!roomId) return;
  
    // ✅ Ensure WebSocket URL matches the backend server
    const wsUrl = `ws://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/rooms/${roomId}`;
  
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
          const fetchedTemplate = await GetTemplateById(courseId, fetchedRoom.template);
          setTemplate(fetchedTemplate);
        }
      } catch (err) {
        logger(err, 'Error fetching room details');
        setError('Failed to load room details.');
      }
    };
    fetchRoom();
  }, [courseId, roomId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const chatMessages = await GetMessagesByRoomId(courseId, roomId);
        // ✅ Sanitize messages to only keep `role`, `sender`, `content`
        // ✅ Ensure role exists for each message
        const sanitizedMessages = chatMessages.map(({ sender, content, modelUsed, role }) => ({
            role: role || (sender === 'assistant' ? 'assistant' : 'user'), // ✅ Assign role based on sender if missing
            sender,
            content,
            modelUsed: modelUsed || 'unknown', // ✅ Default model if missing
          }));
  
          setMessages(sanitizedMessages);
          
      } catch (error) {
        logger(error, 'Error loading chat history');
      }
    };

    fetchChatHistory();
  }, [courseId, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoadingMessage(true);

    if (!userId) {
      logger('User ID not found', 'Error sending message');
      setLoadingMessage(false);
      return;
    }

    const userMessage = { role: 'user' as const, sender: userId, content: newMessage, modelUsed: selectedModel };

    const updatedMessages = [...messages, userMessage];

    // Send the message via WebSocket
    socketRef.current?.send(JSON.stringify(userMessage));
    
    setMessages(updatedMessages);
    setNewMessage('');

    try {
      let response;
      const templateId = template?.id ?? '';
      // ✅ Sending only role and content to the backend
      const sanitizedMessages = updatedMessages.map(({ role, content }) => ({ role, content }));

      switch (selectedModel) {
        case 'multi-agent':
          response = await createMultiAgentMessage({
            courseId,
            templateId,
            roomId,
            userId,
            conversation: sanitizedMessages,
          });
          break;
        case 'rag':
          response = await createRAGMessage({
            courseId,
            templateId,
            roomId,
            userId,
            conversation: sanitizedMessages,
          });
          break;
        case 'rag+multi-agent':
          response = await createCombinedMessage({
            courseId,
            templateId,
            roomId,
            userId,
            conversation: sanitizedMessages,
          });
          break;
        case 'gemini':
          response = await createGeminiMessage({
            courseId,
            templateId,
            roomId,
            userId,
            conversation: sanitizedMessages,
          });
          break;
        case 'llama3':
          response = await createLlama3Message({
            courseId,
            templateId,
            roomId,
            userId,
            conversation: sanitizedMessages,
          });
          break;
        default:
          response = await createDirectMessage({
            courseId,
            templateId,
            roomId,
            userId,
            conversation: sanitizedMessages,
          });
      }

      console.log('API Response:', response);

      const formattedMessages = response.responses.map((msg: Message) => ({
        role: msg.role,
        sender: msg.role === 'user' ? userId ?? 'unknown-user' : 'assistant',
        content: msg.content,
        modelUsed: msg.modelUsed || selectedModel,
      }));

       // ✅ Send the new AI response to WebSocket
       const lastMessage = formattedMessages.at(-1); // `at(-1)` gets the last element safely
      
       if (lastMessage) {
        // ✅ Append only the last AI response to the existing state
        setMessages((prevMessages) => [...prevMessages, lastMessage]);
      
        // ✅ Send the new AI response to WebSocket
        if (socketRef.current) {
          socketRef.current.send(JSON.stringify(lastMessage));
        }
      }

    } catch (error) {
        console.log('Caught error in handleSendMessage:', error);
      logger(error, 'Error sending message');
      const errorMessage = {
        role: 'assistant' as const,
        sender: 'assistant',
        content: 'An error occurred. Please try again.',
        modelUsed: selectedModel,
      };
    
      setMessages((prev) => [...prev, errorMessage]);
    
      // ✅ Also send error message to WebSocket
      if (socketRef.current) {
        socketRef.current.send(JSON.stringify(errorMessage));
      }
    } finally {
      setLoadingMessage(false);
    }
};


  return (
    <div className="flex flex-col h-screen p-4">
      {/* Room Title */}
      <h1 className="text-2xl font-semibold text-blue-600">{room?.name} - Chat</h1>

      {/* Model Selection */}
      <div className="mb-4">
        <label className="block font-bold">Select AI Model:</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="chatgpt-direct">ChatGPT Direct</option>
          <option value="multi-agent">Multi-Agent</option>
          <option value="rag">Retrieval Augmented Generation</option>
          <option value="rag+multi-agent">RAG + Multi-Agent</option>
          <option value="gemini">Gemini</option>
          <option value="llama3">Llama 3.1</option>
        </select>
      </div>

      {/* Chat Messages */}
    <div className="flex-1 mt-4 p-4 border rounded bg-gray-100 overflow-y-auto">
    {messages.map((msg, index) => (
        <div
        key={index}
        className={`mb-2 flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
        >
        <div
            className={`p-2 rounded-lg max-w-xs ${
            msg.sender === userId ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
            }`}
        >
            <span className="block text-xs font-bold">
            {/* ✅ Display model name if available, otherwise "assistant" */}
            {msg.sender === userId 
                ? 'You' 
                : msg.sender === 'assistant' 
                ? msg.modelUsed || 'assistant' 
                : users[msg.sender]?.name || 'Unknown User'}
            </span>
            <span>{msg.content}</span>
        </div>
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
          disabled={loadingMessage}
        />
        <TextButton
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          onClick={handleSendMessage}
          disabled={loadingMessage}
        >
          {loadingMessage ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            'Send'
          )}
        </TextButton>
      </div>
    </div>
  );
};

export default RoomChatPage;