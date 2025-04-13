export class ApiError extends Error {
    status: number;
    data: any;
  
    constructor(message: string, status: number, data?: any) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
}

export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError;
}