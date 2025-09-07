import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  DollarSign, 
  Calendar, 
  BookOpen,
  TrendingUp,
  Eye,
  CreditCard,
  Plus,
  UserCheck,
  UserX,
  ArrowRightLeft
} from 'lucide-react';
import { MOCK_STUDENTS, MOCK_BOOKINGS } from '@/data/mockBookings';
import { toast } from '@/hooks/use-toast';
import StudentTransferModal from '@/components/StudentTransferModal';
import CreditAllocationModal from '@/components/CreditAllocationModal';

const MyStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleAllocateCredits = (student: any) => {
    setSelectedStudent(student);
    setIsCreditModalOpen(true);
  };

  const handleTransferStudent = (student: any) => {
    setSelectedStudent(student);
    setIsTransferModalOpen(true);
  };

  const handleCreditAllocation = (studentId: string, amount: number, notes: string) => {
    // Update student's credit in the local state (in real app, this would be an API call)
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, creditUsed: student.creditUsed + amount }
        : student
    ));
  };

  const handleStudentTransfer = (studentId: string, newSupervisorId: string, newSupervisorName: string) => {
    // Update student's supervisor in the local state (in real app, this would be an API call)
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, supervisorId: newSupervisorId, supervisorName: newSupervisorName }
        : student
    ));

    toast({
      title: "Student Transferred",
      description: `Student has been successfully transferred to ${newSupervisorName}`,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStudentBookings = (studentId: string) => {
    return MOCK_BOOKINGS.filter(booking => booking.studentId === studentId);
  };

  const getTotalStats = () => {
    const totalStudents = students.length;
    const totalCreditsUsed = students.reduce((sum, student) => sum + student.creditUsed, 0);
    const totalBookings = students.reduce((sum, student) => sum + student.totalBookings, 0);
    const activeBookings = students.reduce((sum, student) => sum + student.activeBookings, 0);

    return { totalStudents, totalCreditsUsed, totalBookings, activeBookings };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          My Students
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor your supervised students
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credits Used</p>
                <p className="text-2xl font-bold">${stats.totalCreditsUsed}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bookings</p>
                <p className="text-2xl font-bold">{stats.activeBookings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Student List</span>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Student</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Credits Used</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="table-row">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{student.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${student.creditUsed}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{student.totalBookings}</span> total
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium text-success">{student.activeBookings}</span> active
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success border-success/20">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAllocateCredits(student)}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Credits
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTransferStudent(student)}
                        >
                          <ArrowRightLeft className="h-4 w-4 mr-1" />
                          Transfer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No students found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {getInitials(selectedStudent?.name || '')}
                </AvatarFallback>
              </Avatar>
              {selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Booking History</TabsTrigger>
                <TabsTrigger value="credits">Credit History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{selectedStudent.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{selectedStudent.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span>{selectedStudent.department}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Activity Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Bookings:</span>
                        <span className="font-medium">{selectedStudent.totalBookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Bookings:</span>
                        <span className="font-medium text-success">{selectedStudent.activeBookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credits Used:</span>
                        <span className="font-medium">${selectedStudent.creditUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member Since:</span>
                        <span className="font-medium">Jan 2024</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                <div className="space-y-3">
                  {getStudentBookings(selectedStudent.id).map(booking => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{booking.equipmentName}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.date} • {booking.startTime}-{booking.endTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`mb-2 ${
                              booking.status === 'completed' ? 'bg-success/10 text-success border-success/20' :
                              booking.status === 'approved' ? 'bg-primary/10 text-primary border-primary/20' :
                              booking.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                              'bg-destructive/10 text-destructive border-destructive/20'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            <p className="text-sm font-medium">${booking.cost}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="credits" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Credit Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-lg">
                        <span>Total Credits Used:</span>
                        <span className="font-bold">${selectedStudent.creditUsed}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Recent activity and credit transactions would be displayed here.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Credit Allocation Modal */}
      <CreditAllocationModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        student={selectedStudent}
        onAllocate={handleCreditAllocation}
      />

      {/* Student Transfer Modal */}
      <StudentTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        student={selectedStudent}
        onTransfer={handleStudentTransfer}
      />
    </div>
  );
};

export default MyStudents;