import axios, { AxiosError } from 'axios';
import { cache } from 'react';

import { Room } from '@/lib/types/room';

import { jwtToken, proxyUrl } from '@/constant/env';

// Function to get rooms by templateId
export const GetRoomsByTemplateId = cache(
  async (courseId: string, templateId: string): Promise<Room[]> => {
    try {
      const rooms = await axios.get(
        `${proxyUrl}/courses/${courseId}/templates/${templateId}/rooms`, // Updated API endpoint
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return rooms.data;
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }
  }
);
