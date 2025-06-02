
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUp, ArrowDown, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        text: `Hello ${user?.name}! I'm your academic assistant powered by Qwen. I can help you with information about notices, exams, calendar events, and general academic queries. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, user?.name, messages.length]);

  const getContextualData = () => {
    const notices = JSON.parse(localStorage.getItem('notices') || '[]');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const exams = JSON.parse(localStorage.getItem('examSchedules') || '[]');
    const currentDate = new Date().toISOString().split('T')[0];
    
    return {
      notices: notices.slice(0, 5), // Latest 5 notices
      events: events.filter((e: any) => e.date >= currentDate).slice(0, 5), // Upcoming events
      exams: exams.filter((e: any) => e.date >= currentDate).slice(0, 5), // Upcoming exams
      currentDate,
      userRole: user?.role,
      userName: user?.name
    };
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    const contextData = getContextualData();
    const lowerMessage = userMessage.toLowerCase();
    
    // Academic system specific responses
    if (lowerMessage.includes('notice') || lowerMessage.includes('announcement')) {
      if (contextData.notices.length > 0) {
        const latestNotices = contextData.notices.map((n: any) => `• ${n.title} (${new Date(n.createdAt).toLocaleDateString()})`).join('\n');
        return `Here are the latest notices:\n\n${latestNotices}\n\nYou can view all notices in the Notice Board section.`;
      }
      return "There are currently no notices available. Check back later for updates!";
    }
    
    if (lowerMessage.includes('exam') || lowerMessage.includes('test')) {
      if (contextData.exams.length > 0) {
        const upcomingExams = contextData.exams.map((e: any) => `• ${e.subject} - ${new Date(e.date).toLocaleDateString()} at ${e.time}`).join('\n');
        return `Here are your upcoming exams:\n\n${upcomingExams}\n\nCheck the Exam Schedules section for more details.`;
      }
      return "No upcoming exams scheduled at the moment. Stay tuned for updates!";
    }
    
    if (lowerMessage.includes('calendar') || lowerMessage.includes('event')) {
      if (contextData.events.length > 0) {
        const upcomingEvents = contextData.events.map((e: any) => `• ${e.title} - ${new Date(e.date).toLocaleDateString()}`).join('\n');
        return `Here are upcoming events:\n\n${upcomingEvents}\n\nView the full calendar for more details.`;
      }
      return "No upcoming events scheduled. Check the calendar regularly for updates!";
    }
    
    if (lowerMessage.includes('semester') || lowerMessage.includes('academic year')) {
      return "For semester calculations and academic planning, please visit the Semester Calculator section. Only administrators can set up semester schedules, but all users can view the calculated dates.";
    }
    
    if (lowerMessage.includes('profile') || lowerMessage.includes('account')) {
      return "You can update your profile information including your profile picture, contact details, and password in the Profile section.";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how to')) {
      return `Hi ${contextData.userName}! Here's how you can use Uni-Hub:\n\n• View your dashboard for an overview\n• Check the calendar for events\n• Browse notices for announcements\n• View exam schedules\n• Update your profile\n• Use the semester calculator\n\nAs a ${contextData.userRole}, you have access to all relevant sections. Is there something specific you'd like to know about?`;
    }
    
    // General academic responses
    if (lowerMessage.includes('gpa') || lowerMessage.includes('grade')) {
      return "GPA calculations are typically done based on your course grades. The grading system usually follows:\n• A: 4.0 (90-100%)\n• B: 3.0 (80-89%)\n• C: 2.0 (70-79%)\n• D: 1.0 (60-69%)\n• F: 0.0 (Below 60%)\n\nContact your academic advisor for specific GPA calculations.";
    }
    
    if (lowerMessage.includes('university') || lowerMessage.includes('vavuniya')) {
      return "The University of Vavuniya is a leading institution in Northern Sri Lanka, offering diverse academic programs. This Uni-Hub system helps streamline academic activities for students, teachers, and administrators.";
    }
    
    // Fallback response
    return `I understand you're asking about "${userMessage}". While I specialize in academic information from your Uni-Hub system, I can help you with:\n\n• Latest notices and announcements\n• Upcoming exams and schedules\n• Calendar events\n• Academic procedures\n• System navigation\n\nCould you please rephrase your question or ask about any of these topics?`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Generate response
      const botResponse = await generateResponse(userMessage);
      
      // Add bot response
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error('ChatBot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary-600 hover:bg-primary-700 shadow-lg z-50 transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <ArrowDown className="h-6 w-6" /> : <User className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 bg-white dark:bg-gray-800 border-0 animate-fade-in">
          <CardHeader className="bg-primary-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span>Academic Assistant</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Qwen AI
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[400px]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about academics..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  size="sm"
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
