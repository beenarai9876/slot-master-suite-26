import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wrench, Save, ArrowLeft, Plus, Trash2, Clock, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EquipmentSlot {
  id: string;
  name: 'Early Morning' | 'Day' | 'Evening' | 'Night';
  duration: '1 hr' | '2 hr' | '3 hr';
  startTime: string;
  endTime: string;
  usageCharge: number;
  maxBookings: number;
}

interface EquipmentFormData {
  name: string;
  description: string;
  place: string;
  labHours: string;
  slots: EquipmentSlot[];
}

const AddEquipment: React.FC = () => {
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    description: '',
    place: '',
    labHours: '',
    slots: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const slotOptions = [
    { value: 'Early Morning', label: 'Early Morning' },
    { value: 'Day', label: 'Day' },
    { value: 'Evening', label: 'Evening' },
    { value: 'Night', label: 'Night' }
  ];

  const durationOptions = [
    { value: '1 hr', label: '1 Hour' },
    { value: '2 hr', label: '2 Hours' },
    { value: '3 hr', label: '3 Hours' }
  ];

  const handleInputChange = (field: keyof EquipmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSlot = () => {
    const newSlot: EquipmentSlot = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Early Morning',
      duration: '1 hr',
      startTime: '08:00',
      endTime: '09:00',
      usageCharge: 0,
      maxBookings: 1
    };

    setFormData(prev => ({
      ...prev,
      slots: [...prev.slots, newSlot]
    }));
  };

  const updateSlot = (slotId: string, field: keyof EquipmentSlot, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      slots: prev.slots.map(slot => 
        slot.id === slotId 
          ? { ...slot, [field]: value }
          : slot
      )
    }));
  };

  const removeSlot = (slotId: string) => {
    setFormData(prev => ({
      ...prev,
      slots: prev.slots.filter(slot => slot.id !== slotId)
    }));
  };

  const calculateEndTime = (startTime: string, duration: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const durationHours = parseInt(duration);
    
    const endHours = (hours + durationHours) % 24;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSlotStartTimeChange = (slotId: string, startTime: string) => {
    const slot = formData.slots.find(s => s.id === slotId);
    if (slot) {
      const endTime = calculateEndTime(startTime, slot.duration);
      updateSlot(slotId, 'startTime', startTime);
      updateSlot(slotId, 'endTime', endTime);
    }
  };

  const handleSlotDurationChange = (slotId: string, duration: string) => {
    const slot = formData.slots.find(s => s.id === slotId);
    if (slot) {
      const endTime = calculateEndTime(slot.startTime, duration);
      updateSlot(slotId, 'duration', duration as EquipmentSlot['duration']);
      updateSlot(slotId, 'endTime', endTime);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.place) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Equipment Added Successfully",
      description: `${formData.name} has been added to the system`,
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      place: '',
      labHours: '',
      slots: []
    });

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          Add New Equipment
        </h1>
        <p className="text-muted-foreground mt-1">
          Add equipment to the booking system with available time slots
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Equipment Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Microscope Pro X1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place">
                    Location/Place <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="place"
                    type="text"
                    value={formData.place}
                    onChange={(e) => handleInputChange('place', e.target.value)}
                    placeholder="e.g., Lab A - Room 101"
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="labHours">Lab Operating Hours</Label>
                  <Input
                    id="labHours"
                    type="text"
                    value={formData.labHours}
                    onChange={(e) => handleInputChange('labHours', e.target.value)}
                    placeholder="e.g., 8 AM - 6 PM"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter equipment description, specifications, and usage guidelines..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Provide detailed information about the equipment, its capabilities, and any special instructions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between mx">
                <span>Available Time Slots</span>
                <Button
                  type="button"
                  onClick={addSlot}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slot
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.slots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No time slots added yet</p>
                  <p className="text-sm">Add time slots to make this equipment bookable</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.slots.map((slot, index) => (
                    <Card key={slot.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary">Slot {index + 1}</Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSlot(slot.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                          <div className="space-y-2">
                            <Label>Slot Name</Label>
                            <Select
                              value={slot.name}
                              onValueChange={(value) => updateSlot(slot.id, 'name', value as EquipmentSlot['name'])}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {slotOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Select
                              value={slot.duration}
                              onValueChange={(value) => handleSlotDurationChange(slot.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {durationOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => handleSlotStartTimeChange(slot.id, e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={slot.endTime}
                              readOnly
                              className="bg-muted"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Usage Charge ($)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={slot.usageCharge}
                                onChange={(e) => updateSlot(slot.id, 'usageCharge', parseFloat(e.target.value) || 0)}
                                className="pl-10"
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Max Bookings</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={slot.maxBookings}
                              onChange={(e) => updateSlot(slot.id, 'maxBookings', parseInt(e.target.value) || 1)}
                              placeholder="1"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding Equipment...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Add Equipment
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({
                    name: '',
                    description: '',
                    place: '',
                    labHours: '',
                    slots: []
                  })}
                  disabled={isSubmitting}
                >
                  Reset Form
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                  className="sm:ml-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default AddEquipment;
