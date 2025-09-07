import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Wrench } from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, expectedDate: string) => void;
  equipmentName: string;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  equipmentName,
}) => {
  const [reason, setReason] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !expectedDate) return;

    setIsSubmitting(true);
    try {
      onConfirm(reason.trim(), expectedDate);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setExpectedDate('');
    setIsSubmitting(false);
    onClose();
  };

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-warning" />
            Set Equipment to Maintenance
          </DialogTitle>
          <DialogDescription>
            Please provide maintenance details for <strong>{equipmentName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Maintenance Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Describe the reason for maintenance (e.g., routine inspection, repair needed, calibration required...)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-20 resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedDate" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Expected Work Completion Date *
            </Label>
            <Input
              id="expectedDate"
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              min={minDate}
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!reason.trim() || !expectedDate || isSubmitting}
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              {isSubmitting ? 'Setting...' : 'Set to Maintenance'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceModal;