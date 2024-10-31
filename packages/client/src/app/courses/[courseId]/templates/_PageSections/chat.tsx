import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { GetDocumentsByCourseId } from '@/lib/API/document/queries';
import { Document } from '@/lib/types/document';

interface ChatRoomPageProps {
  roomName: string;
  roomDescription: string;
  courseId: string;
  templateId: string;
  constraints: string[];
}

const ChatRoomPage: React.FC<ChatRoomPageProps> = ({
  roomName,
  roomDescription,
  courseId,
  // templateId,
  constraints,
}) => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [multiAgent, setMultiAgent] = useState(false); // State for multi-agent toggle
  const [retrievalAugmentedGeneration, setRetrievalAugmentedGeneration] =
    useState(false); // State for RAG toggle

  useEffect(() => {
    // Fetch documents when component mounts
    const fetchDocuments = async () => {
      const response = await GetDocumentsByCourseId(courseId);
      setDocuments(response);
    };

    fetchDocuments();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);

    const userMessage = { role: 'user', content: prompt };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setPrompt('');

    try {
      const endpoint =
        multiAgent && retrievalAugmentedGeneration
          ? 'http://localhost:5000/api/rag+multi-agent'
          : multiAgent
          ? 'http://localhost:5000/api/multi-agent'
          : retrievalAugmentedGeneration
          ? 'http://localhost:5000/api/rag'
          : 'http://localhost:5000/api/chatgpt-direct'; // Change endpoint based on toggle
      const res = await axios.post(endpoint, {
        conversation: updatedConversation,
        documents: documents,
        constraints: constraints,
      });
      setConversation(res.data.responses);
    } catch {
      const errorMessage = {
        role: 'assistant',
        content: 'An error occurred. Please try again.',
      };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-bold'>{roomName}</h2>
      <p className='text-gray-600 mb-4'>{roomDescription}</p>

      {/* Toggle switch for multi-agent architecture */}
      <div className='mb-4 flex items-center'>
        <span className='text-white mr-3'>Multi-Agent Architecture</span>
        <label className='relative inline-flex items-center cursor-pointer'>
          <input
            type='checkbox'
            className='hidden'
            checked={multiAgent}
            onChange={() => setMultiAgent(!multiAgent)} // Toggle the state
          />
          <div
            className={`w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
              multiAgent ? 'bg-green-600' : 'bg-gray-300'
            }`}
          ></div>
          <span
            className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
              multiAgent ? 'transform translate-x-6' : ''
            }`}
          ></span>
        </label>
      </div>

      {/* Toggle switch for RAG */}
      <div className='mb-4 flex items-center'>
        <span className='text-white mr-3'>Retrieval Augmented Generation</span>
        <label className='relative inline-flex items-center cursor-pointer'>
          <input
            type='checkbox'
            className='hidden'
            checked={retrievalAugmentedGeneration}
            onChange={() =>
              setRetrievalAugmentedGeneration(!retrievalAugmentedGeneration)
            } // Toggle the state
          />
          <div
            className={`w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
              retrievalAugmentedGeneration ? 'bg-green-600' : 'bg-gray-300'
            }`}
          ></div>
          <span
            className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
              retrievalAugmentedGeneration ? 'transform translate-x-6' : ''
            }`}
          ></span>
        </label>
      </div>

      {/* Display documents list */}
      <div className='mb-4'>
        <h3 className='font-semibold'>Documents</h3>
        {documents.length === 0 ? (
          <p>No documents available.</p>
        ) : (
          <ul className='list-disc pl-5'>
            {documents.map((doc) => (
              <li key={doc.id}>
                {doc.filename} - {doc.contentType} - {doc.size} bytes
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat display */}
      <div className='bg-gray-100 p-4 rounded max-h-96 overflow-y-auto'>
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`my-2 ${
              msg.role === 'user' ? 'text-blue-700' : 'text-gray-700'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : msg.role}:</strong>{' '}
            {msg.content}
          </div>
        ))}
      </div>

      {/* Prompt input */}
      <form onSubmit={handleSubmit} className='mt-4 w-full'>
        <textarea
          className='w-full rounded border p-2 text-gray-700'
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Ask a question or enter a prompt...'
        />
        <button
          type='submit'
          className='mt-4 w-full rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600'
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatRoomPage;
