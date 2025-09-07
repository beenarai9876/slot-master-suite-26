import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, DollarSign } from 'lucide-react';
import { EquipmentSlot } from '@/types/equipment';

interface SlotEditorProps {
  slot: EquipmentSlot;
  index: number;
  onUpdate: (slot: EquipmentSlot) => void;
  onDelete: () => void;
}

const SlotEditor: React.FC<SlotEditorProps> = ({ slot, index, onUpdate, onDelete }) => {
  const handleFieldChange = (field: keyof EquipmentSlot, value: string | number) => {
    onUpdate({
      ...slot,
      [field]: value,
    });
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Slot {index + 1}
          </Badge>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="h-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
          <div className="space-y-2">
            <Label htmlFor={`slot-name-${slot.id}`}>Slot Name</Label>
            <Select
              value={slot.name}
              onValueChange={(value) => handleFieldChange('name', value as EquipmentSlot['name'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select slot name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Early Morning">Early Morning</SelectItem>
                <SelectItem value="Day">Day</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`slot-duration-${slot.id}`}>Duration</Label>
            <Select
              value={slot.duration}
              onValueChange={(value) => handleFieldChange('duration', value as EquipmentSlot['duration'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 hr">1 hour</SelectItem>
                <SelectItem value="2 hr">2 hours</SelectItem>
                <SelectItem value="3 hr">3 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`slot-start-${slot.id}`}>Start Time</Label>
            <Input
              id={`slot-start-${slot.id}`}
              type="time"
              value={slot.startTime}
              onChange={(e) => handleFieldChange('startTime', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`slot-end-${slot.id}`}>End Time</Label>
            <Input
              id={`slot-end-${slot.id}`}
              type="time"
              value={slot.endTime}
              onChange={(e) => handleFieldChange('endTime', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`slot-charge-${slot.id}`} className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Usage Charge ($)
            </Label>
            <Input
              id={`slot-charge-${slot.id}`}
              type="number"
              min="0"
              step="0.01"
              value={slot.usageCharge}
              onChange={(e) => handleFieldChange('usageCharge', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`slot-bookings-${slot.id}`}>Max Bookings</Label>
            <Input
              id={`slot-bookings-${slot.id}`}
              type="number"
              min="1"
              value={slot.maxBookings}
              onChange={(e) => handleFieldChange('maxBookings', parseInt(e.target.value) || 1)}
              placeholder="1"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Summary:</span>
            <div className="flex items-center gap-4">
              <span>{slot.startTime} - {slot.endTime}</span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {slot.usageCharge}
              </span>
              <span>{slot.maxBookings} max bookings</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotEditor;