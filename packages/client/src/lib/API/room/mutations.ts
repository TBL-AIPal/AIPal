import api from '@/lib/API/auth/interceptor';
import logger from '@/lib/utils/logger';

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
    logger(err, `Error creating room in course ${courseId}`);
    throw new Error('Unable to create room. Please try again.');
  }
};
