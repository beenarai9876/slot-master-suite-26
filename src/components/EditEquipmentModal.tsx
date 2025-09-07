import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Equipment, EquipmentSlot } from '@/types/equipment';
import { Edit, Plus, Clock, Settings, Info } from 'lucide-react';
import SlotEditor from './SlotEditor';
interface EditEquipmentModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Equipment) => void;
}
const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Equipment>({
    id: '',
    name: '',
    status: 'Active',
    place: '',
    description: '',
    labHours: '',
    slots: []
  });
  useEffect(() => {
    if (equipment) {
      setFormData({
        ...equipment,
        slots: equipment.slots || []
      });
    }
  }, [equipment]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  const handleChange = (field: keyof Equipment, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const addNewSlot = () => {
    const newSlot: EquipmentSlot = {
      id: `slot-${Date.now()}`,
      name: 'Day',
      duration: '1 hr',
      startTime: '09:00',
      endTime: '10:00',
      usageCharge: 0,
      maxBookings: 1
    };
    setFormData(prev => ({
      ...prev,
      slots: [...(prev.slots || []), newSlot]
    }));
  };
  const updateSlot = (index: number, updatedSlot: EquipmentSlot) => {
    setFormData(prev => ({
      ...prev,
      slots: prev.slots?.map((slot, i) => i === index ? updatedSlot : slot) || []
    }));
  };
  const deleteSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      slots: prev.slots?.filter((_, i) => i !== index) || []
    }));
  };
  const getTotalSlotCharges = () => {
    return formData.slots?.reduce((total, slot) => total + slot.usageCharge, 0) || 0;
  };
  if (!equipment) return null;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Equipment: {equipment.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Basic Information
                </TabsTrigger>
                <TabsTrigger value="slots" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time Slots & Pricing
                </TabsTrigger>
              </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="Enter equipment name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place">Location *</Label>
                  <Input id="place" value={formData.place} onChange={e => handleChange('place', e.target.value)} placeholder="Enter location" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={value => handleChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labHours">Lab Hours</Label>
                  <Input id="labHours" value={formData.labHours || ''} onChange={e => handleChange('labHours', e.target.value)} placeholder="e.g., 9:00 AM - 5:00 PM" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} placeholder="Enter equipment description" rows={4} />
              </div>
            </TabsContent>

            {/* Time Slots Tab */}
            <TabsContent value="slots" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Time Slots Management
                    </div>
                    <div className="flex items-center gap-4">
                      
                      <Button type="button" onClick={addNewSlot} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Slot
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="max-h-[350px] overflow-y-auto pr-2">
                    {formData.slots?.length === 0 ? <div className="text-center py-12 text-muted-foreground">
                        <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No time slots configured</h3>
                        <p className="text-sm mb-4">Add time slots to make this equipment bookable and set pricing</p>
                        <Button type="button" onClick={addNewSlot} variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Slot
                        </Button>
                      </div> : <div className="space-y-4">
                        {formData.slots?.map((slot, index) => <SlotEditor key={slot.id} slot={slot} index={index} onUpdate={updatedSlot => updateSlot(index, updatedSlot)} onDelete={() => deleteSlot(index)} />)}
                      </div>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Settings className="h-4 w-4 mr-2" />
              Save All Changes
            </Button>
          </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>;
};
export default EditEquipmentModal;