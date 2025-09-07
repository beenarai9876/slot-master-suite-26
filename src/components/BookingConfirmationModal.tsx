import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { MOCK_STUDENTS } from '@/data/mockBookings';
import { MOCK_EQUIPMENT } from '@/data/mockData';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (studentId: string, remarks: string) => void;
  equipmentId: string;
  selectedDay: Date;
  selectedTimeSlot: string;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  equipmentId,
  selectedDay,
  selectedTimeSlot,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const equipment = MOCK_EQUIPMENT.find(e => e.id === equipmentId);

  const handleConfirm = () => {
    if (!selectedStudent) return;
    onConfirm(selectedStudent, remarks);
    // Reset form
    setSelectedStudent('');
    setRemarks('');
  };

  const handleClose = () => {
    setSelectedStudent('');
    setRemarks('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Confirm Booking
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Equipment:
              </span>
              <span className="font-medium text-sm">
                {equipment?.name}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date:
              </span>
              <span className="font-medium text-sm">
                {format(selectedDay, 'PPP')}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Slot:
              </span>
              <span className="font-medium text-sm">
                {selectedTimeSlot}:00 - {parseInt(selectedTimeSlot) + 1}:00
              </span>
            </div>
          </div>

          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student-select">Book for Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger id="student-select">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_STUDENTS.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - {student.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Remarks (Optional)
            </Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any special instructions or notes..."
              className="min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedStudent}
              className="bg-gradient-primary hover:opacity-90"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationModal;