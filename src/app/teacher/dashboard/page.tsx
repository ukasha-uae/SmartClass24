'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, BookOpen, ClipboardCheck, TrendingUp, Calendar, 
  Bell, Award, MessageSquare, BarChart3, Plus, Eye 
} from 'lucide-react';
import Link from 'next/link';
import {
  getTeacherProfile,
  getTeacherClasses,
  getTeacherAssignments,
  getAnnouncements,
  Teacher,
  ClassRoom,
  Assignment,
} from '@/lib/teacher';

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTeacher(getTeacherProfile());
    setClasses(getTeacherClasses());
    setAssignments(getTeacherAssignments());
  };

  const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0);
  const pendingGrading = assignments.reduce(
    (sum, a) => sum + a.submissions.filter(s => !s.graded).length,
    0
  );
  const activeAssignments = assignments.filter(a => a.status === 'published').length;

  const getClassPerformance = (classRoom: ClassRoom) => {
    if (classRoom.students.length === 0) return 0;
    const total = classRoom.students.reduce((sum, s) => sum + s.averageScore, 0);
    return Math.round(total / classRoom.students.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (!teacher) return null;

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {teacher.name}! 👋
            </p>
          </div>
          <Avatar className="h-16 w-16 hidden sm:block">
            <AvatarFallback className="text-2xl">
              {teacher.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {teacher.subjects.map(subject => (
            <Badge key={subject} variant="secondary">{subject}</Badge>
          ))}
          <Badge variant="outline">{teacher.school}</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalStudents}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{classes.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{activeAssignments}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Assignments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{pendingGrading}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending Grading</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link href="/teacher/classes/new">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 p-4">
                <Plus className="h-6 w-6" />
                <span className="text-xs">New Class</span>
              </Button>
            </Link>
            <Link href="/teacher/assignments/new">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 p-4">
                <ClipboardCheck className="h-6 w-6" />
                <span className="text-xs">Assignment</span>
              </Button>
            </Link>
            <Link href="/teacher/announcements/new">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 p-4">
                <Bell className="h-6 w-6" />
                <span className="text-xs">Announce</span>
              </Button>
            </Link>
            <Link href="/teacher/analytics">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 p-4">
                <BarChart3 className="h-6 w-6" />
                <span className="text-xs">Analytics</span>
              </Button>
            </Link>
            <Link href="/teacher/resources">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 p-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-xs">Resources</span>
              </Button>
            </Link>
            <Link href="/admin/course-builder">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 p-4">
                <Award className="h-6 w-6" />
                <span className="text-xs">Lessons</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Classes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Classes</h2>
            <Link href="/teacher/classes">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          {classes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No classes yet</p>
                <Link href="/teacher/classes/new">
                  <Button className="mt-4">Create Your First Class</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            classes.map(classRoom => (
              <Card key={classRoom.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{classRoom.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{classRoom.subject}</Badge>
                        <Badge variant="outline">{classRoom.grade}</Badge>
                      </div>
                    </div>
                    <Link href={`/teacher/classes/${classRoom.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Students</p>
                      <p className="font-semibold">{classRoom.students.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Avg Score</p>
                      <p className="font-semibold">{getClassPerformance(classRoom)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Schedule</p>
                      <p className="font-semibold text-xs">{classRoom.schedule.length}x/week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Recent Assignments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Assignments</h2>
            <Link href="/teacher/assignments">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          {assignments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No assignments yet</p>
                <Link href="/teacher/assignments/new">
                  <Button className="mt-4">Create Assignment</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            assignments.slice(0, 5).map(assignment => (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {assignment.className}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={
                          assignment.status === 'published' ? 'default' :
                          assignment.status === 'draft' ? 'secondary' : 'outline'
                        }>
                          {assignment.status}
                        </Badge>
                        <Badge variant="outline">{assignment.type}</Badge>
                      </div>
                    </div>
                    <Link href={`/teacher/assignments/${assignment.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-3 border-t">
                    <span className="text-muted-foreground">
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                    <div className="flex gap-4">
                      <span className="text-muted-foreground">
                        {assignment.submissions.length} submissions
                      </span>
                      {assignment.submissions.filter(s => !s.graded).length > 0 && (
                        <span className="text-yellow-600 font-semibold">
                          {assignment.submissions.filter(s => !s.graded).length} to grade
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Performance Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Class Performance Overview
          </CardTitle>
          <CardDescription>Average scores across your classes</CardDescription>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No data available yet
            </p>
          ) : (
            <div className="space-y-4">
              {classes.map(classRoom => {
                const avgScore = getClassPerformance(classRoom);
                return (
                  <div key={classRoom.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{classRoom.name}</span>
                      <span className="text-sm font-semibold">{avgScore}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          avgScore >= 80 ? 'bg-green-500' :
                          avgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${avgScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
