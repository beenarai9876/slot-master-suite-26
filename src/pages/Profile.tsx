import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Save, Edit, Mail, Phone, MapPin, Building, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    department: user?.department || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully",
    });
    
    setIsEditing(false);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      department: user?.department || ''
    });
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'supervisor':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'student':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                  {getInitials(user?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <Badge className={`${getRoleColor(user?.role || '')} border`}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Badge>
                
                {user?.department && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    {user.department}
                  </div>
                )}
                
                {user?.role === 'student' && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Supervisor: Dr. Sarah Wilson
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <h3 className="font-medium text-sm">Account Statistics</h3>
              
              {user?.role === 'student' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Bookings</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Bookings</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits Used</span>
                    <span className="font-medium">$165</span>
                  </div>
                </div>
              )}

              {user?.role === 'supervisor' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits Available</span>
                    <span className="font-medium">$7,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending Approvals</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              )}

              {user?.role === 'admin' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Users</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Equipment</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Bookings</span>
                    <span className="font-medium">18</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Personal Information</span>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    size="sm"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    disabled={isSubmitting}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.name || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formData.email} (Cannot be changed)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1-555-0123"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formData.department} (Contact admin to change)
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                    rows={3}
                    className="resize-none"
                  />
                ) : (
                  <div className="flex gap-2 p-3 bg-muted/50 rounded-md min-h-[80px]">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <span className="whitespace-pre-wrap">
                      {formData.address || 'Not provided'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {user?.role === 'supervisor' && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-4">Department Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Department Phone</Label>
                      {isEditing ? (
                        <Input
                          placeholder="Department contact number"
                          defaultValue="+1-555-0100"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>+1-555-0100</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Department Address</Label>
                      {isEditing ? (
                        <Input
                          placeholder="Department address"
                          defaultValue="Engineering Building, Room 301"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Engineering Building, Room 301</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                Last changed 30 days ago
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Login Sessions</h4>
              <p className="text-sm text-muted-foreground">
                Manage your active login sessions
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;