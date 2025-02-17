export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true';

export const proxyUrl = process.env.NEXT_PUBLIC_API_URL || '';

export const serverUrl = process.env.SERVER_API_URL || '';

// TODO: Remove hardcoded token once Authentication is properly implemented
// curl -X POST "http://localhost:5000/v1/auth/login" -H "Content-Type: application/json" -d "{\"email\": \"kariane50@gmail.com\", \"password\": \"password1\"}"
export const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzEwOGNhNTM3Yjc5ZWM2YTE3YjJkZGEiLCJpYXQiOjE3MzAzOTAzNjMsImV4cCI6MTczMDM5MjE2MywidHlwZSI6ImFjY2VzcyJ9.AilyQe1qtqQrEQV1fDuwjFOsGp5DqH87jFGzYJ5_tUk';
