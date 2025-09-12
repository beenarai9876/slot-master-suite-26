import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
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

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();

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

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-4">
          <div className="p-2 bg-sidebar-primary rounded-lg">
            <Building className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {state !== "collapsed" && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Equipment Portal</h1>
              <p className="text-sm text-sidebar-foreground/70 capitalize">{user?.role} Dashboard</p>
            </div>
          )}
        </div>
        
        {state !== "collapsed" && (
          <div className="p-4 border-t border-sidebar-border">
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
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.path);
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.path} className={getNavClassName}>
                        <Icon className="h-4 w-4" />
                        {state !== "collapsed" && <span>{item.label}</span>}
                        {isActive && state !== "collapsed" && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut className="h-4 w-4" />
          {state !== "collapsed" && <span className="ml-3">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;