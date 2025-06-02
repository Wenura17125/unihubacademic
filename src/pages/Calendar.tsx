
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Layout from '@/components/Layout';
import { Calendar as CalendarIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'holiday' | 'exam' | 'meeting' | 'class';
  createdBy: string;
}

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day: number) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    if (!day) return;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const selectedEvents = selectedDate ? events.filter(event => event.date === selectedDate) : [];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'holiday':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'exam':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'meeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'class':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Calendar</h1>
            <p className="text-gray-600 dark:text-gray-400">View academic events and schedules</p>
          </div>
          {user?.role === 'admin' && (
            <Button
              onClick={() => window.open('https://academiccalender.netlify.app/', '_blank')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Academic Calendar Generator
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ArrowUp className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ArrowDown className="h-4 w-4 rotate-90" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => (
                  <div
                    key={index}
                    className={`
                      min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                      ${selectedDate === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300' : ''}
                      ${!day ? 'bg-gray-50 dark:bg-gray-900' : ''}
                    `}
                    onClick={() => handleDateClick(day)}
                  >
                    {day && (
                      <>
                        <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                          {day}
                        </div>
                        <div className="space-y-1">
                          {getEventsForDate(day).slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {getEventsForDate(day).length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{getEventsForDate(day).length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? `Events for ${new Date(selectedDate).toLocaleDateString()}` : 'Select a Date'}
              </CardTitle>
              <CardDescription>
                Click on a date to view events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedEvents.map(event => (
                    <div key={event.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {event.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Created by: {event.createdBy}
                      </p>
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No events scheduled for this date
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Click on a date to view events
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Events scheduled for the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events
                .filter(event => new Date(event.date) >= new Date() && new Date(event.date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 6)
                .map(event => (
                  <div key={event.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
            </div>
            {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No upcoming events scheduled
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Calendar;
