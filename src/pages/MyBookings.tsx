import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Calendar, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Grid3X3,
  List,
  ArrowUpDown,
  Settings,
  Download,
  FileText,
  Eye,
  Columns
} from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_STUDENTS } from '@/data/mockBookings';
import { useAuth } from '@/contexts/AuthContext';

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [sortColumn, setSortColumn] = useState<string>('equipmentName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [columns, setColumns] = useState([
    { key: 'equipmentName', label: 'Name', visible: true },
    { key: 'department', label: 'Department', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'startTime', label: 'From', visible: true },
    { key: 'endTime', label: 'Till', visible: true },
    { key: 'cost', label: 'Credits Used', visible: true },
  ]);

  // Filter bookings for current student
  const myBookings = MOCK_BOOKINGS.filter(booking => booking.studentName === user?.name);

  // Get student department
  const studentData = MOCK_STUDENTS.find(student => student.name === user?.name);
  const studentDepartment = studentData?.department || 'Unknown';

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = myBookings.filter(booking => {
      const matchesSearch = booking.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter === 'upcoming') {
        matchesDate = new Date(booking.date) >= new Date() && booking.status === 'approved';
      } else if (dateFilter === 'past') {
        matchesDate = new Date(booking.date) < new Date();
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort bookings
    filtered.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortColumn) {
        case 'equipmentName':
          aValue = a.equipmentName;
          bValue = b.equipmentName;
          break;
        case 'department':
          aValue = studentDepartment;
          bValue = studentDepartment;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'startTime':
          aValue = `${a.date} ${a.startTime}`;
          bValue = `${b.date} ${b.startTime}`;
          break;
        case 'endTime':
          aValue = `${a.date} ${a.endTime}`;
          bValue = `${b.date} ${b.endTime}`;
          break;
        case 'cost':
          aValue = a.cost;
          bValue = b.cost;
          break;
        default:
          aValue = a.equipmentName;
          bValue = b.equipmentName;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [myBookings, searchTerm, statusFilter, dateFilter, sortColumn, sortDirection, studentDepartment]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <Clock className="h-4 w-4 text-warning" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-primary" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const visibleColumns = columns.filter(col => col.visible);

  const exportToCSV = () => {
    const headers = visibleColumns.map(col => col.label).join(',');
    const rows = filteredAndSortedBookings.map(booking => {
      return visibleColumns.map(col => {
        switch(col.key) {
          case 'equipmentName': return booking.equipmentName;
          case 'department': return studentDepartment;
          case 'status': return booking.status;
          case 'startTime': return `${booking.date} ${booking.startTime}`;
          case 'endTime': return `${booking.date} ${booking.endTime}`;
          case 'cost': return booking.cost;
          default: return '';
        }
      }).join(',');
    }).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `my-bookings-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Create a simple HTML table for PDF export
    const tableRows = filteredAndSortedBookings.map(booking => `
      <tr>
        <td>${booking.equipmentName}</td>
        <td>${studentDepartment}</td>
        <td>${booking.status}</td>
        <td>${booking.date} ${booking.startTime}</td>
        <td>${booking.date} ${booking.endTime}</td>
        <td>$${booking.cost}</td>
      </tr>
    `).join('');
    
    const htmlContent = `
      <html>
        <head>
          <title>My Bookings Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>My Bookings Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-bookings-${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          My Bookings
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage your equipment booking history
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Equipment</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by equipment name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">View</label>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex-1"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="flex-1"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Table
                </Button>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Bookings Display */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Booking History ({filteredAndSortedBookings.length})</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Export Controls */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={exportToCSV}
                    className="cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={exportToPDF}
                    className="cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Column Controls - Only show in table view */}
              {viewMode === 'table' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {columns.map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.key}
                        checked={column.visible}
                        onCheckedChange={() => toggleColumn(column.key)}
                      >
                        {column.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No bookings found matching your filters.</p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredAndSortedBookings.map((booking) => (
                <div key={booking.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(booking.status)}
                      <div>
                        <h3 className="font-semibold">{booking.equipmentName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.date} • {booking.startTime} - {booking.endTime}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cost: ${booking.cost}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(booking.status)} mb-2`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Booked: {booking.bookedAt}
                      </p>
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-warning">⏳ Awaiting supervisor approval</p>
                    </div>
                  )}
                  
                  {booking.status === 'rejected' && booking.rejectionReason && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-destructive">
                        <strong>Rejection Reason:</strong> {booking.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    {visibleColumns.map((column) => (
                      <TableHead key={column.key}>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort(column.key)}
                          className="h-auto p-0 font-semibold flex items-center gap-1"
                        >
                          {column.label}
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedBookings.map((booking) => (
                    <TableRow key={booking.id} className="table-row">
                      {visibleColumns.map((column) => (
                        <TableCell key={column.key}>
                          {column.key === 'equipmentName' && (
                            <div className="font-medium">{booking.equipmentName}</div>
                          )}
                          {column.key === 'department' && (
                            <div className="text-sm">{studentDepartment}</div>
                          )}
                          {column.key === 'status' && (
                            <div className="flex items-center gap-2">
                              {getStatusIcon(booking.status)}
                              <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </div>
                          )}
                          {column.key === 'startTime' && (
                            <div className="text-sm">
                              {booking.date}
                              <br />
                              <span className="text-muted-foreground">{booking.startTime}</span>
                            </div>
                          )}
                          {column.key === 'endTime' && (
                            <div className="text-sm">
                              {booking.date}
                              <br />
                              <span className="text-muted-foreground">{booking.endTime}</span>
                            </div>
                          )}
                          {column.key === 'cost' && (
                            <div className="font-medium">${booking.cost}</div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBookings;