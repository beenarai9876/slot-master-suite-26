import { Equipment } from '@/types/equipment';

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: '1',
    name: 'Microscope Pro X1',
    status: 'Active',
    place: 'Lab A - Room 101',
    description: 'High-resolution digital microscope for advanced research',
    labHours: '8 AM - 6 PM',
    slots: [
      {
        id: 'slot1-1',
        name: 'Early Morning',
        duration: '2 hr',
        startTime: '08:00',
        endTime: '10:00',
        usageCharge: 25.00,
        maxBookings: 2
      },
      {
        id: 'slot1-2',
        name: 'Day',
        duration: '3 hr',
        startTime: '10:30',
        endTime: '13:30',
        usageCharge: 35.00,
        maxBookings: 1
      },
      {
        id: 'slot1-3',
        name: 'Evening',
        duration: '2 hr',
        startTime: '14:00',
        endTime: '16:00',
        usageCharge: 30.00,
        maxBookings: 2
      }
    ]
  },
  {
    id: '2',
    name: 'Centrifuge Model C200',
    status: 'Maintenance',
    place: 'Lab B - Room 205',
    description: 'High-speed centrifuge for sample preparation',
    labHours: '24/7',
    slots: [
      {
        id: 'slot2-1',
        name: 'Day',
        duration: '1 hr',
        startTime: '09:00',
        endTime: '10:00',
        usageCharge: 15.00,
        maxBookings: 3
      }
    ]
  },
  {
    id: '3',
    name: '3D Printer Delta',
    status: 'Active',
    place: 'Engineering Lab',
    description: 'Professional grade 3D printer for prototyping',
    labHours: '9 AM - 9 PM',
    slots: [
      {
        id: 'slot3-1',
        name: 'Day',
        duration: '3 hr',
        startTime: '09:00',
        endTime: '12:00',
        usageCharge: 45.00,
        maxBookings: 1
      },
      {
        id: 'slot3-2',
        name: 'Evening',
        duration: '3 hr',
        startTime: '13:00',
        endTime: '16:00',
        usageCharge: 45.00,
        maxBookings: 1
      },
      {
        id: 'slot3-3',
        name: 'Night',
        duration: '2 hr',
        startTime: '18:00',
        endTime: '20:00',
        usageCharge: 40.00,
        maxBookings: 1
      }
    ]
  },
  {
    id: '4',
    name: 'Oscilloscope OS500',
    status: 'Active',
    place: 'Electronics Lab',
    description: 'Digital storage oscilloscope for circuit analysis',
    labHours: '8 AM - 8 PM',
    slots: [
      {
        id: 'slot4-1',
        name: 'Day',
        duration: '2 hr',
        startTime: '10:00',
        endTime: '12:00',
        usageCharge: 20.00,
        maxBookings: 2
      }
    ]
  },
  {
    id: '5',
    name: 'Spectrometer SP100',
    status: 'Retired',
    place: 'Chemistry Lab',
    description: 'UV-Vis spectrometer for chemical analysis',
    labHours: 'N/A'
  },
  {
    id: '6',
    name: 'Laser Cutter LC300',
    status: 'Active',
    place: 'Maker Space',
    description: 'Precision laser cutting machine',
    labHours: '10 AM - 6 PM',
    slots: [
      {
        id: 'slot6-1',
        name: 'Day',
        duration: '1 hr',
        startTime: '10:00',
        endTime: '11:00',
        usageCharge: 50.00,
        maxBookings: 1
      },
      {
        id: 'slot6-2',
        name: 'Day',
        duration: '2 hr',
        startTime: '13:00',
        endTime: '15:00',
        usageCharge: 90.00,
        maxBookings: 1
      }
    ]
  },
  {
    id: '7',
    name: 'PCR Machine P200',
    status: 'Maintenance',
    place: 'Biology Lab',
    description: 'Thermal cycler for DNA amplification',
    labHours: '8 AM - 10 PM'
  },
  {
    id: '8',
    name: 'CNC Mill M400',
    status: 'Active',
    place: 'Machine Shop',
    description: 'Computer-controlled milling machine',
    labHours: '8 AM - 5 PM',
    slots: [
      {
        id: 'slot8-1',
        name: 'Day',
        duration: '3 hr',
        startTime: '08:00',
        endTime: '11:00',
        usageCharge: 75.00,
        maxBookings: 1
      },
      {
        id: 'slot8-2',
        name: 'Day',
        duration: '3 hr',
        startTime: '13:00',
        endTime: '16:00',
        usageCharge: 75.00,
        maxBookings: 1
      }
    ]
  }
];

export const MOCK_SUPERVISORS = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@university.edu',
    phone: '+1-555-0101',
    amount: 5000,
    department: 'Computer Science',
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    phone: '+1-555-0102',
    amount: 7500,
    department: 'Engineering',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    phone: '+1-555-0103',
    amount: 3200,
    department: 'Biology',
  },
  {
    id: '4',
    name: 'Prof. David Kim',
    email: 'david.kim@university.edu',
    phone: '+1-555-0104',
    amount: 8900,
    department: 'Chemistry',
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@university.edu',
    phone: '+1-555-0105',
    amount: 4600,
    department: 'Physics',
  }
];

export const MOCK_STUDENTS = [
  {
    id: 'st1',
    name: 'Alice Johnson',
    email: 'alice.johnson@student.edu',
    department: 'Computer Science',
    supervisorId: '1',
    supervisorName: 'Dr. Sarah Wilson',
    creditUsed: 450,
    totalBookings: 12,
    activeBookings: 2,
  },
  {
    id: 'st2',
    name: 'Bob Smith',
    email: 'bob.smith@student.edu',
    department: 'Computer Science', 
    supervisorId: '1',
    supervisorName: 'Dr. Sarah Wilson',
    creditUsed: 320,
    totalBookings: 8,
    activeBookings: 1,
  },
  {
    id: 'st3',
    name: 'Charlie Brown',
    email: 'charlie.brown@student.edu',
    department: 'Engineering',
    supervisorId: '2',
    supervisorName: 'Prof. Michael Chen',
    creditUsed: 890,
    totalBookings: 15,
    activeBookings: 3,
  },
  {
    id: 'st4',
    name: 'Diana Prince',
    email: 'diana.prince@student.edu',
    department: 'Engineering',
    supervisorId: '2',
    supervisorName: 'Prof. Michael Chen',
    creditUsed: 1200,
    totalBookings: 20,
    activeBookings: 4,
  },
  {
    id: 'st5',
    name: 'Edward Davis',
    email: 'edward.davis@student.edu',
    department: 'Biology',
    supervisorId: '3',
    supervisorName: 'Dr. Emily Rodriguez',
    creditUsed: 680,
    totalBookings: 14,
    activeBookings: 2,
  },
  {
    id: 'st6',
    name: 'Fiona Green',
    email: 'fiona.green@student.edu',
    department: 'Chemistry',
    supervisorId: '4',
    supervisorName: 'Prof. David Kim',
    creditUsed: 1500,
    totalBookings: 25,
    activeBookings: 5,
  },
  {
    id: 'st7',
    name: 'George Wilson',
    email: 'george.wilson@student.edu',
    department: 'Physics',
    supervisorId: '5',
    supervisorName: 'Dr. Lisa Thompson',
    creditUsed: 750,
    totalBookings: 18,
    activeBookings: 3,
  },
  {
    id: 'st8',
    name: 'Hannah Lee',
    email: 'hannah.lee@student.edu',
    department: 'Computer Science',
    supervisorId: '1',
    supervisorName: 'Dr. Sarah Wilson',
    creditUsed: 290,
    totalBookings: 6,
    activeBookings: 1,
  }
];