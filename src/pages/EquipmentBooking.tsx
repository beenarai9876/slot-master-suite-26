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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
  Clock
} from 'lucide-react';
import { MOCK_EQUIPMENT } from '@/data/mockData';
import { MOCK_STUDENTS, MOCK_BOOKINGS } from '@/data/mockBookings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import WeeklyCalendarGrid from '@/components/WeeklyCalendarGrid';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import { addDays, isSameDay } from 'date-fns';

interface BookingSlot {
  id: string;
  day: Date;
  timeSlot: string;
  status: 'available' | 'booked' | 'unavailable';
  supervisorName?: string;
  equipmentId: string;
}

const EquipmentBooking: React.FC = () => {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<{ day: Date; timeSlot: string } | undefined>();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Generate mock booking data
  const generateMockBookings = (): BookingSlot[] => {
    const bookings: BookingSlot[] = [];
    const timeSlots = ['09', '10', '11', '12', '13', '14', '15', '16', '17'];
    const supervisors = ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Prof. Brown'];
    
    // Generate some random bookings for the week
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const day = addDays(selectedWeek, dayOffset);
      
      // Skip weekends for this example
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
      
      timeSlots.forEach((slot, slotIndex) => {
        // Randomly assign some slots as booked
        const isBooked = Math.random() < 0.3; // 30% chance of being booked
        
        if (isBooked) {
          bookings.push({
            id: `${dayOffset}-${slot}`,
            day,
            timeSlot: slot,
            status: 'booked',
            supervisorName: supervisors[Math.floor(Math.random() * supervisors.length)],
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

  // Get equipment in maintenance for supervisor role
  const maintenanceEquipment = MOCK_EQUIPMENT.filter(e => e.status === 'Maintenance');

  const handleSlotSelect = (day: Date, timeSlot: string) => {
    setSelectedSlot({ day, timeSlot });
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = (studentId: string, remarks: string) => {
    if (!selectedSlot || !selectedEquipment) return;

    const equipment = MOCK_EQUIPMENT.find(e => e.id === selectedEquipment);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);

    toast({
      title: "Booking Confirmed",
      description: `${equipment?.name} booked for ${student?.name} on ${selectedSlot.day.toDateString()} at ${selectedSlot.timeSlot}:00`,
    });

    setIsBookingModalOpen(false);
    setSelectedSlot(undefined);
  };

  const handleModalClose = () => {
    setIsBookingModalOpen(false);
    setSelectedSlot(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CalendarIcon className="h-8 w-8 text-primary" />
          Equipment Booking
        </h1>
        <p className="text-muted-foreground mt-1">
          Schedule equipment bookings for your students
        </p>
      </div>

      {/* Equipment Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose equipment to book" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_EQUIPMENT.filter(e => e.status === 'Active').map(equipment => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.name} - {equipment.place}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Details - Show for supervisors when equipment is selected */}
      {user?.role === 'supervisor' && selectedEquipment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Equipment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const equipment = MOCK_EQUIPMENT.find(e => e.id === selectedEquipment);
              if (!equipment) return null;
              
              return (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{equipment.name}</h3>
                      <p className="text-muted-foreground">{equipment.description || 'No description available'}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p className="font-medium">{equipment.place}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge 
                          variant={equipment.status === 'Active' ? 'default' : 
                                  equipment.status === 'Maintenance' ? 'secondary' : 'destructive'}
                          className={equipment.status === 'Active' ? 'bg-success/10 text-success border-success/20' : ''}
                        >
                          {equipment.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {equipment.labHours && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Lab Hours</p>
                        <p className="font-medium">{equipment.labHours}</p>
                      </div>
                    )}
                  </div>
                  
                  {equipment.slots && equipment.slots.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Available Time Slots</h4>
                      <div className="space-y-2">
                        {equipment.slots.map(slot => (
                          <div key={slot.id} className="p-3 border rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{slot.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {slot.startTime} - {slot.endTime} ({slot.duration})
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">${slot.usageCharge}</p>
                                <p className="text-xs text-muted-foreground">Max: {slot.maxBookings}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Weekly Calendar Grid */}
      <WeeklyCalendarGrid
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        selectedEquipment={selectedEquipment}
        bookings={mockBookings}
        onSlotSelect={handleSlotSelect}
        selectedSlot={selectedSlot}
      />

      {/* Conditional Content Based on Role */}
      {user?.role === 'supervisor' ? (
        // Equipment in Maintenance Section for Supervisors
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-warning" />
              Equipment in Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {maintenanceEquipment.length > 0 ? (
              <div className="space-y-4">
                {maintenanceEquipment.map(equipment => (
                  <Card key={equipment.id} className="border-l-4 border-l-warning">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{equipment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Location: {equipment.place}
                          </p>
                          {equipment.maintenanceDetails && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Started: {equipment.maintenanceDetails.startDate}
                              </p>
                              <p>Reason: {equipment.maintenanceDetails.reason}</p>
                              <p>Expected completion: {equipment.maintenanceDetails.expectedWorkDate}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-warning/10 text-warning border-warning/20">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            In Maintenance
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No equipment currently in maintenance</p>
                <p className="text-sm">All equipment is operating normally</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Today's Bookings Section for Other Roles
        <Card>
          <CardHeader>
            <CardTitle>Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <div className="space-y-4">
                  {MOCK_BOOKINGS.filter(b => b.status === 'pending').map(booking => (
                    <Card key={booking.id} className="border-l-4 border-l-warning">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{booking.equipmentName}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.studentName} • {booking.date} • {booking.startTime}-{booking.endTime}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-success hover:bg-success/90">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="approved">
                <div className="space-y-4">
                  {MOCK_BOOKINGS.filter(b => b.status === 'approved').map(booking => (
                    <Card key={booking.id} className="border-l-4 border-l-success">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{booking.equipmentName}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.studentName} • {booking.date} • {booking.startTime}-{booking.endTime}
                            </p>
                          </div>
                          <Badge className="bg-success/10 text-success border-success/20">
                            Approved
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="space-y-4">
                  {MOCK_BOOKINGS.filter(b => b.status === 'completed').map(booking => (
                    <Card key={booking.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{booking.equipmentName}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.studentName} • {booking.date} • {booking.startTime}-{booking.endTime}
                            </p>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            Completed
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Booking Confirmation Modal */}
      {selectedSlot && (
        <BookingConfirmationModal
          isOpen={isBookingModalOpen}
          onClose={handleModalClose}
          onConfirm={handleBookingConfirm}
          equipmentId={selectedEquipment}
          selectedDay={selectedSlot.day}
          selectedTimeSlot={selectedSlot.timeSlot}
        />
      )}
    </div>
  );
};

export default EquipmentBooking;