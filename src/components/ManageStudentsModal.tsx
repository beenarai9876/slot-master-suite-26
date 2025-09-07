import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserMinus, DollarSign, Calendar, ArrowRightLeft } from 'lucide-react';
import { MOCK_STUDENTS } from '@/data/mockData';
import StudentTransferModal from './StudentTransferModal';

interface ManageStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  supervisor: any;
  onTransferStudent: (studentId: string, newSupervisorId: string, newSupervisorName: string) => void;
}

const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  isOpen,
  onClose,
  supervisor,
  onTransferStudent
}) => {
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const supervisorStudents = MOCK_STUDENTS.filter(student => student.supervisorId === supervisor?.id);

  const handleTransferClick = (student: any) => {
    setSelectedStudent(student);
    setTransferModalOpen(true);
  };

  const handleTransfer = (studentId: string, newSupervisorId: string, newSupervisorName: string) => {
    onTransferStudent(studentId, newSupervisorId, newSupervisorName);
    setTransferModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Students - {supervisor?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col flex-1 overflow-hidden space-y-4">
            {/* Fixed Supervisor Info */}
            <Card className="flex-shrink-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {getInitials(supervisor?.name || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{supervisor?.name}</p>
                      <p className="text-sm text-muted-foreground">{supervisor?.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold text-primary">{supervisorStudents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scrollable Students List */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pr-2 space-y-3">
                {supervisorStudents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No students assigned to this supervisor</p>
                  </div>
                ) : (
                  supervisorStudents.map(student => (
                    <Card key={student.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-muted text-muted-foreground">
                                {getInitials(student.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            {/* Student Stats */}
                            <div className="flex gap-4 text-sm">
                              <div className="text-center">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span className="font-medium">${student.creditUsed}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Credits Used</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span className="font-medium">{student.totalBookings}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Total Bookings</p>
                              </div>
                            </div>

                            {/* Department Badge */}
                            <Badge variant="outline" className="shrink-0">
                              {student.department}
                            </Badge>

                            {/* Transfer Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTransferClick(student)}
                              className="flex items-center gap-2"
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                              Transfer
                            </Button>
                          </div>
                        </div>

                        {/* Active Bookings */}
                        {student.activeBookings > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-success rounded-full"></div>
                              <span className="text-sm text-muted-foreground">
                                {student.activeBookings} active booking{student.activeBookings > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Fixed Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t flex-shrink-0">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Modal */}
      <StudentTransferModal
        isOpen={transferModalOpen}
        onClose={() => {
          setTransferModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onTransfer={handleTransfer}
      />
    </>
  );
};

export default ManageStudentsModal;