export interface User {
    id: string; // Converted from MongoDB ObjectId
    role: 'admin' | 'teacher' | 'student'; // User role types
    status: 'pending' | 'approved' | 'rejected'; // New status field
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
    status?: 'pending' | 'approved' | 'rejected'; // Include status for forms
    isEmailVerified?: boolean;
    courses?: string[];
    name?: string;
    email?: string;
    password?: string;
  }
  
  export interface UserCreateInput {
    role: 'admin' | 'teacher' | 'student';
    status?: 'pending' | 'approved' | 'rejected'; // Include status in user creation
    isEmailVerified?: boolean;
    courses?: string[];
    name: string;
    email: string;
    password: string;
  }
  
  export interface UserUpdateInput {
    role?: 'admin' | 'teacher' | 'student';
    status?: 'pending' | 'approved' | 'rejected'; // Allow status updates
    isEmailVerified?: boolean;
    courses?: string[];
    name?: string;
    email?: string;
    password?: string;
  }
  