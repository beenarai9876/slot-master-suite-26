import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, MoreHorizontal, UserCheck, Trash2, DollarSign } from 'lucide-react';
import { MOCK_SUPERVISORS, MOCK_STUDENTS } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import ManageStudentsModal from '@/components/ManageStudentsModal';
import CreditAllocationModal from '@/components/CreditAllocationModal';
const Supervisors: React.FC = () => {
  const [supervisors, setSupervisors] = useState(MOCK_SUPERVISORS);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [filters, setFilters] = useState({
    name: '',
    department: 'all'
  });
  const [manageStudentsModalOpen, setManageStudentsModalOpen] = useState(false);
  const [creditAllocationModalOpen, setCreditAllocationModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const departments = [...new Set(supervisors.map(s => s.department))];
  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesName = supervisor.name.toLowerCase().includes(filters.name.toLowerCase()) || supervisor.email.toLowerCase().includes(filters.name.toLowerCase());
    const matchesDepartment = filters.department === 'all' || supervisor.department === filters.department;
    return matchesName && matchesDepartment;
  });
  const handleManage = (id: string, name: string) => {
    const supervisor = supervisors.find(s => s.id === id);
    setSelectedSupervisor(supervisor);
    setManageStudentsModalOpen(true);
  };

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setSupervisors(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Supervisor Removed",
        description: `${name} has been removed from the system`,
        variant: "destructive"
      });
    }
  };

  const handleAllocateCredits = (id: string, name: string) => {
    const supervisor = supervisors.find(s => s.id === id);
    const supervisorStudents = students.filter(s => s.supervisorId === id);
    
    if (supervisorStudents.length === 0) {
      toast({
        title: "No Students Found",
        description: `${name} has no students assigned for credit allocation`,
        variant: "destructive"
      });
      return;
    }

    // For now, select the first student - in a real app you'd show a student selector
    setSelectedStudent(supervisorStudents[0]);
    setSelectedSupervisor(supervisor);
    setCreditAllocationModalOpen(true);
  };

  const handleTransferStudent = (studentId: string, newSupervisorId: string, newSupervisorName: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, supervisorId: newSupervisorId, supervisorName: newSupervisorName }
        : student
    ));
    
    toast({
      title: "Student Transferred",
      description: `Student has been transferred to ${newSupervisorName}`,
    });
  };

  const handleCreditAllocation = (studentId: string, amount: number, notes: string) => {
    // Update student's credit usage
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, creditUsed: student.creditUsed + amount }
        : student
    ));
    
    setCreditAllocationModalOpen(false);
    setSelectedStudent(null);
    setSelectedSupervisor(null);
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Supervisor Management
        </h1>
        <p className="text-muted-foreground mt-1">Manage supervisor accounts and credit allocations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supervisors</CardTitle>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or email..." value={filters.name} onChange={e => setFilters(prev => ({
                ...prev,
                name: e.target.value
              }))} className="pl-10" />
              </div>
            </div>
            
            <Select value={filters.department} onValueChange={value => setFilters(prev => ({
            ...prev,
            department: value
          }))}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupervisors.map(supervisor => <TableRow key={supervisor.id} className="table-row">
                    <TableCell>
                      <div className="font-medium">{supervisor.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{supervisor.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{supervisor.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success/10 text-success font-medium">
                        ${supervisor.amount.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{supervisor.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <div className="p-1 space-y-1">
                            <Button variant="ghost" size="sm" onClick={() => handleManage(supervisor.id, supervisor.name)} className="w-full justify-start">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Manage Students
                            </Button>
                            
                            <Button variant="ghost" size="sm" onClick={() => handleAllocateCredits(supervisor.id, supervisor.name)} className="w-full justify-start">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Allocate Credits
                            </Button>
                            
                            <Button variant="ghost" size="sm" onClick={() => handleRemove(supervisor.id, supervisor.name)} className="w-full justify-start text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
            
            {filteredSupervisors.length === 0 && <div className="text-center py-8 text-muted-foreground">
                No supervisors found matching your filters.
              </div>}
          </div>
        </CardContent>
      </Card>

      {/* Manage Students Modal */}
      <ManageStudentsModal
        isOpen={manageStudentsModalOpen}
        onClose={() => {
          setManageStudentsModalOpen(false);
          setSelectedSupervisor(null);
        }}
        supervisor={selectedSupervisor}
        onTransferStudent={handleTransferStudent}
      />

      {/* Credit Allocation Modal */}
      <CreditAllocationModal
        isOpen={creditAllocationModalOpen}
        onClose={() => {
          setCreditAllocationModalOpen(false);
          setSelectedStudent(null);
          setSelectedSupervisor(null);
        }}
        student={selectedStudent}
        onAllocate={handleCreditAllocation}
      />
    </div>;
};
export default Supervisors;