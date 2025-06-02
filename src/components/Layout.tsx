
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Calendar, FileText, User, Bell, ArrowUp, ArrowDown } from 'lucide-react';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: <User className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Calendar', path: '/calendar' },
    { icon: <FileText className="h-5 w-5" />, label: 'Notice Board', path: '/notices' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Exam Schedules', path: '/exams' },
    { icon: <User className="h-5 w-5" />, label: 'Profile', path: '/profile' },
    { icon: <Bell className="h-5 w-5" />, label: 'Notifications', path: '/notifications' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ icon: <User className="h-5 w-5" />, label: 'Admin Panel', path: '/admin' });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 fixed h-full z-40`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">Uni-Hub</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Academic Hub</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {sidebarOpen ? <ArrowUp className="h-4 w-4 rotate-90" /> : <ArrowDown className="h-4 w-4 -rotate-90" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start text-left transition-all duration-200 ${
                isActive(item.path) 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${!sidebarOpen ? 'px-2' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
                {item.path === '/notifications' && unreadCount > 0 && sidebarOpen && (
                  <Badge variant="destructive" className="ml-auto">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {user?.name}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-400"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notifications')}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-primary-100 text-primary-600">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Layout;
