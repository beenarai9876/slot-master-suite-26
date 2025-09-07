import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Activity,
  Search,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { MOCK_BOOKINGS } from '@/data/mockBookings';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Filter data for current student
  const myBookings = MOCK_BOOKINGS.filter(booking => booking.studentName === user?.name);
  const upcomingBookings = myBookings.filter(b => b.status === 'approved' && new Date(b.date) >= new Date());
  const pendingBookings = myBookings.filter(b => b.status === 'pending');
  
  const stats = [
    {
      title: 'Total Bookings',
      value: myBookings.length.toString(),
      icon: Calendar,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Upcoming',
      value: upcomingBookings.length.toString(),
      icon: Clock,
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      title: 'Pending Approval',
      value: pendingBookings.length.toString(),
      icon: AlertCircle,
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
    {
      title: 'Credit Balance',
      value: '$245',
      icon: DollarSign,
      color: 'text-accent',
      bg: 'bg-accent/10'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <Clock className="h-4 w-4 text-warning" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here's your booking overview.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myBookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(booking.status)}
                    <div>
                      <p className="font-medium text-sm">{booking.equipmentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.date} • {booking.startTime}-{booking.endTime}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={booking.status === 'approved' ? 'default' : 
                            booking.status === 'pending' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Browse Equipment Catalog
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View My Bookings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Read Instructions
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Check Credit Balance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-success" />
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-success/20 bg-success/5 rounded-lg">
                  <div>
                    <p className="font-medium">{booking.equipmentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.date} • {booking.startTime}-{booking.endTime}
                    </p>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Confirmed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Approvals */}
      {pendingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Awaiting Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingBookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-warning/20 bg-warning/5 rounded-lg">
                  <div>
                    <p className="font-medium">{booking.equipmentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.date} • {booking.startTime}-{booking.endTime}
                    </p>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    Pending
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;