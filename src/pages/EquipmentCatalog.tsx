import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Calendar as CalendarIcon, 
  Wrench, 
  MapPin, 
  Clock, 
  CreditCard,
  User,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { MOCK_EQUIPMENT } from '@/data/mockData';
import { MOCK_STUDENTS } from '@/data/mockBookings';
import { toast } from '@/hooks/use-toast';
import WeeklyCalendarGrid from '@/components/WeeklyCalendarGrid';
import { addDays, format, isSameDay } from 'date-fns';

interface BookingSlot {
  id: string;
  day: Date;
  timeSlot: string;
  status: 'available' | 'booked' | 'unavailable';
  supervisorName?: string;
  studentName?: string;
  equipmentId: string;
}

const EquipmentBooking: React.FC = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ day: Date; timeSlot: string } | undefined>();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const selectedEquipmentData = MOCK_EQUIPMENT.find(e => e.id === selectedEquipment);
  const activeEquipment = MOCK_EQUIPMENT.filter(e => e.status === 'Active');
  const maintenanceEquipment = MOCK_EQUIPMENT.filter(e => e.status === 'Maintenance');

  // Generate mock booking data for calendar with realistic supervisor and student data
  const generateMockBookings = (): BookingSlot[] => {
    const bookings: BookingSlot[] = [];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    
    // Predefined realistic booking data
    const predefinedBookings = [
      { day: 1, slot: '11:00', supervisor: 'Prof Rakesh Kumar Sharma', student: 'Amit Kumar' },
      { day: 1, slot: '14:00', supervisor: 'Dr Rohan D Erande', student: 'Priya Singh' },
      { day: 1, slot: '16:00', supervisor: 'Dr Subrata Chakraborty', student: 'Rahul Mehta' },
      { day: 1, slot: '17:00', supervisor: 'Dr Subrata Chakraborty', student: 'Sonia Patel' },
      { day: 2, slot: '10:00', supervisor: 'Dr Jayita Sarkar', student: 'Vikram Shah' },
      { day: 2, slot: '11:00', supervisor: 'Prof Rakesh Kumar Sharma', student: 'Neha Gupta' },
      { day: 2, slot: '16:00', supervisor: 'Dr Subrata Chakraborty', student: 'Arjun Verma' },
      { day: 2, slot: '17:00', supervisor: 'Dr Subrata Chakraborty', student: 'Kavya Iyer' },
      { day: 3, slot: '12:00', supervisor: 'Prof Rakesh Kumar Sharma', student: 'Rohit Sharma' },
      { day: 3, slot: '15:00', supervisor: 'Prof Samanwita Pal', student: 'Ananya Das' },
      { day: 3, slot: '16:00', supervisor: 'Prof Samanwita Pal', student: 'Kiran Reddy' },
      { day: 4, slot: '09:00', supervisor: 'Dr Jayita Sarkar', student: 'Deepak Kumar' },
      { day: 4, slot: '10:00', supervisor: 'Dr Jayita Sarkar', student: 'Sneha Joshi' },
      { day: 4, slot: '11:00', supervisor: 'Dr Jayita Sarkar', student: 'Manish Agarwal' },
      { day: 4, slot: '12:00', supervisor: 'Prof Rakesh Kumar Sharma', student: 'Pooja Nair' },
      { day: 4, slot: '13:00', supervisor: 'Dr Jayita Sarkar', student: 'Ravi Prasad' },
      { day: 4, slot: '14:00', supervisor: 'Dr Jayita Sarkar', student: 'Meera Pillai' },
      { day: 4, slot: '15:00', supervisor: 'Prof Samanwita Pal', student: 'Suresh Babu' },
      { day: 4, slot: '16:00', supervisor: 'Prof Samanwita Pal', student: 'Lakshmi Nair' },
      { day: 5, slot: '12:00', supervisor: 'Dr Subrata Chakraborty', student: 'Ashwin Rao' },
      { day: 5, slot: '16:00', supervisor: 'Dr Subrata Chakraborty', student: 'Divya Singh' },
      { day: 5, slot: '17:00', supervisor: 'Dr Subrata Chakraborty', student: 'Manoj Tiwari' },
    ];
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const day = addDays(selectedWeek, dayOffset);
      
      // Make weekends unavailable
      if (day.getDay() === 0 || day.getDay() === 6) {
        timeSlots.forEach(slot => {
          bookings.push({
            id: `${dayOffset}-${slot}`,
            day,
            timeSlot: slot,
            status: 'unavailable',
            equipmentId: selectedEquipment,
          });
        });
        continue;
      }
      
      timeSlots.forEach((slot) => {
        // Check if this slot has a predefined booking
        const predefinedBooking = predefinedBookings.find(
          booking => booking.day === dayOffset && booking.slot === slot
        );
        
        if (predefinedBooking) {
          bookings.push({
            id: `${dayOffset}-${slot}`,
            day,
            timeSlot: slot,
            status: 'booked',
            supervisorName: predefinedBooking.supervisor,
            studentName: predefinedBooking.student,
            equipmentId: selectedEquipment,
          });
        } else {
          bookings.push({
            id: `${dayOffset}-${slot}`,
            day,
            timeSlot: slot,
            status: 'available',
            equipmentId: selectedEquipment,
          });
        }
      });
    }
    
    return bookings;
  };

  const mockBookings = generateMockBookings();

  const handleEquipmentSelect = (equipmentId: string) => {
    setSelectedEquipment(equipmentId);
    setSelectedSlot(undefined);
  };

  const handleBookNow = () => {
    if (!selectedEquipment) {
      toast({
        title: "No Equipment Selected",
        description: "Please select an equipment first",
        variant: "destructive"
      });
      return;
    }
    setIsCalendarModalOpen(true);
  };

  const handleSlotSelect = (day: Date, timeSlot: string) => {
    setSelectedSlot({ day, timeSlot });
    setIsCalendarModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedStudentId || !selectedSlot || !selectedEquipment) {
      toast({
        title: "Incomplete Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
    const equipment = MOCK_EQUIPMENT.find(e => e.id === selectedEquipment);

    toast({
      title: "Booking Confirmed",
      description: `${equipment?.name} booked for ${student?.name} on ${format(selectedSlot.day, 'PPP')} at ${selectedSlot.timeSlot}`,
    });

    // Reset states
    setIsConfirmModalOpen(false);
    setSelectedSlot(undefined);
    setSelectedStudentId('');
    setRemarks('');
  };

  const getSlotCost = () => {
    const hour = selectedSlot?.timeSlot ? parseInt(selectedSlot.timeSlot.split(':')[0]) : 9;
    if (hour < 12) return 50; // Morning
    if (hour < 17) return 60; // Afternoon
    return 70; // Evening
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CalendarIcon className="h-8 w-8 text-primary" />
          Equipment Booking
        </h1>
        <p className="text-muted-foreground mt-1">
          Book laboratory equipment for your students
        </p>
      </div>

      {/* Equipment Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Select value={selectedEquipment} onValueChange={handleEquipmentSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose equipment to book..." />
              </SelectTrigger>
              <SelectContent>
                {activeEquipment.map(equipment => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.name} - {equipment.place}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Details */}
      {selectedEquipmentData && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-primary">
                {selectedEquipmentData.name}
              </CardTitle>
              <Badge className="status-active">
                {selectedEquipmentData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Equipment Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">Location:</span>
                      <span className="text-muted-foreground">{selectedEquipmentData.place}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Lab Hours:</span>
                      <span className="text-muted-foreground">{selectedEquipmentData.labHours}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span className="font-medium">Credits:</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                          Morning: ₹50/hr
                        </Badge>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                          Afternoon: ₹60/hr
                        </Badge>
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                          Evening: ₹70/hr
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedEquipmentData.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedEquipmentData.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Booking Guidelines</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Maximum 4 samples can be recorded in one hour slot</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Book at least 24 hours in advance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Safety training required before first use</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-destructive">No booking during 1:30pm to 2:30pm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-destructive">No booking on public holidays and weekends</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
                    size="lg"
                  >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment in Maintenance */}
      {maintenanceEquipment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-warning" />
              Equipment in Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceEquipment.map((equipment) => (
                <Card key={equipment.id} className="border-warning/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{equipment.name}</h3>
                          <Badge className="status-maintenance">
                            maintenance
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {equipment.place}
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Reason:</span>
                            {equipment.id === '2' ? 'Waiting for Power Board' : 'Not working'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">Expected to work on:</span>
                            {equipment.id === '2' ? 'September 18th 2024, 12:00:00 am' : 'May 31st 2024, 5:30:00 am'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Modal */}
      <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
        <DialogContent className="max-w-7xl w-[95vw] h-[85vh] flex flex-col p-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Time Slot - {selectedEquipmentData?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <WeeklyCalendarGrid
              selectedWeek={selectedWeek}
              onWeekChange={setSelectedWeek}
              selectedEquipment={selectedEquipment}
              bookings={mockBookings}
              onSlotSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Equipment:</span>
                <span className="text-muted-foreground">{selectedEquipmentData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span className="text-muted-foreground">
                  {selectedSlot && format(selectedSlot.day, 'PPP')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span className="text-muted-foreground">{selectedSlot?.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cost:</span>
                <span className="font-semibold text-success">₹{getSlotCost()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="student">Book for Student</Label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student..." />
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

              <div>
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  placeholder="Add any special requirements or notes..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmBooking}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentBooking;