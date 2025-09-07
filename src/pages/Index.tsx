import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard';
import SupervisorDashboard from '@/pages/SupervisorDashboard';
import StudentDashboard from '@/pages/StudentDashboard';

const Index = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  switch (user?.role) {
    case 'admin':
      return <Dashboard />;
    case 'supervisor':
      return <SupervisorDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="text-xl text-muted-foreground">Please login to continue.</p>
          </div>
        </div>
      );
  }
};

export default Index;
