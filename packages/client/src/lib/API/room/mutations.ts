import axios from 'axios';

import { proxyUrl } from '@/constant/env';

interface CreateRoomProps {
  courseId: string; // Add courseId to the parameters
  name: string;
  description: string;
  code: string;
  template: string;
}

export const CreateRoom = async ({
  courseId,
  name,
  description,
  code,
  template,
}: CreateRoomProps) => {
  const data = {
    name,
    description,
    code,
    template,
  };

  try {
    const token = localStorage.getItem('authToken'); // Retrieve token dynamically
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    await axios.post(`${proxyUrl}/courses/${courseId}/rooms`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
