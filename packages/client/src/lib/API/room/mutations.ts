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
