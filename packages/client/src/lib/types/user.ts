export interface User {
    id: string; // Converted from MongoDB ObjectId
    role: 'admin' | 'teacher' | 'student'; // Assuming role types
    isEmailVerified: boolean;
    courses: string[]; // List of course IDs the user is enrolled in
    name: string;
    email: string;
    password: string; // Hashed password
    createdAt: string; // ISO 8601 format
    updatedAt: string; // ISO 8601 format
  }
  
  export interface UserFormValues {
    role?: 'admin' | 'teacher' | 'student';
    isEmailVerified?: boolean;
    courses?: string[];
    name?: string;
    email?: string;
    password?: string;
  }
  
  export interface UserCreateInput {
    role: 'admin' | 'teacher' | 'student';
    isEmailVerified?: boolean;
    courses?: string[];
    name: string;
    email: string;
    password: string;
  }
  
  export interface UserUpdateInput {
    role?: 'admin' | 'teacher' | 'student';
    isEmailVerified?: boolean;
    courses?: string[];
    name?: string;
    email?: string;
    password?: string;
  }
  