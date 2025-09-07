import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileEdit, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  History,
  Save,
  X
} from 'lucide-react';
import { MOCK_INSTRUCTIONS } from '@/data/mockBookings';
import { toast } from '@/hooks/use-toast';

interface InstructionFormData {
  title: string;
  content: string;
  targetRole: 'all' | 'supervisor' | 'student';
}

const Instructions: React.FC = () => {
  const { user } = useAuth();
  const [instructions, setInstructions] = useState(MOCK_INSTRUCTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'supervisor' | 'student' | 'any'>('any');
  const [selectedInstruction, setSelectedInstruction] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<InstructionFormData>({
    title: '',
    content: '',
    targetRole: 'all'
  });

  const canEditInstructions = user?.role === 'admin' || user?.role === 'supervisor';

  const filteredInstructions = instructions.filter(instruction => {
    const matchesSearch = searchTerm === '' || 
      instruction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instruction.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'any' || 
      instruction.targetRole === 'all' || 
      instruction.targetRole === filterRole ||
      (user?.role === filterRole);
    
    return matchesSearch && matchesRole;
  });

  const handleCreateInstruction = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newInstruction = {
      id: (instructions.length + 1).toString(),
      title: formData.title,
      content: formData.content,
      authorId: user?.id || '1',
      authorName: user?.name || 'Unknown',
      targetRole: formData.targetRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setInstructions(prev => [newInstruction, ...prev]);
    
    toast({
      title: "Instruction Created",
      description: `"${formData.title}" has been published`,
    });

    setFormData({ title: '', content: '', targetRole: 'all' });
    setIsCreateModalOpen(false);
  };

  const handleUpdateInstruction = async () => {
    if (!selectedInstruction) return;

    setInstructions(prev => 
      prev.map(inst => 
        inst.id === selectedInstruction.id 
          ? { 
              ...inst, 
              title: formData.title,
              content: formData.content,
              targetRole: formData.targetRole,
              updatedAt: new Date().toISOString()
            }
          : inst
      )
    );

    toast({
      title: "Instruction Updated",
      description: `"${formData.title}" has been updated`,
    });

    setIsEditing(false);
    setIsViewModalOpen(false);
    setSelectedInstruction(null);
  };

  const handleDeleteInstruction = (id: string) => {
    const instruction = instructions.find(inst => inst.id === id);
    if (instruction && window.confirm(`Delete "${instruction.title}"?`)) {
      setInstructions(prev => prev.filter(inst => inst.id !== id));
      toast({
        title: "Instruction Deleted",
        description: `"${instruction.title}" has been removed`,
        variant: "destructive"
      });
    }
  };

  const openViewModal = (instruction: any) => {
    setSelectedInstruction(instruction);
    setFormData({
      title: instruction.title,
      content: instruction.content,
      targetRole: instruction.targetRole
    });
    setIsViewModalOpen(true);
    setIsEditing(false);
  };

  const openCreateModal = () => {
    setFormData({ title: '', content: '', targetRole: 'all' });
    setIsCreateModalOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      all: 'bg-primary/10 text-primary border-primary/20',
      supervisor: 'bg-warning/10 text-warning border-warning/20',
      student: 'bg-success/10 text-success border-success/20'
    };
    
    return (
      <Badge className={`${variants[role as keyof typeof variants]} border text-xs`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileEdit className="h-8 w-8 text-primary" />
            Instructions & Notices
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'student' 
              ? 'View important instructions and notices' 
              : 'Manage system instructions and notices'
            }
          </p>
        </div>

        {canEditInstructions && (
          <Button onClick={openCreateModal} className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Instruction
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search instructions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select
              value={filterRole}
              onValueChange={(value) => setFilterRole(value as typeof filterRole)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All Instructions</SelectItem>
                <SelectItem value="all">For Everyone</SelectItem>
                <SelectItem value="supervisor">For Supervisors</SelectItem>
                <SelectItem value="student">For Students</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Instructions List */}
      <div className="grid gap-4">
        {filteredInstructions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileEdit className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No instructions found</p>
            </CardContent>
          </Card>
        ) : (
          filteredInstructions.map((instruction) => (
            <Card key={instruction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{instruction.title}</h3>
                      {getRoleBadge(instruction.targetRole)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {instruction.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(instruction.createdAt)}
                      </div>
                      {instruction.updatedAt !== instruction.createdAt && (
                        <div className="flex items-center gap-1">
                          <History className="h-4 w-4" />
                          Updated {formatDate(instruction.updatedAt)}
                        </div>
                      )}
                    </div>

                    <div 
                      className="text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: instruction.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' 
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewModal(instruction)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>

                    {canEditInstructions && (instruction.authorId === user?.id || user?.role === 'admin') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInstruction(instruction.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Instruction Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Instruction</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter instruction title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target Audience *</Label>
                <Select
                  value={formData.targetRole}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, targetRole: value as InstructionFormData['targetRole'] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="supervisor">Supervisors Only</SelectItem>
                    <SelectItem value="student">Students Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter instruction content (HTML supported)"
                rows={10}
                className="resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                HTML tags are supported for formatting (h1, h2, h3, p, ul, ol, li, strong, em, etc.)
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateInstruction} className="bg-gradient-primary hover:opacity-90">
                <Save className="h-4 w-4 mr-2" />
                Publish Instruction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View/Edit Instruction Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{isEditing ? 'Edit Instruction' : selectedInstruction?.title}</span>
              <div className="flex items-center gap-2">
                {selectedInstruction && getRoleBadge(selectedInstruction.targetRole)}
                {canEditInstructions && (selectedInstruction?.authorId === user?.id || user?.role === 'admin') && !isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedInstruction && (
            <div className="space-y-6">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedInstruction.authorName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedInstruction.createdAt)}
                    </div>
                    {selectedInstruction.updatedAt !== selectedInstruction.createdAt && (
                      <div className="flex items-center gap-1">
                        <History className="h-4 w-4" />
                        Updated {formatDate(selectedInstruction.updatedAt)}
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedInstruction.content }}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editTitle">Title *</Label>
                      <Input
                        id="editTitle"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="editTarget">Target Audience *</Label>
                      <Select
                        value={formData.targetRole}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, targetRole: value as InstructionFormData['targetRole'] }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Everyone</SelectItem>
                          <SelectItem value="supervisor">Supervisors Only</SelectItem>
                          <SelectItem value="student">Students Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editContent">Content *</Label>
                    <Textarea
                      id="editContent"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={10}
                      className="resize-none font-mono text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateInstruction} className="bg-gradient-primary hover:opacity-90">
                      <Save className="h-4 w-4 mr-2" />
                      Update Instruction
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Instructions;