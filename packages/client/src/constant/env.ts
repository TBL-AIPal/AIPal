export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

// TODO: Remove hardcoded token once Authentication is properly implemented
// curl -X POST "http://localhost:5000/v1/auth/login" -H "Content-Type: application/json" -d "{\"email\": \"kariane50@gmail.com\", \"password\": \"password1\"}"
export const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmY3ZWI0YjMxZTIzYTM2NjhlNWIyYWQiLCJpYXQiOjE3Mjc2NzQ0ODAsImV4cCI6MTcyNzY3NjI4MCwidHlwZSI6ImFjY2VzcyJ9.2KBi6v7mZDvjy_Pmz9NbGPsnmgIMgDdLZzJMpUygSTs';
