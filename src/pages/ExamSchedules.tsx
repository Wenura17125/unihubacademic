
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { CalendarIcon, Clock, MapPin, Plus, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ExamSchedule {
  id: string;
  subject: string;
  examType: string;
  date: string;
  time: string;
  room: string;
  duration: string;
  createdBy: string;
}

const ExamSchedules = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamSchedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    subject: '',
    examType: '',
    date: '',
    time: '',
    room: '',
    duration: ''
  });

  const canModify = user?.role === 'admin' || user?.role === 'teacher';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleSubmit = () => {
    if (!formData.subject || !formData.examType || !formData.date || !formData.time || !formData.room) {
      toast.error('Please fill in all required fields');
      return;
    }

    const examData: ExamSchedule = {
      id: editingExam ? editingExam.id : Date.now().toString(),
      ...formData,
      createdBy: user?.name || 'Unknown'
    };

    if (editingExam) {
      setExams(prev => prev.map(exam => exam.id === editingExam.id ? examData : exam));
      toast.success('Exam schedule updated successfully');
    } else {
      setExams(prev => [...prev, examData]);
      toast.success('Exam schedule added successfully');
      
      addNotification({
        title: 'New Exam Scheduled',
        message: `${formData.subject} exam scheduled for ${format(new Date(formData.date), 'PPP')}`,
        type: 'exam'
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      examType: '',
      date: '',
      time: '',
      room: '',
      duration: ''
    });
    setSelectedDate(undefined);
    setShowAddForm(false);
    setEditingExam(null);
  };

  const handleEdit = (exam: ExamSchedule) => {
    setEditingExam(exam);
    setFormData({
      subject: exam.subject,
      examType: exam.examType,
      date: exam.date,
      time: exam.time,
      room: exam.room,
      duration: exam.duration
    });
    setSelectedDate(new Date(exam.date));
    setShowAddForm(true);
  };

  const handleDelete = (examId: string) => {
    setExams(prev => prev.filter(exam => exam.id !== examId));
    toast.success('Exam schedule deleted');
  };

  const getExamTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'midterm':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'final':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'quiz':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exam Schedules</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and view exam schedules</p>
          </div>
          
          {canModify && (
            <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Exam
            </Button>
          )}
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingExam ? 'Edit Exam Schedule' : 'Add New Exam Schedule'}</CardTitle>
              <CardDescription>
                {editingExam ? 'Update the exam details' : 'Create a new exam schedule for students'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="e.g., Mathematics, Physics"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type *</Label>
                  <Select onValueChange={(value) => handleInputChange('examType', value)} value={formData.examType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midterm">Midterm</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Room/Location *</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    placeholder="e.g., Room 101, Main Hall"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 2 hours, 90 minutes"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSubmit}>
                  {editingExam ? 'Update Exam' : 'Add Exam'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {exams.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No exam schedules yet</p>
                {canModify && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Click "Add Exam" to create your first exam schedule
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{exam.subject}</span>
                        <Badge className={getExamTypeColor(exam.examType)}>
                          {exam.examType}
                        </Badge>
                      </CardTitle>
                      <CardDescription>Created by {exam.createdBy}</CardDescription>
                    </div>
                    
                    {canModify && (
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(exam)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(exam.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(exam.date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{exam.time} {exam.duration && `(${exam.duration})`}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{exam.room}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ExamSchedules;
