"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getProgrammeBySlug } from '@/lib/shs-data';
import { GraduationCap, ArrowLeft, BookOpen, List, Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function ProgrammePage({ params }: { params: Promise<{ programmeSlug: string }> }) {
  const { programmeSlug } = use(params);
  
  // Call all hooks before any conditional returns
  const [mounted, setMounted] = useState(false);
  const addTenantParam = useTenantLink();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get data after all hooks
  const programme = mounted ? getProgrammeBySlug(programmeSlug) : null;

  // Safe to check and return after all hooks
  if (!mounted) return null;

  if (!programme) {
    notFound();
  }

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
      <Link href={addTenantParam('/shs-programmes')}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Programmes
        </Button>
      </Link>

      {/* Programme Header */}
      <div className="mb-8">
        <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-4`}>
          <GraduationCap className="h-12 w-12 text-white" />
        </div>
        <h1 className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-3`}>
          {programme.name}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {programme.description}
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="mb-8 bg-violet-500/5 border-violet-200 dark:border-violet-800">
        <Info className="h-4 w-4" />
        <AlertDescription>
          All students in this programme study the <strong>4 core subjects</strong> (English, Mathematics, Science, Social Studies) 
          plus the following <strong>elective subjects</strong>.
        </AlertDescription>
      </Alert>

      {/* Elective Subjects */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Elective Subjects ({programme.electiveSubjects.length})
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {programme.electiveSubjects.map((subject) => (
            <Card 
              key={subject.id}
              className="hover:shadow-lg transition-all hover:scale-[1.02] border-2"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} w-fit`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="secondary">{subject.topics.length} Topics</Badge>
                </div>
                <CardTitle className="text-xl">{subject.name}</CardTitle>
                {subject.description && (
                  <CardDescription>{subject.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {/* Topic Preview */}
                {subject.topics.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Topics include:</p>
                    <ul className="space-y-1">
                      {subject.topics.slice(0, 3).map((topic) => (
                        <li key={topic.id} className="text-sm flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${gradient}`}></div>
                          <span>{topic.name}</span>
                        </li>
                      ))}
                      {subject.topics.length > 3 && (
                        <li className="text-sm text-muted-foreground italic">
                          +{subject.topics.length - 3} more topics
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* View Topics Button */}
                <Link href={`/shs-programmes/${programme.slug}/${subject.slug}`}>
                  <Button 
                    className="w-full"
                    variant="outline"
                  >
                    <List className="mr-2 h-4 w-4" />
                    View All Topics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Core Subjects Reminder */}
      <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-2 border-violet-200 dark:border-violet-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Don't Forget Your Core Subjects
          </h3>
          <p className="text-muted-foreground mb-4">
            In addition to these electives, continue studying your core subjects:
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={addTenantParam('/shs-subjects/english-language')}>
              <Button variant="secondary" size="sm">Core English</Button>
            </Link>
            <Link href={addTenantParam('/shs-subjects/core-mathematics')}>
              <Button variant="secondary" size="sm">Core Mathematics</Button>
            </Link>
            <Link href={addTenantParam('/shs-subjects/integrated-science')}>
              <Button variant="secondary" size="sm">Integrated Science</Button>
            </Link>
            <Link href={addTenantParam('/shs-subjects/social-studies')}>
              <Button variant="secondary" size="sm">Social Studies</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
