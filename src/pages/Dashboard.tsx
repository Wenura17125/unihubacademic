
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Layout from '@/components/Layout';
import { Calendar, FileText, User, Bell, ArrowUp, Check } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const quickActions = [
    { icon: <Calendar className="h-6 w-6" />, title: 'View Calendar', description: 'Check upcoming events', path: '/calendar' },
    { icon: <FileText className="h-6 w-6" />, title: 'Notice Board', description: 'Read latest notices', path: '/notices' },
    { icon: <Calendar className="h-6 w-6" />, title: 'Exam Schedule', description: 'View exam dates', path: '/exams' },
    { icon: <User className="h-6 w-6" />, title: 'Profile', description: 'Update your profile', path: '/profile' },
  ];

  if (user.role === 'admin') {
    quickActions.push({ icon: <User className="h-6 w-6" />, title: 'Admin Panel', description: 'Manage system', path: '/admin' });
  }

  const recentNotifications = notifications.slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back, {user.name}!</CardTitle>
            <CardDescription className="text-primary-100">
              University of Vavuniya Academic System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              {user.department && (
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {user.department}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Change Alert - Only show for default admin */}
        {user.email === 'admin@gmail.com' && (
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
            <AlertDescription className="text-orange-700 dark:text-orange-300">
              Using default admin credentials. Please change the password after login for security.
              <Button
                variant="link"
                className="p-0 ml-2 text-orange-700 dark:text-orange-300"
                onClick={() => navigate('/profile')}
              >
                Change Password
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                {unreadCount === 1 ? 'Unread notification' : 'Unread notifications'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {JSON.parse(localStorage.getItem('notices') || '[]').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active notices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {JSON.parse(localStorage.getItem('events') || '[]').filter((e: any) => 
                  new Date(e.date) >= new Date()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exam Schedules</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {JSON.parse(localStorage.getItem('examSchedules') || '[]').filter((e: any) => 
                  new Date(e.date) >= new Date()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Upcoming exams
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access frequently used features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start h-auto p-4 text-left"
                    onClick={() => navigate(action.path)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        {action.icon}
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                    <ArrowUp className="ml-auto h-4 w-4 rotate-45" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Latest updates and announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className={`p-1 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-primary-600'}`}>
                        {notification.read ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : (
                          <Bell className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No notifications yet</p>
                )}
                
                {notifications.length > 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/notifications')}
                  >
                    View All Notifications
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
