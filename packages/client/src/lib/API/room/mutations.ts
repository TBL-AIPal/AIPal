import axios from 'axios';

import { jwtToken, proxyUrl } from '@/constant/env';

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
    await axios.post(`${proxyUrl}/courses/${courseId}/rooms`, data, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
