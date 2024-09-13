/* eslint-disable no-console */
import { apiUrl } from '@/constant/env';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RequestOptions extends RequestInit {
  // Additional options can be added here
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${apiUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Extract error message from the response if available
    const errorData = await response.json();
    const errorMessage =
      (errorData as { message?: string }).message ||
      'An error occurred while fetching data';
    throw new Error(errorMessage);
  }

  return response.json() as T;
}

export async function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

export async function post<T, U>(endpoint: string, data: U): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function put<T, U>(endpoint: string, data: U): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function del<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' });
}
