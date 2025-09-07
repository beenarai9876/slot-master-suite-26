import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MOCK_SUPERVISORS } from '@/data/mockData';
import { UserX, ArrowRight, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudentTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  onTransfer: (studentId: string, newSupervisorId: string, newSupervisorName: string) => void;
}

const StudentTransferModal: React.FC<StudentTransferModalProps> = ({
  isOpen,
  onClose,
  student,
  onTransfer
}) => {
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>('');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleTransfer = () => {
    if (!selectedSupervisorId) {
      toast({
        title: "Select Supervisor",
        description: "Please select a supervisor to transfer the student to",
        variant: "destructive"
      });
      return;
    }

    const newSupervisor = MOCK_SUPERVISORS.find(s => s.id === selectedSupervisorId);
    if (!newSupervisor) return;

    onTransfer(student.id, selectedSupervisorId, newSupervisor.name);
    onClose();
    setSelectedSupervisorId('');
  };

  const availableSupervisors = MOCK_SUPERVISORS.filter(s => s.id !== student?.supervisorId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Transfer Student
          </DialogTitle>
        </DialogHeader>

        {student && (
          <div className="space-y-6">
            {/* Current Student */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department:</span>
                  <Badge variant="outline">{student.department}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Supervisor:</span>
                  <span className="font-medium">{student.supervisorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Credits Used:</span>
                  <span className="font-medium">${student.creditUsed}</span>
                </div>
              </div>
            </div>

            {/* Transfer Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            {/* New Supervisor Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Transfer to Supervisor:</label>
              <Select value={selectedSupervisorId} onValueChange={setSelectedSupervisorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {availableSupervisors.map(supervisor => (
                    <SelectItem key={supervisor.id} value={supervisor.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{supervisor.name}</span>
                        <Badge variant="outline" className="ml-2">{supervisor.department}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Warning */}
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                <strong>Note:</strong> This action will transfer the student and all their booking history 
                to the new supervisor. This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleTransfer}
                className="bg-gradient-primary hover:opacity-90"
              >
                <UserX className="h-4 w-4 mr-2" />
                Transfer Student
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentTransferModal;