import axios, { AxiosError } from 'axios';
import { cache } from 'react';

import { Room } from '@/lib/types/room';

import { proxyUrl } from '@/constant/env';

// Function to get rooms by templateId
export const GetRoomsByTemplateId = cache(
  async (courseId: string, templateId: string): Promise<Room[]> => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const rooms = await axios.get(
        `${proxyUrl}/courses/${courseId}/templates/${templateId}/rooms`, // Updated API endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return rooms.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);

export const GetRoomsByTemplateIds = cache(
  async (courseId: string, templateIds: string[]): Promise<Room[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(`${proxyUrl}/courses/${courseId}/rooms`, {
        params: { templateIds: templateIds.join(',') }, // Convert array to comma-separated string
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; // Assuming response contains an array of rooms
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);


export const GetRoomById = cache(
  async (courseId: string, roomId: string): Promise<Room> => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.get(`${proxyUrl}/courses/${courseId}/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);