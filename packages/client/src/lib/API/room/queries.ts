import api from '@/lib/API/auth/interceptor';
import { ChatMessage } from '@/lib/types/chat';
import { Room } from '@/lib/types/room';
import logger from '@/lib/utils/logger';

// Function to get rooms by templateId
export const GetRoomsByTemplateId = async (
  courseId: string,
  templateId: string,
): Promise<Room[]> => {
  try {
    const response = await api.get(
      `/courses/${courseId}/templates/${templateId}/rooms`,
    );
    return response.data;
  } catch (err) {
    logger(err, `Error fetching rooms for template ${templateId} in course ${courseId}`);
    throw err;
  }
};

export const GetRoomsByTemplateIds = async (
  courseId: string,
  templateIds: string[],
): Promise<Room[]> => {
  try {
    const response = await api.get(`/courses/${courseId}/rooms`, {
      params: { templateIds: templateIds.join(',') }, // Convert array to comma-separated string
    });
    return response.data; // Assuming response contains an array of rooms
  } catch (err) {
    logger(err, `Error fetching rooms for multiple templates in course ${courseId}`);
    throw err;
  }
};

export const GetRoomById = async (
  courseId: string,
  roomId: string,
): Promise<Room> => {
  try {
    const response = await api.get(`/courses/${courseId}/rooms/${roomId}`);
    return response.data;
  } catch (err) {
    logger(err, `Error fetching room ${roomId} in course ${courseId}`);
    throw err;
  }
};

export const GetMessagesByRoomId = async (
  courseId: string,
  roomId: string,
): Promise<ChatMessage[]> => {
  try {
    const response = await api.get(
      `/courses/${courseId}/rooms/${roomId}/messages`,
    );
    return response.data;
  } catch (err) {
    logger(err, `Error fetching messages for room ${roomId} in course ${courseId}`);
    throw err;
  }
};
