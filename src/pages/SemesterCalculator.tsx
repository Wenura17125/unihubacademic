
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, GraduationCap } from 'lucide-react';

interface SemesterCalculation {
  startDate: string;
  midVacationStart: string;
  midVacationEnd: string;
  semesterEnd: string;
  numberOfWeeks: number;
}

const SemesterCalculator = () => {
  const { user } = useAuth();
  const [calculation, setCalculation] = useState<SemesterCalculation | null>(null);

  useEffect(() => {
    // Load calculation from localStorage
    const savedCalculation = localStorage.getItem('semesterCalculation');
    if (savedCalculation) {
      setCalculation(JSON.parse(savedCalculation));
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateWeekNumber = (startDate: string, targetDate: string) => {
    const start = new Date(startDate);
    const target = new Date(targetDate);
    const diffTime = target.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Semester Calculator</h1>
        </div>

        {!calculation ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No semester calculation available. 
                {user?.role === 'admin' ? ' Please configure semester dates in the Admin Panel.' : ' Please contact admin to configure semester dates.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {/* Semester Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Semester Overview</span>
                </CardTitle>
                <CardDescription>
                  Academic semester timeline and important dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Semester Duration</h3>
                      <p className="text-2xl font-bold text-primary-600">{calculation.numberOfWeeks} weeks</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Semester Start</h3>
                      <p className="text-lg">{formatDate(calculation.startDate)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Week 1</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Semester End</h3>
                      <p className="text-lg">{formatDate(calculation.semesterEnd)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Week {calculation.numberOfWeeks}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mid-Semester Break */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Mid-Semester Break</span>
                </CardTitle>
                <CardDescription>
                  Mid-semester vacation period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Break Starts</h3>
                    <p className="text-lg">{formatDate(calculation.midVacationStart)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Week {calculateWeekNumber(calculation.startDate, calculation.midVacationStart)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Break Ends</h3>
                    <p className="text-lg">{formatDate(calculation.midVacationEnd)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Week {calculateWeekNumber(calculation.startDate, calculation.midVacationEnd)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Week Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Semester Timeline</CardTitle>
                <CardDescription>
                  Week-by-week breakdown of the semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: calculation.numberOfWeeks }, (_, index) => {
                    const weekNumber = index + 1;
                    const weekStart = new Date(calculation.startDate);
                    weekStart.setDate(weekStart.getDate() + (index * 7));
                    
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    
                    const isMidBreak = weekStart >= new Date(calculation.midVacationStart) && 
                                     weekStart <= new Date(calculation.midVacationEnd);
                    
                    return (
                      <div 
                        key={weekNumber}
                        className={`p-4 rounded-lg border ${
                          isMidBreak 
                            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              Week {weekNumber} {isMidBreak && '(Mid-Semester Break)'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
                            </p>
                          </div>
                          {isMidBreak && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded">
                              Break
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SemesterCalculator;
