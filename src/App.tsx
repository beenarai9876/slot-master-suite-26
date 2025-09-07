import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Supervisors from "@/pages/Supervisors";
import Reports from "@/pages/Reports";
import AddUser from "@/pages/AddUser";
import AddEquipment from "@/pages/AddEquipment";
import Profile from "@/pages/Profile";
import Instructions from "@/pages/Instructions";
import EquipmentBooking from "@/pages/EquipmentBooking";
import MyStudents from "@/pages/MyStudents";
import MyBookings from "@/pages/MyBookings";
import EquipmentCatalog from "@/pages/EquipmentCatalog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/supervisors" element={<Supervisors />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/add-equipment" element={<AddEquipment />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/booking" element={<EquipmentBooking />} />
              <Route path="/students" element={<MyStudents />} />
              <Route path="/catalog" element={<EquipmentCatalog />} />
              <Route path="/bookings" element={<MyBookings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder component for routes not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground">This page is under construction</p>
  </div>
);

export default App;
