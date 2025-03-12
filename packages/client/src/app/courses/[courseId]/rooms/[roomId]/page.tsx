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
import { GetTemplateById } from '@/lib/API/template/queries';
import { Message } from '@/lib/types/message';
import { Room } from '@/lib/types/room';
import { Template } from '@/lib/types/template';
import logger from '@/lib/utils/logger';

import { createErrorToast } from '@/lib/utils/toast';
import MarkdownRenderer from './_PageSections/MarkdownRenderer';

const RoomChatPage: React.FC = () => {
  const { courseId, roomId } = useParams<{
    courseId: string;
    roomId: string;
  }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [messages, setMessages] = useState<
    {
      role: 'user' | 'assistant' | 'system';
      sender: string;
      content: string;
      modelUsed?: string;
    }[]
  >([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [selectedModel, setSelectedModel] = useState('chatgpt');
  const [selectedMethod, setSelectedMethod] = useState('direct');
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
          const fetchedTemplate = await GetTemplateById(
            courseId,
            fetchedRoom.template,
          );
          setTemplate(fetchedTemplate);
        }
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoadingMessage(true);

    if (!userId) {
      logger('User ID not found', 'Error sending message');
      createErrorToast('Unable to send message since user ID is not found.');
      setLoadingMessage(false);
      return;
    }

    const userMessage = { role: 'user' as const, content: newMessage };
    const updatedMessages = [
      ...messages,
      { ...userMessage, sender: userId, modelUsed: selectedModel },
    ];
    setMessages(updatedMessages);
    setNewMessage('');

    try {
      let response;
      const templateId = template?.id ?? '';
      const sanitizedMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content,
      }));

      switch (selectedMethod) {
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
        case 'combined':
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
    } catch (error) {
      logger(error, 'Caught error in handleSendMessage');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          sender: 'assistant',
          content: 'An error occurred. Please try again.',
          modelUsed: selectedModel,
        },
      ]);
    } finally {
      setLoadingMessage(false);
    }
  };

  return (
    <div>
      {/* Floating Settings Bar (Sticky Top) */}
      <div className='sticky top-0 z-10 p-4 bg-white border-b flex gap-4 shadow-sm'>
        {/* AI Model Selector */}
        <div className='flex-1'>
          {selectedMethod === 'direct' ? (
            <select
              className='w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700'
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value='chatgpt'>ChatGPT</option>
              <option value='gemini'>Gemini</option>
              <option value='llama3'>Llama 3.1</option>
            </select>
          ) : (
            <div className='w-full p-3 rounded-lg bg-gray-50 text-gray-600 text-sm'>
              Model selection disabled
            </div>
          )}
        </div>

        {/* Method Selector */}
        <div className='flex-1'>
          <select
            className='w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700'
            value={selectedMethod}
            onChange={(e) => {
              const newMethod = e.target.value;
              setSelectedMethod(newMethod);
              if (newMethod !== 'direct') setSelectedModel('chatgpt');
            }}
          >
            <option value='direct'>Direct</option>
            <option value='multi-agent'>Multi-Agent</option>
            <option value='rag'>RAG</option>
            <option value='combined'>Combined</option>
          </select>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-lg ${
                msg.sender === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {msg.sender === userId ? (
                <span>{msg.content}</span>
              ) : (
                <MarkdownRenderer content={msg.content} />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area */}
      <div className='sticky bottom-0 z-10 p-4 bg-white border-t flex gap-4 shadow-md'>
        <div className='flex items-center w-full gap-2'>
          {/* Multiline Textarea */}
          <textarea
            rows={1}
            className='flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-auto'
            placeholder='Type a message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && !e.shiftKey && handleSendMessage()
            }
            disabled={loadingMessage}
            style={{ maxHeight: '10rem' }} // 10rem max height
          />

          {/* Send Button */}
          <button
            className='p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-transform disabled:opacity-50'
            onClick={handleSendMessage}
            disabled={loadingMessage}
          >
            {loadingMessage ? (
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v8H4z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomChatPage;
