import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Login from './Login';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      <footer className="bg-primary text-primary-foreground">
        <div className="px-6 py-4 flex items-center justify-between text-sm">
          <div>
            Copyright © 2024 Indian Institute of Technology Jodhpur. All Rights Reserved. Credits & Attribution
          </div>
          <div>
            Developed by JSR Infotech
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;