'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, TrendingUp, Clock, Award, BookOpen, Target,
  Calendar, Download, AlertCircle, CheckCircle2, UserPlus
} from 'lucide-react';
import { useFirebase, useDoc } from '@/firebase';
import { doc, collection, query, where, getDocs } from 'firebase/firestore';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface LinkedStudent {
  id: string;
  name: string;
  class: string;
  profilePicture?: string;
  progress: {
    lessonsCompleted: number;
    quizzesTaken: number;
    averageQuizScore: number;
    points: number;
    studyStreak: number;
  };
}

export default function ParentDashboard() {
  const { firestore, user } = useFirebase();
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const parentRef = useMemo(
    () => (user && firestore) ? doc(firestore, `parents/${user.uid}`) : null,
    [user, firestore]
  );
  const { data: parentData } = useDoc<any>(parentRef as any);

  useEffect(() => {
    const loadLinkedStudents = async () => {
      try {
        const students: LinkedStudent[] = [];
        
        // Try localStorage first
        const linkedStudentIds = JSON.parse(localStorage.getItem('parentLinkedStudents') || '[]');
        
        if (linkedStudentIds.length === 0 && !parentData?.linkedStudents) {
          setLoading(false);
          return;
        }

        // Use Firestore data if available, otherwise use localStorage
        const studentIds = parentData?.linkedStudents || linkedStudentIds;
        
        for (const studentId of studentIds) {
          if (firestore) {
            // Try to load from Firestore
            const studentDoc = await getDocs(
              query(collection(firestore, 'students'), where('__name__', '==', studentId))
            );
            
            if (!studentDoc.empty) {
              const studentData = studentDoc.docs[0].data();
              students.push({
                id: studentId,
                name: studentData.studentName || 'Student',
                class: studentData.studentClass || 'JHS',
                profilePicture: studentData.profilePictureUrl,
                progress: {
                  lessonsCompleted: studentData.lessonsCompleted || 0,
                  quizzesTaken: studentData.quizzesTaken || 0,
                  averageQuizScore: studentData.averageQuizScore || 0,
                  points: studentData.points || 0,
                  studyStreak: studentData.studyStreak || 0
                }
              });
            }
          } else {
            // Fallback: Use mock data from current user's progress
            const progressData = JSON.parse(localStorage.getItem('user-progress') || '{}');
            students.push({
              id: studentId,
              name: 'Your Child',
              class: 'JHS',
              progress: {
                lessonsCompleted: progressData.lessonsCompleted || 0,
                quizzesTaken: progressData.quizzesTaken || 0,
                averageQuizScore: progressData.averageQuizScore || 0,
                points: progressData.points || 0,
                studyStreak: 3
              }
            });
          }
        }

        setLinkedStudents(students);
        if (students.length > 0 && !selectedStudent) {
          setSelectedStudent(students[0].id);
        }
      } catch (error: any) {
        if (error?.code === 'permission-denied') {
          console.warn('[Parent Dashboard] Permission denied - cannot access student data');
        } else {
          console.error('Error loading students:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadLinkedStudents();
  }, [firestore, parentData, selectedStudent]);

  const currentStudent = linkedStudents.find(s => s.id === selectedStudent);

  // Mock data for charts
  const weeklyProgressData = [
    { day: 'Mon', lessons: 2, quizzes: 1, score: 75 },
    { day: 'Tue', lessons: 3, quizzes: 2, score: 82 },
    { day: 'Wed', lessons: 1, quizzes: 1, score: 68 },
    { day: 'Thu', lessons: 4, quizzes: 3, score: 88 },
    { day: 'Fri', lessons: 2, quizzes: 2, score: 91 },
    { day: 'Sat', lessons: 3, quizzes: 2, score: 85 },
    { day: 'Sun', lessons: 1, quizzes: 1, score: 79 }
  ];

  const subjectPerformanceData = [
    { subject: 'English', score: 85, color: '#3b82f6' },
    { subject: 'Mathematics', score: 78, color: '#10b981' },
    { subject: 'Science', score: 92, color: '#f59e0b' },
    { subject: 'Social Studies', score: 88, color: '#8b5cf6' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!parentData || linkedStudents.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              No Students Linked
            </CardTitle>
            <CardDescription>
              You haven't linked any students yet. Ask your child to share their student ID to monitor their progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">How to link a student:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Ask your child to log in to their student account</li>
                  <li>Go to their Profile page</li>
                  <li>Find the "Link to Parent" section</li>
                  <li>Share the 6-digit code with you</li>
                  <li>Enter the code here to link accounts</li>
                </ol>
              </div>
              <Link href="/parent/link">
                <Button size="lg" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Link Student Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-muted-foreground">Monitor your child's learning progress</p>
      </div>

      {/* Student Selector */}
      <div className="mb-6 flex gap-4 flex-wrap">
        {linkedStudents.map(student => (
          <Card
            key={student.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedStudent === student.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedStudent(student.id)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={student.profilePicture} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.class}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="cursor-pointer hover:shadow-lg border-dashed">
          <CardContent className="p-4 flex items-center justify-center gap-2">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Link Another Student</span>
          </CardContent>
        </Card>
      </div>

      {currentStudent && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStudent.progress.lessonsCompleted}</div>
                <p className="text-xs text-muted-foreground">+3 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStudent.progress.averageQuizScore}%</div>
                <Progress value={currentStudent.progress.averageQuizScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStudent.progress.studyStreak} days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStudent.progress.points}</div>
                <p className="text-xs text-muted-foreground">Top 15% of class</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                    <CardDescription>Lessons and quizzes completed this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="lessons" fill="#3b82f6" name="Lessons" />
                        <Bar dataKey="quizzes" fill="#10b981" name="Quizzes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Quiz Score Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Score Trend</CardTitle>
                    <CardDescription>Performance over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          name="Score %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Completed lesson', subject: 'English Language', title: 'Parts of Speech', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-500' },
                      { action: 'Scored 85%', subject: 'Mathematics', title: 'Algebra Quiz', time: '5 hours ago', icon: Award, color: 'text-amber-500' },
                      { action: 'Started lesson', subject: 'Science', title: 'Photosynthesis', time: '1 day ago', icon: BookOpen, color: 'text-blue-500' }
                    ].map((activity, i) => {
                      const Icon = activity.icon;
                      return (
                        <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                          <Icon className={`h-5 w-5 ${activity.color} mt-0.5`} />
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.subject} - {activity.title}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Subject</CardTitle>
                  <CardDescription>Average scores across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectPerformanceData.map((subject) => (
                      <div key={subject.subject}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{subject.subject}</span>
                          <span className="font-bold">{subject.score}%</span>
                        </div>
                        <Progress value={subject.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Consistent study routine</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Strong in Science subjects</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Excellent quiz completion rate</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-amber-600 dark:text-amber-400">Areas for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span>Mathematics accuracy</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span>Time management in quizzes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span>Review past questions more</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Download detailed progress reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download Weekly Report (PDF)
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download Monthly Report (PDF)
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Email Reports
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
