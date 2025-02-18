import api from '@/lib/API/auth/interceptor';
import { cache } from 'react';

import { Room } from '@/lib/types/room';
import { ChatMessage } from '@/lib/types/chat';

// Function to get rooms by templateId
export const GetRoomsByTemplateId = cache(async (courseId: string, templateId: string): Promise<Room[]> => {
  try {
    const response = await api.get(`/courses/${courseId}/templates/${templateId}/rooms`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching rooms for template ${templateId} in course ${courseId}:`, err);
    throw err;
  }
});

export const GetRoomsByTemplateIds = cache(async (courseId: string, templateIds: string[]): Promise<Room[]> => {
  try {
    const response = await api.get(`/courses/${courseId}/rooms`, {
      params: { templateIds: templateIds.join(',') }, // Convert array to comma-separated string
    });
    return response.data; // Assuming response contains an array of rooms
  } catch (err) {
    console.error(`Error fetching rooms for multiple templates in course ${courseId}:`, err);
    throw err;
  }
});

export const GetRoomById = cache(async (courseId: string, roomId: string): Promise<Room> => {
  try {
    const response = await api.get(`/courses/${courseId}/rooms/${roomId}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching room ${roomId} in course ${courseId}:`, err);
    throw err;
  }
});

export const GetMessagesByRoomId = cache(async (courseId: string, roomId: string): Promise<ChatMessage[]> => {
  try {
    const response = await api.get(`/courses/${courseId}/rooms/${roomId}/messages`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching messages for room ${roomId} in course ${courseId}:`, err);
    throw err;
  }
});