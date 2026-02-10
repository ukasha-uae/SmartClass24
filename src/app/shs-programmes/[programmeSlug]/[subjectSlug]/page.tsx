"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getProgrammeBySlug } from '@/lib/shs-data';
import { GraduationCap, ArrowLeft, BookOpen, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTenantLink } from '@/hooks/useTenantLink';
import { notFound } from 'next/navigation';
import { useState, useEffect, use } from 'react';

export default function ElectiveSubjectPage({ params }: { params: Promise<{ programmeSlug: string; subjectSlug: string }> }) {
  const { programmeSlug, subjectSlug } = use(params);
  
  // Call all hooks before any conditional returns
  const [mounted, setMounted] = useState(false);
  const addTenantParam = useTenantLink();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get data after all hooks
  const programme = mounted ? getProgrammeBySlug(programmeSlug) : null;
  const subject = mounted && programme ? programme.electiveSubjects.find(s => s.slug === subjectSlug) : null;

  // Safe to check and return after all hooks
  if (!mounted) return null;

  if (!programme) {
    notFound();
  }

  if (!subject) {
    notFound();
  }

  // Group topics by grade level
  const topicsByGrade: Record<string, typeof subject.topics> = {};
  subject.topics.forEach(topic => {
    const grade = topic.gradeLevel || 'Other';
    if (!topicsByGrade[grade]) {
      topicsByGrade[grade] = [];
    }
    topicsByGrade[grade].push(topic);
  });

  const gradients = {
    'general-science': 'from-blue-500 to-cyan-500',
    'general-arts': 'from-purple-500 to-pink-500',
    'business': 'from-green-500 to-emerald-500',
    'agricultural-science': 'from-yellow-500 to-orange-500',
    'visual-arts': 'from-rose-500 to-red-500',
    'home-economics': 'from-pink-500 to-rose-500',
    'technical-studies': 'from-gray-600 to-gray-800',
    'ict-computing': 'from-indigo-500 to-blue-500',
  };

  const gradient = gradients[programme.slug as keyof typeof gradients] || 'from-violet-500 to-purple-500';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href={addTenantParam(`/shs-programmes/${programme.slug}`)}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {programme.name}
        </Button>
      </Link>

      {/* Subject Header */}
      <div className="mb-8">
        <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-4`}>
          <BookOpen className="h-12 w-12 text-white" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {subject.name}
          </h1>
          <Badge variant="secondary" className="text-base">
            {subject.topics.length} Topics
          </Badge>
        </div>
        {subject.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {subject.description}
          </p>
        )}
        <div className="mt-4">
          <Badge variant="outline">{programme.name}</Badge>
        </div>
      </div>

      {/* Topics by Grade Level */}
      <div className="space-y-8">
        {Object.entries(topicsByGrade).map(([gradeLevel, topics]) => (
          <div key={gradeLevel}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              {gradeLevel}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic, index) => {
                const isLocked = false; // Can implement logic later
                const progress = topic.progressValue || 0;
                const isCompleted = progress >= 100;

                return (
                  <Card 
                    key={topic.id}
                    className={`hover:shadow-lg transition-all ${!isLocked && 'hover:scale-[1.02] cursor-pointer'} border-2`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base mb-2 flex items-center gap-2">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : isLocked ? (
                              <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <BookOpen className="h-4 w-4 text-violet-600 flex-shrink-0" />
                            )}
                            <span className={isLocked ? 'text-muted-foreground' : ''}>
                              {topic.name}
                            </span>
                          </CardTitle>
                        </div>
                        {isCompleted && (
                          <Badge variant="default" className="bg-green-600">Complete</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {progress > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                      
                      {!isLocked ? (
                        <Link href={`/shs-programmes/${programme.slug}/${subject.slug}/${topic.slug}`}>
                          <Button className="w-full" variant="outline">
                            {progress > 0 ? 'Continue Learning' : 'Start Topic'}
                          </Button>
                        </Link>
                      ) : (
                        <Button className="w-full" variant="outline" disabled>
                          <Lock className="mr-2 h-4 w-4" />
                          Locked
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Resources Section */}
      <Card className="mt-12 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-2 border-violet-200 dark:border-violet-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Additional Resources</h3>
          <div className="flex flex-wrap gap-3">
            <Link href={addTenantParam('/virtual-labs')}>
              <Button variant="secondary">
                <BookOpen className="mr-2 h-4 w-4" />
                Virtual Labs
              </Button>
            </Link>
            <Link href="/wassce-questions">
              <Button variant="secondary">
                <BookOpen className="mr-2 h-4 w-4" />
                WASSCE Questions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
