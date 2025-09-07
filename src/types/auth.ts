export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'student';
  department?: string;
  phone?: string;
  address?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Dummy credentials for testing
export const DUMMY_USERS: Record<string, { user: User; password: string }> = {
  'admin@portal.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@portal.com',
      role: 'admin',
      department: 'IT',
      phone: '+1234567890',
      address: '123 Admin St'
    }
  },
  'supervisor@portal.com': {
    password: 'super123',
    user: {
      id: '2',
      name: 'John Supervisor',
      email: 'supervisor@portal.com',
      role: 'supervisor',
      department: 'Engineering',
      phone: '+1234567891',
      address: '456 Supervisor Ave'
    }
  },
  'student@portal.com': {
    password: 'student123',
    user: {
      id: '3',
      name: 'Jane Student',
      email: 'student@portal.com',
      role: 'student',
      department: 'Computer Science',
      phone: '+1234567892',
      address: '789 Student Blvd'
    }
  }
};