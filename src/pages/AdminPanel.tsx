
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Calendar, FileText, Settings, ExternalLink, Upload, Database } from 'lucide-react';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';

const AdminPanel = () => {
  const { user } = useAuth();
  const [systemSettings, setSystemSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: false,
    enableNotifications: true,
    enableFileUploads: true,
    maxFileSize: 10,
    enableDarkMode: true,
    maintenanceMode: false
  });

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSettingChange = (setting: string, value: boolean | number) => {
    setSystemSettings(prev => ({ ...prev, [setting]: value }));
    localStorage.setItem('systemSettings', JSON.stringify({ ...systemSettings, [setting]: value }));
    toast.success('Setting updated successfully');
  };

  const handleAcademicCalendarGenerator = () => {
    window.open('https://academiccalender.netlify.app/', '_blank');
  };

  const exportData = (type: string) => {
    try {
      let data: any = {};
      
      switch (type) {
        case 'notices':
          data = JSON.parse(localStorage.getItem('notices') || '[]');
          break;
        case 'users':
          data = JSON.parse(localStorage.getItem('users') || '[]');
          break;
        case 'files':
          data = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
          break;
        default:
          toast.error('Unknown data type');
          return;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`${type} data exported successfully`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage university system</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {JSON.parse(localStorage.getItem('users') || '[]').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {JSON.parse(localStorage.getItem('notices') || '[]').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Posted notices</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uploaded Files</CardTitle>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {JSON.parse(localStorage.getItem('uploadedFiles') || '[]').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Total files</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => exportData('notices')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Export Notices
                  </Button>
                  <Button 
                    onClick={() => exportData('users')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Export Users
                  </Button>
                  <Button 
                    onClick={() => exportData('files')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Export Files
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage students, teachers, and admin users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Students</h3>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {JSON.parse(localStorage.getItem('users') || '[]').filter((u: any) => u.role === 'student').length}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">Teachers</h3>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {JSON.parse(localStorage.getItem('users') || '[]').filter((u: any) => u.role === 'teacher').length}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200">Admins</h3>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {JSON.parse(localStorage.getItem('users') || '[]').filter((u: any) => u.role === 'admin').length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>File Management</CardTitle>
                <CardDescription>Upload and manage system files</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  acceptedTypes={['.csv', '.pdf', '.xlsx', '.xls', '.png', '.jpg', '.jpeg', '.txt', '.sh']}
                  maxSize={10}
                  multiple={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Calendar Generator</CardTitle>
                <CardDescription>Generate professional academic calendars</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleAcademicCalendarGenerator}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Calendar Generator</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowRegistration">Allow User Registration</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow new users to register accounts
                      </p>
                    </div>
                    <Switch
                      id="allowRegistration"
                      checked={systemSettings.allowRegistration}
                      onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Require users to verify their email before accessing the system
                      </p>
                    </div>
                    <Switch
                      id="requireEmailVerification"
                      checked={systemSettings.requireEmailVerification}
                      onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableNotifications">Enable Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow the system to send notifications to users
                      </p>
                    </div>
                    <Switch
                      id="enableNotifications"
                      checked={systemSettings.enableNotifications}
                      onCheckedChange={(checked) => handleSettingChange('enableNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableFileUploads">Enable File Uploads</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow users to upload files to the system
                      </p>
                    </div>
                    <Switch
                      id="enableFileUploads"
                      checked={systemSettings.enableFileUploads}
                      onCheckedChange={(checked) => handleSettingChange('enableFileUploads', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Put the system in maintenance mode
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value) || 10)}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
