import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Save, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
interface UserFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  userType: 'admin' | 'supervisor' | 'student';
  supervisorId?: string;
  initialCredits?: number;
}
const AddUser: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    department: '',
    userType: 'student',
    supervisorId: '',
    initialCredits: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const departments = ['Computer Science', 'Engineering', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Mechanical Engineering', 'Electrical Engineering'];
  const supervisors = [{
    id: '2',
    name: 'John Supervisor',
    department: 'Engineering'
  }, {
    id: '5',
    name: 'Dr. Sarah Wilson',
    department: 'Computer Science'
  }, {
    id: '6',
    name: 'Prof. Michael Chen',
    department: 'Engineering'
  }];
  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.email || !formData.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "User Created Successfully",
      description: `${formData.name} has been added as a ${formData.userType}`
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      userType: 'student',
      supervisorId: '',
      initialCredits: 0
    });
    setIsSubmitting(false);
  };
  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      userType: 'student',
      supervisorId: '',
      initialCredits: 0
    });
    toast({
      title: "Form Reset",
      description: "All fields have been cleared"
    });
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          Add New User
        </h1>
        <p className="text-muted-foreground mt-1">
          Create a new user account for the equipment portal
        </p>
      </div>

      <div className="max-w-2xl mx-auto" /*Align attribute - text over the text box*/>
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input id="name" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Enter full name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="user@university.edu" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="+1-555-0123" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.department} onValueChange={value => handleInputChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* User Type */}
              <div className="space-y-2">
                <Label htmlFor="userType">
                  User Type <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.userType} onValueChange={value => handleInputChange('userType', value as UserFormData['userType'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    {/* <SelectItem value="student">Student</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {/* Student-specific fields */}
              {/* {formData.userType === 'student' && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">Student Settings</h4>
                  <div className="space-y-2">
                    <Label htmlFor="supervisor">Assign Supervisor</Label>
                    <Select
                      value={formData.supervisorId}
                      onValueChange={(value) => handleInputChange('supervisorId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {supervisors
                          .filter(sup => sup.department === formData.department)
                          .map(supervisor => (
                            <SelectItem key={supervisor.id} value={supervisor.id}>
                              {supervisor.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
               )} */}

              {/* Supervisor-specific fields */}
              {/* {formData.userType === 'supervisor' && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">Supervisor Settings</h4>
                  <div className="space-y-2">
                    <Label htmlFor="initialCredits">Initial Credit Amount ($)</Label>
                    <Input
                      id="initialCredits"
                      type="number"
                      min="0"
                      value={formData.initialCredits}
                      onChange={(e) => handleInputChange('initialCredits', parseInt(e.target.value) || 0)}
                      placeholder="5000"
                    />
                  </div>
                </div>
               )} */}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary hover:opacity-90">
                  {isSubmitting ? <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating User...
                    </> : <>
                      <Save className="h-4 w-4 mr-2" />
                      Create User
                    </>}
                </Button>

                <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
                  Reset Form
                </Button>

                <Button type="button" variant="ghost" onClick={() => window.history.back()} disabled={isSubmitting} className="sm:ml-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Help Card */}
      
    </div>;
};
export default AddUser;