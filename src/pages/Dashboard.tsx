import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EquipmentTable from '@/components/EquipmentTable';
import EditEquipmentModal from '@/components/EditEquipmentModal';
import MaintenanceModal from '@/components/MaintenanceModal';
import { MOCK_EQUIPMENT } from '@/data/mockData';
import { Equipment } from '@/types/equipment';
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  FileBarChart,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>(MOCK_EQUIPMENT);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [equipmentForMaintenance, setEquipmentForMaintenance] = useState<Equipment | null>(null);

  const handleUpdateStatus = (id: string, status: Equipment['status'], maintenanceDetails?: { reason: string; expectedWorkDate: string; startDate: string }) => {
    setEquipment(prev =>
      prev.map(item =>
        item.id === id 
          ? { 
              ...item, 
              status,
              maintenanceDetails: status === 'Maintenance' ? maintenanceDetails : undefined
            } 
          : item
      )
    );
  };

  const handleRemoveEquipment = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const handleEditEquipment = (id: string) => {
    const equipmentToEdit = equipment.find(item => item.id === id);
    if (equipmentToEdit) {
      setSelectedEquipment(equipmentToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEquipment = (updatedEquipment: Equipment) => {
    setEquipment(prev =>
      prev.map(item =>
        item.id === updatedEquipment.id ? updatedEquipment : item
      )
    );
    
    toast({
      title: "Equipment Updated",
      description: `${updatedEquipment.name} has been successfully updated`,
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleMaintenanceRequest = (equipment: Equipment) => {
    setEquipmentForMaintenance(equipment);
    setIsMaintenanceModalOpen(true);
  };

  const handleMaintenanceConfirm = (reason: string, expectedDate: string) => {
    if (equipmentForMaintenance) {
      const maintenanceDetails = {
        reason,
        expectedWorkDate: expectedDate,
        startDate: new Date().toISOString().split('T')[0]
      };
      
      handleUpdateStatus(equipmentForMaintenance.id, 'Maintenance', maintenanceDetails);
      
      toast({
        title: "Equipment Set to Maintenance",
        description: `${equipmentForMaintenance.name} has been set to maintenance status`,
      });
    }
    setIsMaintenanceModalOpen(false);
    setEquipmentForMaintenance(null);
  };

  const handleMaintenanceCancel = () => {
    setIsMaintenanceModalOpen(false);
    setEquipmentForMaintenance(null);
  };

  const stats = React.useMemo(() => {
    const total = equipment.length;
    const active = equipment.filter(e => e.status === 'Active').length;
    const maintenance = equipment.filter(e => e.status === 'Maintenance').length;
    const retired = equipment.filter(e => e.status === 'Retired').length;
    
    return { total, active, maintenance, retired };
  }, [equipment]);

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          subtitle: 'Manage equipment, supervisors, and system settings'
        };
      case 'supervisor':
        return {
          title: 'Supervisor Dashboard',
          subtitle: 'Manage bookings and oversee your students'
        };
      case 'student':
        return {
          title: 'My Bookings',
          subtitle: 'View your booking history and equipment access'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to the equipment portal'
        };
    }
  };

  const { title, subtitle } = getWelcomeMessage();

  const statCards = [
    {
      title: 'Total Equipment',
      value: stats.total,
      icon: Wrench,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Active Equipment',
      value: stats.active,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Under Maintenance',
      value: stats.maintenance,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Retired Equipment',
      value: stats.retired,
      icon: TrendingUp,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-semibold">{user?.name}</p>
        </div>
      </div>

      {/* Stats Cards - Show for admin and supervisor */}
      {(user?.role === 'admin' || user?.role === 'supervisor') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Equipment Table - Admin and Supervisor view */}
      {(user?.role === 'admin' || user?.role === 'supervisor') && (
        <EquipmentTable
          equipment={equipment}
          onUpdateStatus={handleUpdateStatus}
          onRemoveEquipment={handleRemoveEquipment}
          onEditEquipment={handleEditEquipment}
          onMaintenanceRequest={handleMaintenanceRequest}
        />
      )}

      {/* Student Dashboard */}
      {user?.role === 'student' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No bookings found</p>
                <p className="text-sm">Start by browsing the equipment catalog</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Bookings</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Credits Used</span>
                  <Badge variant="secondary">$0</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Supervisor Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{user?.department || 'Not assigned'}</p>
                  
                  <p className="text-sm text-muted-foreground mt-4">Supervisor</p>
                  <p className="font-medium">Dr. Sarah Wilson</p>
                  <p className="text-sm text-muted-foreground">sarah.wilson@university.edu</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      <EditEquipmentModal
        equipment={selectedEquipment}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEquipment}
      />

      {/* Maintenance Modal */}
      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={handleMaintenanceCancel}
        onConfirm={handleMaintenanceConfirm}
        equipmentName={equipmentForMaintenance?.name || ''}
      />
    </div>
  );
};

export default Dashboard;