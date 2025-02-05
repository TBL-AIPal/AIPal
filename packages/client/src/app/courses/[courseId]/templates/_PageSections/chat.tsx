import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GetDocumentsByCourseId } from '@/lib/API/document/queries';
import { Document } from '@/lib/types/document';

interface ChatRoomPageProps {
  roomName: string;
  roomDescription: string;
  courseId: string;
  constraints: string[];
}

const ChatRoomPage: React.FC<ChatRoomPageProps> = ({
  roomName,
  roomDescription,
  courseId,
  constraints,
}) => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('chatgpt-direct');

  useEffect(() => {
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
      const endpointMap: Record<string, string> = {
        'chatgpt-direct': 'http://localhost:5000/api/chatgpt-direct',
        'multi-agent': 'http://localhost:5000/api/multi-agent',
        rag: 'http://localhost:5000/api/rag',
        'rag+multi-agent': 'http://localhost:5000/api/rag+multi-agent',
        gemini: 'http://localhost:5000/api/gemini',
        llama3: 'http://localhost:5000/api/llama3',
      };

      const endpoint =
        endpointMap[selectedModel] || endpointMap['chatgpt-direct'];
      const res = await axios.post(endpoint, {
        conversation: updatedConversation,
        documents: documents,
        constraints: constraints,
      });
      setConversation(res.data.responses);
    } catch {
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', content: 'An error occurred. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-bold'>{roomName}</h2>
      <p className='text-gray-600 mb-4'>{roomDescription}</p>

      {/* Model Selection Dropdown */}
      <div className='mb-4'>
        <label className='block text-white font-bold mb-2'>
          Select AI Model:
        </label>
        <select
          className='w-full p-2 border rounded'
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value='chatgpt-direct'>ChatGPT Direct</option>
          <option value='multi-agent'>Multi-Agent</option>
          <option value='rag'>Retrieval Augmented Generation</option>
          <option value='rag+multi-agent'>RAG + Multi-Agent</option>
          <option value='gemini'>Gemini</option>
          <option value='llama3'>Llama 3.1</option>
        </select>
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
