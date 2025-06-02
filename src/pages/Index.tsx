
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowDown, Calendar, FileText, User } from 'lucide-react';
import { Hero } from '@/components/Hero';

const Index = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-primary-600" />,
      title: "Academic Calendar",
      description: "Comprehensive semester planning and event management system"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary-600" />,
      title: "Notice Board",
      description: "Stay updated with important announcements and notices"
    },
    {
      icon: <User className="h-8 w-8 text-primary-600" />,
      title: "Profile Management",
      description: "Manage your academic profile and personal information"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Uni-Hub</h1>
              <p className="text-sm text-muted-foreground">University of Vavuniya</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Canvas */}
      <Hero />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed for academic success
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur-sm border-border shadow-lg"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg md:text-xl font-bold text-card-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground text-sm md:text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Join the University of Vavuniya community using Uni-Hub to enhance your academic experience.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base md:text-lg"
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Uni-Hub</span>
              </div>
              <p className="text-muted-foreground text-sm">
                University of Vavuniya&apos;s comprehensive academic management system.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-foreground">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-foreground transition-colors">Dashboard</button></li>
                <li><button onClick={() => navigate('/calendar')} className="hover:text-foreground transition-colors">Calendar</button></li>
                <li><button onClick={() => navigate('/notices')} className="hover:text-foreground transition-colors">Notices</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-foreground">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-foreground">University of Vavuniya</h5>
              <p className="text-sm">
                Vavuniya, Northern Province<br />
                Sri Lanka<br />
                <a href="mailto:info@vau.ac.lk" className="hover:text-foreground transition-colors">
                  info@vau.ac.lk
                </a>
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm">&copy; 2024 University of Vavuniya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
