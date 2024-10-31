export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const proxyUrl = process.env.NEXT_PUBLIC_API_URL || '';

export const serverUrl = process.env.SERVER_API_URL || '';

// TODO: Remove hardcoded token once Authentication is properly implemented
// curl -X POST "http://localhost:5000/v1/auth/login" -H "Content-Type: application/json" -d "{\"email\": \"kariane50@gmail.com\", \"password\": \"password1\"}"
export const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzEwOGNhNTM3Yjc5ZWM2YTE3YjJkZGEiLCJpYXQiOjE3MzAzNjYxODQsImV4cCI6MTczMDM2Nzk4NCwidHlwZSI6ImFjY2VzcyJ9.Kn4BhIR_x3Ulqyhk9-U8q54KAYP-sxQJDI64ZmXgS5w';
