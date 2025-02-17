'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { GetRoomById } from '@/lib/API/room/queries';
import { GetTemplateById } from '@/lib/API/template/queries';
import { GetDocumentsByCourseId } from '@/lib/API/document/queries';
import { GetMessagesByRoomId } from '@/lib/API/room/queries';
import { createDirectMessage, createMultiAgentMessage, createRAGMessage, createCombinedMessage, createGeminiMessage, createLlama3Message } from '@/lib/API/message/mutations';

import { Room } from '@/lib/types/room';
import { Template } from '@/lib/types/template';
import { Document } from '@/lib/types/document';
import logger from '@/lib/utils/logger';

import TextButton from '@/components/buttons/TextButton';

const RoomChatPage: React.FC = () => {
  const { courseId, roomId } = useParams<{ courseId: string; roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
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

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserId(user?.id || null);
    }
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

    const fetchDocuments = async () => {
      if (!courseId) return;
      try {
        const response = await GetDocumentsByCourseId(courseId);
        setDocuments(response);
      } catch (err) {
        logger(err, 'Error fetching documents');
      }
    };

    fetchRoom();
    fetchDocuments();
  }, [courseId, roomId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const chatMessages = await GetMessagesByRoomId(courseId, roomId);
        setMessages(chatMessages);
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

    const userMessage = { role: 'user' as const, sender: userId, content: newMessage };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');

    try {
      let response;
      const constraints = template?.constraints || [];
      const templateId = template?.id ?? '';

      switch (selectedModel) {
        case 'multi-agent':
          response = await createMultiAgentMessage({ courseId, templateId: templateId, conversation: updatedMessages, constraints });
          break;
        case 'rag':
          response = await createRAGMessage({ courseId, templateId: templateId, conversation: updatedMessages });
          break;
        case 'rag+multi-agent':
          response = await createCombinedMessage({ courseId, templateId: templateId, conversation: updatedMessages, constraints });
          break;
        case 'gemini':
          response = await createGeminiMessage({ courseId, templateId: templateId, conversation: updatedMessages });
          break;
        case 'llama3':
          response = await createLlama3Message({ courseId, templateId: templateId, conversation: updatedMessages });
          break;
        default:
          response = await createDirectMessage({ courseId, templateId: templateId, conversation: updatedMessages });
      }

    //   const response = await axios.post(endpoint, {
    //     conversation: updatedMessages,
    //     roomId,
    //     userId,
    //     documents: documents,
    //     constraints: constraints,
    //   });

      setMessages(response.data.responses);
    } catch (error) {
      logger(error, 'Error sending message');
      setMessages((prev) => [...prev, { role: 'assistant' as const, sender: 'assistant', content: 'An error occurred. Please try again.' }]);
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
                : msg.sender}
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