"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shsProgrammes } from '@/lib/shs-data';
import { GraduationCap, ArrowRight, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function SHSProgrammesPage() {
  const [mounted, setMounted] = useState(false);
  const addTenantParam = useTenantLink();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="h-10 w-10 text-violet-600 dark:text-violet-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            SHS Programmes & Electives
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose your academic programme and explore elective subjects tailored to your career path.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
        <Card className="text-center p-4">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-violet-600" />
          <p className="text-2xl font-bold">{shsProgrammes.length}</p>
          <p className="text-sm text-muted-foreground">Programmes</p>
        </Card>
        <Card className="text-center p-4">
          <Users className="h-8 w-8 mx-auto mb-2 text-violet-600" />
          <p className="text-2xl font-bold">{shsProgrammes.reduce((acc, prog) => acc + prog.electiveSubjects.length, 0)}</p>
          <p className="text-sm text-muted-foreground">Elective Subjects</p>
        </Card>
        <Card className="text-center p-4">
          <GraduationCap className="h-8 w-8 mx-auto mb-2 text-violet-600" />
          <p className="text-2xl font-bold">4</p>
          <p className="text-sm text-muted-foreground">Core Subjects</p>
        </Card>
        <Card className="text-center p-4">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-violet-600" />
          <p className="text-2xl font-bold">100+</p>
          <p className="text-sm text-muted-foreground">Total Topics</p>
        </Card>
      </div>

      {/* Programmes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shsProgrammes.map((programme) => {
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
            <Card 
              key={programme.id}
              className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-violet-500"
            >
              <CardHeader>
                <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 w-fit`}>
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{programme.name}</CardTitle>
                <CardDescription className="line-clamp-2">{programme.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Electives Count */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{programme.electiveSubjects.length} Elective Subjects</span>
                </div>

                {/* Subject Pills */}
                <div className="flex flex-wrap gap-2">
                  {programme.electiveSubjects.slice(0, 3).map((subject) => (
                    <Badge key={subject.id} variant="secondary" className="text-xs">
                      {subject.name}
                    </Badge>
                  ))}
                  {programme.electiveSubjects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{programme.electiveSubjects.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                <Link href={`/shs-programmes/${programme.slug}`}>
                  <Button 
                    className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity`}
                  >
                    View Electives
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Note about Core Subjects */}
      <Card className="mt-12 bg-violet-500/5 border-violet-200 dark:border-violet-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-violet-600 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Core Subjects (All Programmes)</h3>
              <p className="text-muted-foreground mb-4">
                In addition to your electives, all SHS students study these 4 core subjects:
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href={addTenantParam('/shs-subjects/english-language')}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    Core English Language
                  </Badge>
                </Link>
                <Link href={addTenantParam('/shs-subjects/core-mathematics')}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    Core Mathematics
                  </Badge>
                </Link>
                <Link href={addTenantParam('/shs-subjects/integrated-science')}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    Integrated Science
                  </Badge>
                </Link>
                <Link href={addTenantParam('/shs-subjects/social-studies')}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    Social Studies
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
