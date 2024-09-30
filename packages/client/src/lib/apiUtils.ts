/* eslint-disable no-console */
import logger from '@/lib/logger';

import { apiUrl } from '@/constant/env';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T | undefined> {
  const url = `${apiUrl}${endpoint}`;

  // Only set 'Content-Type' if the body is not FormData
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...options.headers,
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      (errorData as { message?: string }).message ||
      'An error occurred while fetching data';
    logger(errorData, errorMessage);
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined;
  }

  // Explicitly returning as Promise<T> to maintain type safety
  return response.json() as Promise<T>;
}

export async function get<T>(
  endpoint: string,
  token?: string
): Promise<T | undefined> {
  return request<T>(endpoint, { method: 'GET', token });
}

export async function post<T, U>(
  endpoint: string,
  data: U,
  token?: string
): Promise<T | undefined> {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function postWithFile<T>(
  endpoint: string,
  data: FormData,
  token?: string
): Promise<T | undefined> {
  return request<T>(endpoint, {
    method: 'POST',
    body: data,
    token,
  });
}

export async function put<T, U>(
  endpoint: string,
  data: U,
  token?: string
): Promise<T | undefined> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });
}

export async function del<T>(
  endpoint: string,
  token?: string
): Promise<T | undefined> {
  return request<T>(endpoint, { method: 'DELETE', token });
}
