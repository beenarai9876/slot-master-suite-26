export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'student';
  department: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface Supervisor extends User {
  role: 'supervisor';
  creditAmount: number;
  students: Student[];
}

export interface Student extends User {
  role: 'student';
  supervisorId: string;
  creditUsed: number;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  studentId: string;
  studentName: string;
  supervisorId: string;
  supervisorName: string;
  slotId: string;
  slotName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  cost: number;
  createdAt: string;
  bookedAt?: string;
  rejectionReason?: string;
}

export interface Report {
  id: string;
  type: 'booking' | 'financial';
  equipment?: string;
  department?: string;
  supervisor?: string;
  dateRange: {
    start: string;
    end: string;
  };
  data: any[];
}

export interface Instruction {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  targetRole: 'all' | 'supervisor' | 'student';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'booking_request' | 'booking_approved' | 'booking_rejected' | 'credit_allocated' | 'general';
  title: string;
  message: string;
  recipientId: string;
  senderId: string;
  read: boolean;
  createdAt: string;
}