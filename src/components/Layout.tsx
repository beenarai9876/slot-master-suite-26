import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './Sidebar';
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
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Equipment Portal</h2>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
          <footer className="bg-card border-t border-border px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span>© {new Date().getFullYear()} Copyright IIT Jodhpur</span>
              </div>
              <div className="flex items-center">
                <span>Developed by ByteBusterX</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;