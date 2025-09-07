import { Booking, Instruction, Notification } from '@/types';

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    equipmentId: '1',
    equipmentName: 'Microscope Pro X1',
    studentId: '3',
    studentName: 'Jane Student',
    supervisorId: '2',
    supervisorName: 'John Supervisor',
    slotId: 'morning-1',
    slotName: 'Early Morning (8-10 AM)',
    date: '2024-01-15',
    startTime: '08:00',
    endTime: '10:00',
    status: 'approved',
    cost: 50,
    createdAt: '2024-01-10T10:00:00Z',
    bookedAt: '2024-01-10 10:00'
  },
  {
    id: '2',
    equipmentId: '3',
    equipmentName: '3D Printer Delta',
    studentId: '3',
    studentName: 'Jane Student',
    supervisorId: '2',
    supervisorName: 'John Supervisor',
    slotId: 'evening-2',
    slotName: 'Evening (6-8 PM)',
    date: '2024-01-18',
    startTime: '18:00',
    endTime: '20:00',
    status: 'pending',
    cost: 75,
    createdAt: '2024-01-12T14:30:00Z',
    bookedAt: '2024-01-12 14:30'
  },
  {
    id: '3',
    equipmentId: '4',
    equipmentName: 'Oscilloscope OS500',
    studentId: '4',
    studentName: 'Mike Anderson',
    supervisorId: '2',
    supervisorName: 'John Supervisor',
    slotId: 'day-3',
    slotName: 'Day (12-3 PM)',
    date: '2024-01-20',
    startTime: '12:00',
    endTime: '15:00',
    status: 'completed',
    cost: 40,
    createdAt: '2024-01-08T09:15:00Z',
    bookedAt: '2024-01-08 09:15'
  },
  {
    id: '4',
    equipmentId: '1',
    equipmentName: 'Microscope Pro X1',
    studentId: '4',
    studentName: 'Mike Anderson',
    supervisorId: '2',
    supervisorName: 'John Supervisor',
    slotId: 'afternoon-1',
    slotName: 'Afternoon (12-2 PM)',
    date: '2024-01-25',
    startTime: '12:00',
    endTime: '14:00',
    status: 'rejected',
    cost: 50,
    createdAt: '2024-01-20T15:30:00Z',
    bookedAt: '2024-01-20 15:30',
    rejectionReason: 'Equipment maintenance scheduled during requested time'
  }
];

export const MOCK_INSTRUCTIONS: Instruction[] = [
  {
    id: '1',
    title: 'Equipment Safety Guidelines',
    content: `<h2>General Safety Rules</h2>
    <ul>
      <li>Always read equipment manuals before use</li>
      <li>Wear appropriate safety gear (goggles, gloves, lab coats)</li>
      <li>Report any damaged equipment immediately</li>
      <li>Do not operate equipment without proper training</li>
    </ul>
    
    <h3>Emergency Procedures</h3>
    <p>In case of emergency, immediately:</p>
    <ol>
      <li>Turn off the equipment</li>
      <li>Alert the supervisor</li>
      <li>Call campus security: ext. 911</li>
    </ol>`,
    authorId: '1',
    authorName: 'Admin User',
    targetRole: 'all',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T10:30:00Z'
  },
  {
    id: '2',
    title: 'Booking Process for Students',
    content: `<h2>How to Request Equipment Booking</h2>
    <p>Follow these steps to request equipment booking:</p>
    
    <ol>
      <li>Browse the Equipment Catalog</li>
      <li>Select desired equipment and time slot</li>
      <li>Submit booking request</li>
      <li>Wait for supervisor approval</li>
      <li>Receive confirmation via email</li>
    </ol>
    
    <h3>Important Notes</h3>
    <ul>
      <li>Book at least 24 hours in advance</li>
      <li>Cancel bookings you cannot attend</li>
      <li>Arrive on time for your scheduled slot</li>
    </ul>`,
    authorId: '2',
    authorName: 'John Supervisor',
    targetRole: 'student',
    createdAt: '2024-01-03T12:00:00Z',
    updatedAt: '2024-01-03T12:00:00Z'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'booking_request',
    title: 'New Booking Request',
    message: 'Jane Student has requested to book Microscope Pro X1 for Jan 18, 2024',
    recipientId: '2',
    senderId: '3',
    read: false,
    createdAt: '2024-01-12T14:30:00Z'
  },
  {
    id: '2',
    type: 'booking_approved',
    title: 'Booking Approved',
    message: 'Your booking for 3D Printer Delta has been approved for Jan 20, 2024',
    recipientId: '3',
    senderId: '2',
    read: false,
    createdAt: '2024-01-13T09:15:00Z'
  }
];

export const MOCK_STUDENTS = [
  {
    id: '3',
    name: 'Jane Student',
    email: 'jane.student@university.edu',
    phone: '+1-555-0201',
    department: 'Computer Science',
    supervisorId: '2',
    supervisorName: 'John Supervisor',
    creditUsed: 165,
    totalBookings: 12,
    activeBookings: 2
  },
  {
    id: '4',
    name: 'Mike Anderson',
    email: 'mike.anderson@university.edu',
    phone: '+1-555-0202',
    department: 'Engineering',
    supervisorId: '2',
    supervisorName: 'John Supervisor',
    creditUsed: 320,
    totalBookings: 18,
    activeBookings: 1
  },
  {
    id: '5',
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    phone: '+1-555-0203',
    department: 'Computer Science',
    supervisorId: '2',
    supervisorName: 'John Supervisor',
    creditUsed: 85,
    totalBookings: 5,
    activeBookings: 0
  },
  {
    id: '6',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1-555-0204',
    department: 'Biology',
    supervisorId: '3',
    supervisorName: 'Dr. Emily Rodriguez',
    creditUsed: 120,
    totalBookings: 8,
    activeBookings: 1
  },
  {
    id: '7',
    name: 'Emma Wilson',
    email: 'emma.wilson@university.edu',
    phone: '+1-555-0205',
    department: 'Chemistry',
    supervisorId: '4',
    supervisorName: 'Prof. David Kim',
    creditUsed: 240,
    totalBookings: 15,
    activeBookings: 3
  },
  {
    id: '8',
    name: 'David Brown',
    email: 'david.brown@university.edu',
    phone: '+1-555-0206',
    department: 'Physics',
    supervisorId: '5',
    supervisorName: 'Dr. Lisa Thompson',
    creditUsed: 190,
    totalBookings: 11,
    activeBookings: 2
  }
];