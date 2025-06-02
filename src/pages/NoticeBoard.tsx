
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { CalendarIcon, FileText, Plus, Trash2, Edit, Download, Upload, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'academic' | 'event';
  postedBy: string;
  postDate: string;
  expiryDate?: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
}

const NoticeBoard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    expiryDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const canModify = user?.role === 'admin' || user?.role === 'teacher';

  // Load notices from localStorage on component mount
  useEffect(() => {
    const savedNotices = localStorage.getItem('notices');
    if (savedNotices) {
      try {
        const parsedNotices = JSON.parse(savedNotices);
        setNotices(parsedNotices);
      } catch (error) {
        console.error('Error loading notices:', error);
        setNotices([]);
      }
    }
  }, []);

  // Save notices to localStorage whenever notices change
  useEffect(() => {
    localStorage.setItem('notices', JSON.stringify(notices));
  }, [notices]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedExpiryDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, expiryDate: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleFileUpload = (files: any[]) => {
    setUploadedFiles(files);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const noticeData: Notice = {
      id: editingNotice ? editingNotice.id : Date.now().toString(),
      ...formData,
      type: formData.type as Notice['type'],
      postedBy: user?.name || 'Unknown',
      postDate: new Date().toISOString(),
      expiryDate: formData.expiryDate || undefined,
      attachments: uploadedFiles.map(file => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.url
      }))
    };

    if (editingNotice) {
      setNotices(prev => prev.map(notice => notice.id === editingNotice.id ? noticeData : notice));
      toast.success('Notice updated successfully');
    } else {
      setNotices(prev => [noticeData, ...prev]);
      toast.success('Notice posted successfully');
      
      // Add notification for all users about new notice
      addNotification({
        title: 'New Notice Posted',
        message: formData.title,
        type: 'notice',
        actionUrl: `/notices?id=${noticeData.id}`
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      expiryDate: ''
    });
    setSelectedExpiryDate(undefined);
    setUploadedFiles([]);
    setShowAddForm(false);
    setEditingNotice(null);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      expiryDate: notice.expiryDate || ''
    });
    if (notice.expiryDate) {
      setSelectedExpiryDate(new Date(notice.expiryDate));
    }
    if (notice.attachments) {
      setUploadedFiles(notice.attachments);
    }
    setShowAddForm(true);
  };

  const handleDelete = (noticeId: string) => {
    setNotices(prev => prev.filter(notice => notice.id !== noticeId));
    toast.success('Notice deleted');
  };

  const downloadAttachment = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getNoticeTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'academic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'event':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notice.type === filterType;
    
    // Check if notice is expired
    const isExpired = notice.expiryDate && new Date(notice.expiryDate) < new Date();
    
    return matchesSearch && matchesFilter && !isExpired;
  });

  // Check if there's a specific notice to highlight from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const noticeId = urlParams.get('id');
    if (noticeId) {
      const noticeElement = document.getElementById(`notice-${noticeId}`);
      if (noticeElement) {
        noticeElement.scrollIntoView({ behavior: 'smooth' });
        noticeElement.classList.add('ring-2', 'ring-primary-500');
        setTimeout(() => {
          noticeElement.classList.remove('ring-2', 'ring-primary-500');
        }, 3000);
      }
    }
  }, [notices]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notice Board</h1>
            <p className="text-gray-600 dark:text-gray-400">Stay updated with latest announcements</p>
          </div>
          
          {canModify && (
            <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
              <Plus className="h-4 w-4 mr-2" />
              Post Notice
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="urgent">Urgent</option>
            <option value="academic">Academic</option>
            <option value="event">Event</option>
          </select>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingNotice ? 'Edit Notice' : 'Post New Notice'}</CardTitle>
              <CardDescription>
                {editingNotice ? 'Update the notice details' : 'Share important information with the community'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Notice title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="academic">Academic</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Notice content..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Expiry Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedExpiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedExpiryDate ? format(selectedExpiryDate, "PPP") : <span>Pick expiry date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedExpiryDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* File Upload Section */}
              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <FileUpload 
                  onFileUpload={handleFileUpload}
                  acceptedTypes={['.csv', '.pdf', '.xlsx', '.xls', '.png', '.jpg', '.jpeg', '.txt', '.sh']}
                  maxSize={10}
                  multiple={true}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSubmit}>
                  {editingNotice ? 'Update Notice' : 'Post Notice'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {filteredNotices.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || filterType !== 'all' ? 'No notices match your search' : 'No notices posted yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotices.map((notice) => (
              <Card key={notice.id} id={`notice-${notice.id}`} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-xl">{notice.title}</CardTitle>
                        <Badge className={getNoticeTypeColor(notice.type)}>
                          {notice.type}
                        </Badge>
                        {notice.attachments && notice.attachments.length > 0 && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            {notice.attachments.length}
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        Posted by {notice.postedBy} on {format(new Date(notice.postDate), 'PPP')}
                        {notice.expiryDate && (
                          <span> • Expires on {format(new Date(notice.expiryDate), 'PPP')}</span>
                        )}
                      </CardDescription>
                    </div>
                    
                    {canModify && (
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(notice)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(notice.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {notice.content}
                    </p>
                  </div>
                  
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium mb-2">Attachments:</p>
                      <div className="space-y-2">
                        {notice.attachments.map((attachment) => (
                          <div 
                            key={attachment.id}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">{attachment.name}</span>
                              <span className="text-xs text-gray-500">
                                ({formatFileSize(attachment.size)})
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => downloadAttachment(attachment)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NoticeBoard;
