import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { FileBarChart, Download, Search, Calendar, DollarSign, TrendingUp, Filter, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MOCK_BOOKINGS } from '@/data/mockBookings';
import { MOCK_STUDENTS, MOCK_SUPERVISORS } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
const Reports: React.FC = () => {
  const {
    user
  } = useAuth();
  const [bookingFilters, setBookingFilters] = useState({
    equipment: 'all',
    department: 'all',
    supervisor: 'all',
    student: 'all',
    dateStart: null as Date | null,
    dateEnd: null as Date | null
  });
  const [financialFilters, setFinancialFilters] = useState({
    supervisor: 'all',
    equipment: 'all',
    department: 'all',
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [financialSearchTerm, setFinancialSearchTerm] = useState('');
  const handleExportReport = (reportType: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${reportType} report. Download will begin shortly.`
    });
  };

  // Get students based on selected supervisor
  const getAvailableStudents = () => {
    if (bookingFilters.supervisor === 'all') {
      return MOCK_STUDENTS;
    }
    return MOCK_STUDENTS.filter(student => student.supervisorId === bookingFilters.supervisor);
  };

  // Reset student filter when supervisor changes
  const handleSupervisorChange = (value: string) => {
    setBookingFilters(prev => ({
      ...prev,
      supervisor: value,
      student: 'all' // Reset student filter when supervisor changes
    }));
  };

  // Get department based on supervisor name
  const getDepartmentForSupervisor = (supervisorName: string) => {
    if (supervisorName.includes('Wilson')) return 'Computer Science';
    if (supervisorName.includes('Chen')) return 'Engineering';
    if (supervisorName.includes('Rodriguez')) return 'Biology';
    return 'Unknown';
  };
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      approved: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20',
      completed: 'bg-primary/10 text-primary border-primary/20'
    };
    return <Badge className={`${variants[status as keyof typeof variants]} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>;
  };
  const mockFinancialData = [{
    id: '1',
    type: 'Purchase',
    supervisor: 'Dr. Sarah Wilson',
    equipment: 'Microscope Pro X1',
    department: 'Computer Science',
    amount: 250,
    date: '2024-01-15'
  }, {
    id: '2',
    type: 'Credit Allotment',
    supervisor: 'Prof. Michael Chen',
    equipment: 'N/A',
    department: 'Engineering',
    amount: 1000,
    date: '2024-01-14'
  }, {
    id: '3',
    type: 'Refund',
    supervisor: 'Dr. Emily Rodriguez',
    equipment: 'PCR Machine P200',
    department: 'Biology',
    amount: -75,
    date: '2024-01-13'
  }];
  const filteredBookings = MOCK_BOOKINGS.filter(booking => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      booking.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.supervisorName.toLowerCase().includes(searchTerm.toLowerCase());

    // Equipment filter
    const matchesEquipment = bookingFilters.equipment === 'all' || 
      booking.equipmentName.toLowerCase().includes(bookingFilters.equipment);

    // Department filter - assuming we need to match against supervisor's department
    const matchesDepartment = bookingFilters.department === 'all' || 
      (bookingFilters.department === 'cs' && booking.supervisorName.includes('Wilson')) ||
      (bookingFilters.department === 'eng' && booking.supervisorName.includes('Chen')) ||
      (bookingFilters.department === 'bio' && booking.supervisorName.includes('Rodriguez'));

    // Supervisor filter
    const matchesSupervisor = bookingFilters.supervisor === 'all' || 
      MOCK_SUPERVISORS.find(s => s.id === bookingFilters.supervisor)?.name === booking.supervisorName;

    // Student filter
    const matchesStudent = bookingFilters.student === 'all' || 
      MOCK_STUDENTS.find(s => s.id === bookingFilters.student)?.name === booking.studentName;

    // Date range filter
    const bookingDate = new Date(booking.date);
    const matchesDateStart = !bookingFilters.dateStart || bookingDate >= bookingFilters.dateStart;
    const matchesDateEnd = !bookingFilters.dateEnd || bookingDate <= bookingFilters.dateEnd;

    return matchesSearch && matchesEquipment && matchesDepartment && matchesSupervisor && matchesStudent && matchesDateStart && matchesDateEnd;
  });

  const filteredFinancialData = mockFinancialData.filter(transaction => {
    // Search filter
    const matchesSearch = financialSearchTerm === '' || 
      transaction.supervisor.toLowerCase().includes(financialSearchTerm.toLowerCase()) ||
      transaction.equipment.toLowerCase().includes(financialSearchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(financialSearchTerm.toLowerCase());

    // Supervisor filter
    const matchesSupervisor = financialFilters.supervisor === 'all' || 
      MOCK_SUPERVISORS.find(s => s.id === financialFilters.supervisor)?.name === transaction.supervisor;

    // Equipment filter
    const matchesEquipment = financialFilters.equipment === 'all' || 
      transaction.equipment.toLowerCase().includes(financialFilters.equipment);

    // Department filter
    const matchesDepartment = financialFilters.department === 'all' || 
      (financialFilters.department === 'cs' && transaction.department === 'Computer Science') ||
      (financialFilters.department === 'eng' && transaction.department === 'Engineering') ||
      (financialFilters.department === 'bio' && transaction.department === 'Biology');

    // Type filter
    const matchesType = financialFilters.type === 'all' || 
      (financialFilters.type === 'purchase' && transaction.type === 'Purchase') ||
      (financialFilters.type === 'refund' && transaction.type === 'Refund') ||
      (financialFilters.type === 'credit' && transaction.type === 'Credit Allotment');

    return matchesSearch && matchesSupervisor && matchesEquipment && matchesDepartment && matchesType;
  });
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <FileBarChart className="h-8 w-8 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate and analyze booking and financial reports
        </p>
      </div>

      <Tabs defaultValue="booking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="booking">Booking Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>

        {/* Booking Reports */}
        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Booking Reports</span>
                <Button onClick={() => handleExportReport('Booking')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardTitle>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Select value={bookingFilters.equipment} onValueChange={value => setBookingFilters(prev => ({
                  ...prev,
                  equipment: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Equipment</SelectItem>
                      <SelectItem value="microscope">Microscope Pro X1</SelectItem>
                      <SelectItem value="printer">3D Printer Delta</SelectItem>
                      <SelectItem value="oscilloscope">Oscilloscope OS500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select value={bookingFilters.department} onValueChange={value => setBookingFilters(prev => ({
                  ...prev,
                  department: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="eng">Engineering</SelectItem>
                      <SelectItem value="bio">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select value={bookingFilters.supervisor} onValueChange={handleSupervisorChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Supervisors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Supervisors</SelectItem>
                      {MOCK_SUPERVISORS.map(supervisor => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>
                          {supervisor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select value={bookingFilters.student} onValueChange={value => setBookingFilters(prev => ({
                  ...prev,
                  student: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Students" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      {getAvailableStudents().map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bookingFilters.dateStart && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingFilters.dateStart ? format(bookingFilters.dateStart, "PPP") : <span>From Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={bookingFilters.dateStart || undefined}
                        onSelect={(date) => setBookingFilters(prev => ({
                          ...prev,
                          dateStart: date || null
                        }))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bookingFilters.dateEnd && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingFilters.dateEnd ? format(bookingFilters.dateEnd, "PPP") : <span>To Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={bookingFilters.dateEnd || undefined}
                        onSelect={(date) => setBookingFilters(prev => ({
                          ...prev,
                          dateEnd: date || null
                        }))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="search" placeholder="Search bookings..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead>Equipment</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map(booking => <TableRow key={booking.id} className="table-row">
                        <TableCell>
                          <div className="font-medium">{booking.equipmentName}</div>
                          <div className="text-sm text-muted-foreground">{booking.slotName}</div>
                        </TableCell>
                        <TableCell>{booking.studentName}</TableCell>
                        <TableCell>{booking.supervisorName}</TableCell>
                        <TableCell>{getDepartmentForSupervisor(booking.supervisorName)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="font-medium">${booking.cost}</TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Reports */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Financial Reports</span>
                <Button onClick={() => handleExportReport('Financial')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardTitle>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="searchFinancial" 
                      placeholder="Search transactions..." 
                      className="pl-10" 
                      value={financialSearchTerm}
                      onChange={(e) => setFinancialSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Select value={financialFilters.supervisor} onValueChange={value => setFinancialFilters(prev => ({
                  ...prev,
                  supervisor: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Supervisors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Supervisors</SelectItem>
                      {MOCK_SUPERVISORS.map(supervisor => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>
                          {supervisor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select value={financialFilters.equipment} onValueChange={value => setFinancialFilters(prev => ({
                  ...prev,
                  equipment: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Equipment</SelectItem>
                      <SelectItem value="microscope">Microscope Pro X1</SelectItem>
                      <SelectItem value="printer">3D Printer Delta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select value={financialFilters.department} onValueChange={value => setFinancialFilters(prev => ({
                  ...prev,
                  department: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="eng">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select value={financialFilters.type} onValueChange={value => setFinancialFilters(prev => ({
                  ...prev,
                  type: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                      <SelectItem value="credit">Credit Allotment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead>Type</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFinancialData.map(transaction => <TableRow key={transaction.id} className="table-row">
                        <TableCell>
                          <Badge variant={transaction.type === 'Refund' ? 'destructive' : 'secondary'}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.supervisor}</TableCell>
                        <TableCell>{transaction.equipment}</TableCell>
                        <TableCell>{transaction.department}</TableCell>
                        <TableCell className={`font-medium ${transaction.amount < 0 ? 'text-destructive' : 'text-success'}`}>
                          ${Math.abs(transaction.amount)}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Equipment</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Utilization Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <FileBarChart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
       </div> */}
    </div>;
};
export default Reports;