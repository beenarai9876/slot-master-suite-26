export interface Equipment {
  id: string;
  name: string;
  status: 'Active' | 'Maintenance' | 'Retired';
  place: string;
  description?: string;
  labHours?: string;
  slots?: EquipmentSlot[];
  maintenanceDetails?: {
    reason: string;
    expectedWorkDate: string;
    startDate: string;
  };
}

export interface EquipmentSlot {
  id: string;
  name: 'Early Morning' | 'Day' | 'Evening' | 'Night';
  duration: '1 hr' | '2 hr' | '3 hr';
  startTime: string;
  endTime: string;
  usageCharge: number;
  maxBookings: number;
}

export interface TableColumn {
  key: string;
  label: string;
  visible: boolean;
}

export interface EquipmentFilters {
  name: string;
  status: 'all' | 'Active' | 'Maintenance' | 'Retired';
}