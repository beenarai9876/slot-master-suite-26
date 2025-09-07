import React, { useState, useMemo } from 'react';
import { Equipment, TableColumn, EquipmentFilters } from '@/types/equipment';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Search, 
  Settings, 
  Wrench, 
  Edit, 
  Trash2,
  MoreHorizontal 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EquipmentTableProps {
  equipment: Equipment[];
  onUpdateStatus: (id: string, status: Equipment['status'], maintenanceDetails?: { reason: string; expectedWorkDate: string; startDate: string }) => void;
  onRemoveEquipment: (id: string) => void;
  onEditEquipment: (id: string) => void;
  onMaintenanceRequest: (equipment: Equipment) => void;
}

const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipment,
  onUpdateStatus,
  onRemoveEquipment,
  onEditEquipment,
  onMaintenanceRequest,
}) => {
  const [filters, setFilters] = useState<EquipmentFilters>({
    name: '',
    status: 'all',
  });

  const [columns, setColumns] = useState<TableColumn[]>([
    { key: 'name', label: 'Name', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'place', label: 'Place', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      return matchesName && matchesStatus;
    });
  }, [equipment, filters]);

  const visibleColumns = columns.filter(col => col.visible);

  const getStatusBadge = (status: Equipment['status']) => {
    const variants = {
      Active: 'status-active',
      Maintenance: 'status-maintenance',
      Retired: 'status-retired',
    };
    
    return (
      <Badge variant="outline" className={`${variants[status]} px-2 py-1 text-xs font-medium rounded-md`}>
        {status}
      </Badge>
    );
  };

  const handleStatusUpdate = (id: string, newStatus: Equipment['status']) => {
    const equipmentItem = equipment.find(item => item.id === id);
    
    if (newStatus === 'Maintenance' && equipmentItem) {
      // Trigger maintenance modal for admin role
      onMaintenanceRequest(equipmentItem);
    } else {
      onUpdateStatus(id, newStatus);
      toast({
        title: "Status Updated",
        description: `Equipment status changed to ${newStatus}`,
      });
    }
  };

  const handleRemoveEquipment = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from service?`)) {
      onRemoveEquipment(id);
      toast({
        title: "Equipment Removed",
        description: `${name} has been removed from service`,
        variant: "destructive",
      });
    }
  };

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Equipment Management
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                value={filters.name}
                onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select
            value={filters.status}
            onValueChange={(value) => 
              setFilters(prev => ({ ...prev, status: value as EquipmentFilters['status'] }))
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Columns
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
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                {visibleColumns.map((column) => (
                  <TableHead key={column.key} className="font-semibold">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id} className="table-row">
                  {visibleColumns.map((column) => (
                    <TableCell key={column.key}>
                      {column.key === 'name' && (
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          )}
                        </div>
                      )}
                      {column.key === 'status' && getStatusBadge(item.status)}
                      {column.key === 'place' && (
                        <div className="text-sm">{item.place}</div>
                      )}
                      {column.key === 'actions' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <div className="p-1 space-y-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditEquipment(item.id)}
                                className="w-full justify-start"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              
                              <Select
                                value={item.status}
                                onValueChange={(value) => 
                                  handleStatusUpdate(item.id, value as Equipment['status'])
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Set Active</SelectItem>
                                  <SelectItem value="Maintenance">Set Maintenance</SelectItem>
                                  <SelectItem value="Retired">Set Retired</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEquipment(item.id, item.name)}
                                className="w-full justify-start text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from Service
                              </Button>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredEquipment.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No equipment found matching your filters.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentTable;