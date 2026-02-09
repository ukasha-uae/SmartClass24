"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { coreSubjects } from '@/lib/shs-data';
import { BookOpen, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTenantLink } from '@/hooks/useTenantLink';
import { notFound } from 'next/navigation';
import { useState, useEffect, use } from 'react';

export default function SHSSubjectPage({ params }: { params: Promise<{ subjectSlug: string }> }) {
  const { subjectSlug } = use(params);
  const addTenantParam = useTenantLink();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subject = coreSubjects.find(s => s.slug === subjectSlug);
  
  if (!subject) {
    notFound();
  }

  // Group topics by grade level
  const topicsByGrade = subject.topics.reduce((acc, topic) => {
    const grade = topic.gradeLevel || 'Other';
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(topic);
    return acc;
  }, {} as Record<string, typeof subject.topics>);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href={addTenantParam('/shs-subjects')}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subjects
        </Button>
      </Link>

      {/* Subject Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-4 rounded-xl bg-violet-500/10">
            <BookOpen className="h-10 w-10 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {subject.name}
            </h1>
            <p className="text-muted-foreground mt-2">{subject.description}</p>
          </div>
        </div>

        {/* Subject Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Topics</p>
              <p className="text-2xl font-bold">{subject.topics.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Grade Levels</p>
              <p className="text-2xl font-bold">{Object.keys(topicsByGrade).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">0%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Topics by Grade Level */}
      <div className="space-y-8">
        {Object.entries(topicsByGrade).map(([gradeLevel, topics]) => (
          <div key={gradeLevel}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <div className="h-8 w-1 bg-violet-600 rounded-full" />
              {gradeLevel}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic, index) => {
                const isLocked = false; // You can add unlock logic here
                const isCompleted = topic.progressValue === 100;
                
                return (
                  <Card 
                    key={topic.id}
                    className={`hover:shadow-lg transition-all ${isLocked ? 'opacity-60' : 'hover:scale-105 cursor-pointer'}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                          Topic {index + 1}
                        </Badge>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : isLocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : null}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {topic.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {topic.progressValue !== undefined && topic.progressValue > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">{topic.progressValue}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-600 transition-all"
                              style={{ width: `${topic.progressValue}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <Link href={isLocked ? '#' : `/subjects/shs/${subjectSlug}/${topic.slug}/${topic.slug}`}>
                        <Button 
                          className="w-full" 
                          variant={isCompleted ? "outline" : "default"}
                          size="sm"
                          disabled={isLocked}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Locked
                            </>
                          ) : isCompleted ? (
                            'Review'
                          ) : (
                            'Start Learning'
                          )}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-12">
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-amber-600 dark:bg-amber-500">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">🚧 Full Lessons Coming Soon!</h3>
                <p className="text-muted-foreground">
                  We're currently building comprehensive lessons for each topic. In the meantime, explore our 
                  <Link href={addTenantParam('/virtual-labs')} className="text-violet-600 dark:text-violet-400 font-semibold mx-1">Virtual Labs</Link>
                  and
                  <Link href="/wassce-questions" className="text-violet-600 dark:text-violet-400 font-semibold mx-1">WASSCE Questions</Link>
                  to start practicing!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
