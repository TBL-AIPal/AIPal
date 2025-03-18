import api from '@/lib/API/auth/interceptor';

interface CreateRoomProps {
  courseId: string;
  name: string;
  description: string;
  code: string;
  template: string;
}

export const CreateRoom = async ({ courseId, name, description, code, template }: CreateRoomProps) => {
  try {
    await api.post(`/courses/${courseId}/rooms`, {
      name,
      description,
      code,
      template,
    });
  } catch (err) {
    console.error(`Error creating room in course ${courseId}:`, err);
    throw err;
  }
};

interface UpdateRoomProps {
  roomId: string;
  courseId: string;
  name?: string;
  description?: string;
  code?: string;
  template?: string;
  allowedUsers?: string[]; // ✅ Allow updating allowed users
}

export const UpdateRoom = async ({ roomId, courseId, name, description, code, template, allowedUsers }: UpdateRoomProps) => {
  try {
    await api.patch(`/courses/${courseId}/rooms/${roomId}`, {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(code !== undefined ? { code } : {}),
      ...(template !== undefined ? { template } : {}),
      ...(allowedUsers !== undefined ? { allowedUsers } : {}),
    });
  } catch (err) {
    console.error(`Error updating room ${roomId} in course ${courseId}:`, err);
    throw err;
  }
};
