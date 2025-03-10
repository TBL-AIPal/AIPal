export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const proxyUrl = process.env.NEXT_PUBLIC_API_URL || '';

export const serverUrl = process.env.SERVER_API_URL || '';
