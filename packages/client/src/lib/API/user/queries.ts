import { cache } from 'react';

interface User {
  id: string;
}

// TODO: Connect to Auth API
export const GetUser = cache(async (): Promise<User> => {
  const placeholder: User = {
    id: '66f7eb4b31e23a3668e5b2ad',
  };
  return placeholder;
});
