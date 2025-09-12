import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  LayoutDashboard, 
  Users, 
  FileBarChart, 
  UserPlus, 
  Wrench, 
  User, 
  FileEdit,
  Calendar,
  BookOpen,
  Search,
  LogOut,
  ChevronRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Supervisors', path: '/supervisors' },
    { icon: FileBarChart, label: 'Reports', path: '/reports' },
    { icon: UserPlus, label: 'Add User', path: '/add-user' },
    { icon: Wrench, label: 'Add Equipment', path: '/add-equipment' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: FileEdit, label: 'Instructions', path: '/instructions' },
  ];

  const supervisorMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Equipment Booking', path: '/booking' },
    { icon: Users, label: 'My Students', path: '/students' },
    { icon: FileBarChart, label: 'Reports', path: '/reports' },
    { icon: BookOpen, label: 'Instructions', path: '/instructions' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const studentMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'My Bookings', path: '/bookings' },
    { icon: Search, label: 'Equipment Booking', path: '/catalog' },
    { icon: BookOpen, label: 'Instructions', path: '/instructions' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminMenuItems;
      case 'supervisor':
        return supervisorMenuItems;
      case 'student':
        return studentMenuItems;
      default:
        return [];
    }
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="p-2 bg-sidebar-primary rounded-lg">
          <Building className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">Equipment Portal</h1>
          <p className="text-sm text-sidebar-foreground/70 capitalize">{user?.role} Dashboard</p>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sidebar-accent rounded-full">
            <User className="h-4 w-4 text-sidebar-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {getMenuItems().map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' 
                  : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }
              `}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </NavLink>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Logout */}
      <div className="p-4">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;