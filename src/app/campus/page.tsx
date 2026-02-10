"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getActiveCampuses, getCampusColorClasses } from '@/lib/campus-config';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CampusSelectorPage() {
  // Call all hooks before any conditional returns
  const [mounted, setMounted] = useState(false);
  const campuses = getActiveCampuses();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe to return null after all hooks
  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Choose Your Learning Path
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select your campus to access tailored learning materials, practice questions, and interactive features designed for your level.
        </p>
      </div>

      {/* Campus Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
        {campuses.map((campus) => {
          const Icon = campus.icon;
          const colors = getCampusColorClasses(campus.id);
          
          return (
            <Card 
              key={campus.id}
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
            >
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full -mr-32 -mt-32`} />
              
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colors.bg} bg-opacity-10`}>
                    <Icon className={`h-8 w-8 ${colors.text}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {campus.levels.length} Levels
                  </Badge>
                </div>
                
                <CardTitle className="text-2xl mb-2">{campus.displayName}</CardTitle>
                <CardDescription className="text-base">
                  {campus.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Available Features
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {campus.features.hasSubjects && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Subjects</span>
                      </div>
                    )}
                    {campus.features.hasLessons && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Lessons</span>
                      </div>
                    )}
                    {campus.features.hasQuiz && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Quizzes</span>
                      </div>
                    )}
                    {campus.features.hasGame && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Games</span>
                      </div>
                    )}
                    {campus.features.hasLeaderboard && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Leaderboard</span>
                      </div>
                    )}
                    {campus.features.hasChallengeArena && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Arena</span>
                      </div>
                    )}
                    {campus.features.hasVirtualLab && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-purple-500" />
                        <span>Virtual Lab</span>
                        <Badge variant="outline" className="text-xs py-0 px-1">Coming</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Levels */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Year Levels
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {campus.levels.map((level) => (
                      <Badge key={level} variant="outline" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 pt-4">
                  <Link href={`/campus/${campus.id}/register`} className="flex-1">
                    <Button className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90`}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/campus/${campus.id}/game`}>
                    <Button variant="outline">
                      Quick Play
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">💡 Not sure which campus to choose?</h3>
          <p className="text-sm text-muted-foreground">
            <strong>JHS Campus</strong> is perfect for students preparing for BECE (Basic Education Certificate Examination).
            <br />
            <strong>SHS Campus</strong> is designed for students preparing for WASSCE (West African Senior School Certificate Examination).
          </p>
        </div>
        
        <p className="text-xs text-muted-foreground">
          More campuses coming soon! We're constantly expanding to support more educational levels.
        </p>
      </div>
    </div>
  );
}
