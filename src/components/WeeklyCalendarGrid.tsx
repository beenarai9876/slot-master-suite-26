import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

interface TimeSlot {
  time: string;
  hour: number;
}

interface BookingSlot {
  id: string;
  day: Date;
  timeSlot: string;
  status: 'available' | 'booked' | 'unavailable';
  supervisorName?: string;
  studentName?: string;
  equipmentId: string;
}

interface WeeklyCalendarGridProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  selectedEquipment: string;
  bookings: BookingSlot[];
  onSlotSelect: (day: Date, timeSlot: string) => void;
  selectedSlot?: { day: Date; timeSlot: string };
}

const TIME_SLOTS: TimeSlot[] = [
  { time: '09:00', hour: 9 },
  { time: '10:00', hour: 10 },
  { time: '11:00', hour: 11 },
  { time: '12:00', hour: 12 },
  { time: '13:00', hour: 13 },
  { time: '14:00', hour: 14 },
  { time: '15:00', hour: 15 },
  { time: '16:00', hour: 16 },
  { time: '17:00', hour: 17 },
];

const WeeklyCalendarGrid: React.FC<WeeklyCalendarGridProps> = ({
  selectedWeek,
  onWeekChange,
  selectedEquipment,
  bookings,
  onSlotSelect,
  selectedSlot
}) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getSlotStatus = (day: Date, timeSlot: string): BookingSlot | null => {
    return bookings.find(booking => 
      isSameDay(booking.day, day) && 
      booking.timeSlot === timeSlot &&
      booking.equipmentId === selectedEquipment
    ) || null;
  };

  const getSlotColor = (status: 'available' | 'booked' | 'unavailable') => {
    switch (status) {
      case 'available':
        return 'bg-success/20 hover:bg-success/30 border-success/30';
      case 'booked':
        return 'bg-destructive/20 border-destructive/30';
      case 'unavailable':
        return 'bg-muted border-muted-foreground/20';
      default:
        return 'bg-muted border-muted-foreground/20';
    }
  };

  const isSlotSelected = (day: Date, timeSlot: string) => {
    return selectedSlot && 
           isSameDay(selectedSlot.day, day) && 
           selectedSlot.timeSlot === timeSlot;
  };

  const handlePrevWeek = () => {
    onWeekChange(addDays(selectedWeek, -7));
  };

  const handleNextWeek = () => {
    onWeekChange(addDays(selectedWeek, 7));
  };

  const handleSlotClick = (day: Date, timeSlot: string, status: 'available' | 'booked' | 'unavailable') => {
    if (status === 'available') {
      onSlotSelect(day, timeSlot);
    }
  };

  return (
    <div className="h-full flex flex-col max-h-screen">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm md:text-base font-semibold">Weekly Schedule</h3>
        <div className="flex items-center gap-1 md:gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevWeek}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
          >
            <ChevronLeft className="h-3 w-3 md:h-3.5 md:w-3.5" />
          </Button>
          <span className="font-medium min-w-[140px] md:min-w-[180px] text-center text-[10px] md:text-xs">
            {format(weekStart, 'MMM dd')} - {format(addDays(weekStart, 6), 'MMM dd, yyyy')}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
          >
            <ChevronRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        {!selectedEquipment ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-xs md:text-sm">Select equipment to view available slots</p>
          </div>
        ) : (
          <div className="h-full flex flex-col min-h-0">
            {/* Mobile view - vertical layout */}
            <div className="block md:hidden">
              <div className="space-y-3">
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2 text-center">
                      {format(day, 'EEE, MMM dd')}
                    </h4>
                    <div className="grid grid-cols-3 gap-1.5">
                      {TIME_SLOTS.map((slot) => {
                        const booking = getSlotStatus(day, slot.time);
                        const status = booking?.status || 'available';
                        const isSelected = isSlotSelected(day, slot.time);
                        
                        return (
                          <div
                            key={`mobile-${dayIndex}-${slot.time}`}
                            className={`
                              p-2 border rounded-md cursor-pointer transition-all flex flex-col justify-center min-h-[60px]
                              ${getSlotColor(status)}
                              ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}
                              ${status === 'available' ? 'hover:scale-[1.02]' : ''}
                              ${status !== 'available' ? 'cursor-not-allowed' : ''}
                            `}
                            onClick={() => handleSlotClick(day, slot.time, status)}
                          >
                            <div className="text-[10px] font-medium text-center mb-1">
                              {slot.time}
                            </div>
                            {booking && booking.status === 'booked' && (
                              <div className="text-[9px] space-y-1">
                                <div className="font-medium truncate text-destructive leading-tight text-center">
                                  {booking.supervisorName}
                                </div>
                                {booking.studentName && (
                                  <div className="text-muted-foreground truncate leading-tight text-center">
                                    {booking.studentName}
                                  </div>
                                )}
                                <Badge className="text-[8px] px-1 py-0 bg-destructive/20 text-destructive border-destructive/30 h-3 w-full justify-center">
                                  Booked
                                </Badge>
                              </div>
                            )}
                            {status === 'available' && isSelected && (
                              <div className="text-center">
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] px-1 py-0 h-3">
                                  Selected
                                </Badge>
                              </div>
                            )}
                            {status === 'available' && !isSelected && (
                              <div className="text-[9px] text-center text-success font-medium">
                                Available
                              </div>
                            )}
                            {status === 'unavailable' && (
                              <div className="text-[9px] text-center text-muted-foreground">
                                Closed
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/tablet view - horizontal grid */}
            <div className="hidden md:block flex-1 flex-col min-h-0">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px] lg:min-w-[700px] xl:min-w-[800px] flex-1 flex flex-col min-h-0">
                  {/* Header with days */}
                  <div className="grid grid-cols-8 gap-0.5 mb-2 flex-shrink-0">
                    <div className="px-1.5 py-1.5 font-medium text-xs">Time</div>
                    {weekDays.map((day, index) => (
                      <div key={index} className="px-1 py-1.5 text-center">
                        <div className="font-medium text-xs">
                          {format(day, 'EEE')}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {format(day, 'MMM dd')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time slots grid */}
                  <div className="flex-1 min-h-0">
                    <div className="grid grid-rows-9 gap-0.5 h-full">
                      {TIME_SLOTS.map((slot) => (
                        <div key={slot.time} className="grid grid-cols-8 gap-0.5 h-full">
                          <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground flex items-center justify-center">
                            {slot.time}
                          </div>
                          {weekDays.map((day, dayIndex) => {
                            const booking = getSlotStatus(day, slot.time);
                            const status = booking?.status || 'available';
                            const isSelected = isSlotSelected(day, slot.time);
                            
                            return (
                              <div
                                key={`${dayIndex}-${slot.time}`}
                                className={`
                                  px-1.5 py-1 border rounded-md cursor-pointer transition-all flex flex-col justify-center h-full min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px]
                                  ${getSlotColor(status)}
                                  ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}
                                  ${status === 'available' ? 'hover:scale-[1.01]' : ''}
                                  ${status !== 'available' ? 'cursor-not-allowed' : ''}
                                `}
                                onClick={() => handleSlotClick(day, slot.time, status)}
                              >
                                {booking && booking.status === 'booked' && (
                                  <div className="text-[9px] md:text-[10px] space-y-0.5">
                                    <div className="font-medium truncate text-destructive leading-tight">
                                      {booking.supervisorName}
                                    </div>
                                    {booking.studentName && (
                                      <div className="text-muted-foreground truncate leading-tight">
                                        {booking.studentName}
                                      </div>
                                    )}
                                    <Badge className="text-[8px] md:text-[9px] px-1 py-0 bg-destructive/20 text-destructive border-destructive/30 h-3 md:h-4">
                                      Booked
                                    </Badge>
                                  </div>
                                )}
                                {status === 'available' && isSelected && (
                                  <div className="text-center">
                                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] md:text-[9px] px-1 py-0 h-3 md:h-4">
                                      Selected
                                    </Badge>
                                  </div>
                                )}
                                {status === 'available' && !isSelected && (
                                  <div className="text-[9px] md:text-[10px] text-center text-success font-medium">
                                    Available
                                  </div>
                                )}
                                {status === 'unavailable' && (
                                  <div className="text-[9px] md:text-[10px] text-center text-muted-foreground">
                                    Closed
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mt-2 pt-2 border-t flex-shrink-0">
              <div className="flex items-center gap-1 md:gap-1.5">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-success/20 border border-success/30 rounded"></div>
                <span className="text-[9px] md:text-[10px]">Available</span>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-destructive/20 border border-destructive/30 rounded"></div>
                <span className="text-[9px] md:text-[10px]">Booked</span>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-muted border border-muted-foreground/20 rounded"></div>
                <span className="text-[9px] md:text-[10px]">Unavailable</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyCalendarGrid;