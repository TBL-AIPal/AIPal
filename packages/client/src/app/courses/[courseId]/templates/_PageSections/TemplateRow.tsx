import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { GetDocumentById } from '@/lib/API/document/queries';
import { CreateRoom } from '@/lib/API/room/mutations';
import { GetRoomsByTemplateId } from '@/lib/API/room/queries';
import { Document } from '@/lib/types/document';
import { Room } from '@/lib/types/room';
import { Template, TemplateUpdateInput } from '@/lib/types/template';

import { Modal } from '@/components/ui/Modal';

import DocumentSelectionForm from './DocumentSelectionForm';
import RoomCreateForm from './RoomCreateForm';

interface TemplateRowProps {
  template: Template;
  courseDocuments: Document[];
  onDelete: () => void;
  onUpdate: (updatedData: TemplateUpdateInput) => void;
}

const TemplateRow: React.FC<TemplateRowProps> = ({
  template,
  courseDocuments,
  onDelete,
  onUpdate,
}) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(template.name);
  const [editConstraints, setEditConstraints] = useState(
    template.constraints.join(', ')
  );
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(
    template.documents
  );
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filenames, setFilenames] = useState<string[]>([]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setIsEditing(false);
  };

  const toggleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing((prev) => !prev);
  };

  const handleUpdate = () => {
    const updatedConstraints = editConstraints
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c !== '');
    const updatedData: TemplateUpdateInput = {
      name: editName !== template.name ? editName : undefined,
      constraints:
        JSON.stringify(updatedConstraints) !==
        JSON.stringify(template.constraints)
          ? updatedConstraints
          : undefined,
      documents:
        JSON.stringify(selectedDocuments) !== JSON.stringify(template.documents)
          ? selectedDocuments
          : undefined,
    };
    onUpdate(updatedData);
    setIsEditing(false);
  };

  const handleCreateRoom = async (roomData: {
    roomName: string;
    description: string;
  }) => {
    const autoGeneratedCode = Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase();
    try {
      await CreateRoom({
        courseId,
        name: roomData.roomName,
        description: roomData.description,
        code: autoGeneratedCode,
        template: template.id,
      });
      fetchRooms();
    } finally {
      setIsRoomModalOpen(false);
    }
  };

  const fetchRooms = useCallback(async () => {
    if (!template.id) return;
    try {
      const rooms = await GetRoomsByTemplateId(courseId, template.id);
      setRooms(rooms || []);
    } catch {
      // Handle errors here if necessary
    }
  }, [courseId, template.id]);

  const fetchFilenames = useCallback(async () => {
    if (!template.id) return;
    try {
      const filenames = await Promise.all(
        template.documents.map(async (docId) => {
          const document = await GetDocumentById(courseId, docId);
          return document.filename; // Extract the filename
        })
      );
      setFilenames(filenames);
    } catch (error) {
      // Handle errors here if necessary
    }
  }, [template.documents, courseId, template.id]);

  useEffect(() => {
    if (isExpanded) {
      fetchRooms();
      fetchFilenames();
    }
  }, [
    isExpanded,
    courseId,
    template.id,
    template.documents,
    fetchRooms,
    fetchFilenames,
  ]);

  return (
    <>
      <tr
        onClick={toggleExpand}
        className={`cursor-pointer transition-colors duration-300 ${
          isExpanded ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        <td className='border-b py-2 px-4'>
          {isEditing ? (
            <input
              type='text'
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className='border p-1'
            />
          ) : (
            template.name
          )}
        </td>
        <td className='border-b py-2 px-4 flex space-x-2'>
          {isEditing ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate();
              }}
              className='bg-blue-600 text-white px-2 py-1 rounded'
            >
              Save
            </button>
          ) : (
            <button
              onClick={toggleEdit}
              className='text-blue-600 px-2 py-1 rounded'
            >
              Edit
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className='text-red-600 px-2 py-1 rounded'
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRoomModalOpen(true);
            }}
            className='bg-green-600 text-white px-2 py-1 rounded'
          >
            Create Room
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={2} className='border-b py-2 px-4'>
            {isEditing ? (
              <div className='mb-2'>
                <label className='font-semibold mt-2 block'>Constraints:</label>
                <textarea
                  value={editConstraints}
                  onChange={(e) => setEditConstraints(e.target.value)}
                  className='border p-1 w-full'
                />
                {/* Document Selection Form */}
                <label className='font-semibold mt-2 block'>Documents:</label>
                <DocumentSelectionForm
                  documents={courseDocuments}
                  onSelectionChange={(selectedIds) =>
                    setSelectedDocuments(selectedIds)
                  } // Update selected documents
                />
              </div>
            ) : (
              <>
                {/* Display the constraints when expanded */}
                <div className='mt-4'>
                  {/* Header for Constraints */}
                  <h3 className='font-semibold'>Constraints</h3>
                  {template.constraints.length === 0 ? (
                    <p>No constraints available for this template.</p>
                  ) : (
                    <ul className='list-disc pl-5'>
                      {template.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Display the rooms when expanded */}
                <div className='mt-4'>
                  <h3 className='font-semibold'>Rooms</h3>
                  {rooms.length === 0 ? (
                    <p>No rooms available for this template.</p>
                  ) : (
                    <ul className='list-disc pl-5'>
                      {rooms.map((room) => (
                        <RoomItem key={room.id} room={room}/>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Display the documents when expanded */}
                <div className='mt-4'>
                  {/* Header for Documents */}
                  <h3 className='font-semibold'>Documents</h3>
                  {template.documents.length === 0 ? (
                    <p>No documents available for this template.</p>
                  ) : (
                    <ul className='list-disc pl-5'>
                      {filenames.map((filename, index) => (
                        <li key={index}>{filename}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </td>
        </tr>
      )}
      {/* Room creation modal */}
      {isRoomModalOpen && (
        <Modal
          title='Create New Room'
          onClose={() => setIsRoomModalOpen(false)}
        >
          <RoomCreateForm onCreateRoom={handleCreateRoom} />
        </Modal>
      )}
    </>
  );
};

// Separate RoomItem component to fix useState issue
const RoomItem: React.FC<{ room: Room }> = ({ room }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
  };

  return (
    <li key={room.id} className='text-blue-600'>
      <span className='font-semibold'>{room.name}</span> - {room.description}
      <br />
      <div className='flex items-center space-x-2'>
        <span className='text-sm text-gray-600'>Room Code: <strong>{room.code}</strong></span>

        {/* Copy Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(room.code);
          }}
          className='ml-2 p-1 rounded bg-gray-200 hover:bg-gray-300 transition'
        >
          📋
        </button>

        {/* Show "Copied" confirmation message */}
        {copied && <span className='text-green-600 text-xs'>Copied!</span>}
      </div>
    </li>
  );
};

export default TemplateRow;
