import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { MOCK_STUDENTS, MOCK_BOOKINGS } from '@/data/mockBookings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Modal states
  const [approveModal, setApproveModal] = useState<{ open: boolean; booking: any | null }>({
    open: false,
    booking: null
  });
  const [rejectModal, setRejectModal] = useState<{ open: boolean; booking: any | null }>({
    open: false,
    booking: null
  });
  const [approveNotes, setApproveNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  
  // Filter data for current supervisor
  const myStudents = MOCK_STUDENTS.filter(student => student.supervisorId === user?.id);
  const todayBookings = MOCK_BOOKINGS.filter(booking => 
    booking.date === new Date().toISOString().split('T')[0]
  );
  const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === 'pending');
  
  // Get upcoming bookings (future dates and approved/pending status)
  const today = new Date().toISOString().split('T')[0];
  const upcomingBookings = MOCK_BOOKINGS.filter(booking => 
    booking.date >= today && (booking.status === 'approved' || booking.status === 'pending')
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Handler functions
  const handleApproveClick = (booking: any) => {
    setApproveModal({ open: true, booking });
    setApproveNotes('');
  };

  const handleRejectClick = (booking: any) => {
    setRejectModal({ open: true, booking });
    setRejectReason('');
    setRejectNotes('');
  };

  const handleApproveBooking = () => {
    // Here you would typically make an API call to approve the booking
    toast({
      title: "Booking Approved",
      description: `Booking for ${approveModal.booking?.equipmentName} has been approved.`,
    });
    setApproveModal({ open: false, booking: null });
  };

  const handleRejectBooking = () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this booking.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically make an API call to reject the booking
    toast({
      title: "Booking Rejected",
      description: `Booking for ${rejectModal.booking?.equipmentName} has been rejected.`,
    });
    setRejectModal({ open: false, booking: null });
  };
  
  const stats = [
    {
      title: 'My Students',
      value: myStudents.length.toString(),
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: "Today's Bookings",
      value: todayBookings.length.toString(),
      icon: Calendar,
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      title: 'Pending Approvals',
      value: pendingBookings.length.toString(),
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
    {
      title: 'Available Credit',
      value: '$2,450',
      icon: DollarSign,
      color: 'text-accent',
      bg: 'bg-accent/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here's your supervision overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{booking.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.equipmentName} • {booking.date} • {booking.startTime}-{booking.endTime}
                    </p>
                  </div>
                  <Badge 
                    variant={booking.status === 'approved' ? 'default' : 
                            booking.status === 'pending' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming bookings</p>
                <p className="text-sm">All upcoming bookings will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      {pendingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Booking Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingBookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{booking.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.equipmentName} • {booking.date} • {booking.startTime}-{booking.endTime}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-success hover:bg-success/90"
                      onClick={() => handleApproveClick(booking)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRejectClick(booking)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Approve Booking Modal */}
      <Dialog open={approveModal.open} onOpenChange={(open) => setApproveModal({ open, booking: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Approve Booking
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {approveModal.booking?.equipmentName} - {approveModal.booking?.studentName}
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="approve-notes"
                placeholder="Any additional notes or instructions..."
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setApproveModal({ open: false, booking: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApproveBooking}
              className="bg-success hover:bg-success/90"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Booking Modal */}
      <Dialog open={rejectModal.open} onOpenChange={(open) => setRejectModal({ open, booking: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Reject Booking
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {rejectModal.booking?.equipmentName} - {rejectModal.booking?.studentName}
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Textarea
                id="reject-reason"
                placeholder="Please provide a reason for rejecting this booking..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-2"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="reject-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="reject-notes"
                placeholder="Any additional notes or instructions..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setRejectModal({ open: false, booking: null })}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRejectBooking}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Reject Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupervisorDashboard;