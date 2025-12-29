"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { coreSubjects } from '@/lib/shs-data';
import { BookOpen, GraduationCap, ArrowRight, Trophy, Zap, Gamepad2, Users, Target } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SHSSubjectsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Mark user as SHS level for Challenge Arena
    if (typeof window !== 'undefined') {
      localStorage.setItem('userEducationLevel', 'SHS');
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            SHS Subjects
          </h1>
        </div>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          Choose a subject to start your learning adventure
        </p>
        
        {/* Compact Stats Badges */}
        <div className="flex flex-wrap gap-3 justify-center items-center mb-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800">
            <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">{coreSubjects.length} Core Subjects</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
            <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              {coreSubjects.reduce((sum, subject) => sum + subject.topics.length, 0)} Topics
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
            <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">WASSCE Ready</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Link href="/shs-programmes">
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 text-sm px-4 py-2 hover:border-violet-400 transition-colors">
              <GraduationCap className="h-4 w-4 mr-2" />
              View SHS Programmes & Electives
              <ArrowRight className="h-4 w-4 ml-2" />
            </Badge>
          </Link>
        </div>
      </div>

      {/* Core Subjects Grid - Redesigned */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
        {coreSubjects.map((subject) => {
          const topicCount = subject.topics.length;
          const gradeGroups = Array.from(new Set(subject.topics.map(t => t.gradeLevel?.split('-')[0]?.trim()).filter(Boolean)));
          const isComingSoon = subject.slug === 'english-language' || subject.slug === 'social-studies';
          
          // Define gradient colors for each subject
          const gradients = {
            'english-language': 'from-blue-500 to-cyan-500',
            'core-mathematics': 'from-violet-500 to-purple-500',
            'integrated-science': 'from-green-500 to-emerald-500',
            'social-studies': 'from-orange-500 to-red-500',
            'default': 'from-indigo-500 to-blue-500'
          };
          
          const gradient = gradients[subject.slug as keyof typeof gradients] || gradients.default;
          
          return (
            <Card 
              key={subject.id} 
              className={`h-full transition-all duration-300 border-2 overflow-hidden relative ${
                isComingSoon 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer group hover:border-violet-400 dark:hover:border-violet-600'
              }`}
            >
              {/* Coming Soon Badge */}
              {isComingSoon && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-amber-500 text-white font-semibold shadow-lg">
                    Coming Soon
                  </Badge>
                </div>
              )}

              {/* Background Gradient Effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl -z-0 ${!isComingSoon && 'group-hover:opacity-20 transition-opacity'}`} />
              
              <CardHeader className="relative z-10 pb-3">
                {/* Icon and Badge Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg ${isComingSoon ? 'opacity-60' : 'group-hover:scale-110 transition-transform'}`}>
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 font-semibold ${isComingSoon ? 'opacity-60' : ''}`}>
                    {topicCount} Topics
                  </Badge>
                </div>
                
                {/* Subject Title */}
                <CardTitle className={`text-xl md:text-2xl mb-2 ${!isComingSoon && 'group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors'}`}>
                  {subject.name}
                </CardTitle>
                
                {/* Description */}
                <CardDescription className="text-sm line-clamp-2 mb-3">
                  {subject.description}
                </CardDescription>
                
                {/* Grade Level Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {gradeGroups.slice(0, 3).map((grade) => (
                    <Badge key={grade} variant="outline" className={`text-xs border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 ${isComingSoon ? 'opacity-60' : ''}`}>
                      {grade}
                    </Badge>
                  ))}
                  {gradeGroups.length > 3 && (
                    <Badge variant="outline" className={`text-xs border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 ${isComingSoon ? 'opacity-60' : ''}`}>
                      +{gradeGroups.length - 3}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="space-y-3">
                  {/* Sample Topics */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Featured Topics</p>
                    <ul className="text-sm space-y-1.5">
                      {subject.topics.slice(0, 3).map((topic) => (
                        <li key={topic.id} className="flex items-start gap-2 text-muted-foreground">
                          <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${gradient} mt-1.5 flex-shrink-0 ${isComingSoon ? 'opacity-60' : ''}`} />
                          <span className="line-clamp-1">{topic.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  {isComingSoon ? (
                    <div className="flex items-center justify-between gap-2 pt-3 border-t dark:border-gray-700">
                      <span className="text-sm font-bold text-amber-600">
                        Coming Soon
                      </span>
                      <Badge className="bg-amber-500 text-white">Soon</Badge>
                    </div>
                  ) : (
                    <Link href={`/shs-subjects/${subject.slug}`}>
                      <div className={`flex items-center justify-between gap-2 pt-3 border-t dark:border-gray-700`}>
                        <span className={`text-sm font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                          Start Learning
                        </span>
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                          <ArrowRight className={`h-4 w-4 text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform`} />
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Challenge Arena Section - Redesigned */}
      <div className="mt-8 md:mt-12 max-w-5xl mx-auto">
        <Link href="/challenge-arena">
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-indigo-500/5 border-2 border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-400/15 to-purple-400/15 rounded-full blur-3xl -z-0 group-hover:scale-110 transition-transform" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/15 to-violet-400/15 rounded-full blur-3xl -z-0 group-hover:scale-110 transition-transform" />
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Icon */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl group-hover:scale-110 transition-transform">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
                    SHS Challenge Arena
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Compete at WASSCE level • School Battles • National Rankings</p>
                </div>
                
                {/* CTA Arrow */}
                <div className="hidden md:block">
                  <div className="p-3 rounded-full bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-200 dark:group-hover:bg-violet-800/50 transition-colors">
                    <ArrowRight className="h-6 w-6 text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm bg-white/50 dark:bg-gray-900/50 p-2 rounded-lg">
                  <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="font-medium">Quick Match</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-white/50 dark:bg-gray-900/50 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="font-medium">School Battles</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-white/50 dark:bg-gray-900/50 p-2 rounded-lg">
                  <Trophy className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="font-medium">Leaderboards</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-white/50 dark:bg-gray-900/50 p-2 rounded-lg">
                  <Target className="h-4 w-4 text-violet-500 flex-shrink-0" />
                  <span className="font-medium">WASSCE Prep</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Info Banner - Compact */}
      <div className="mt-6 md:mt-8 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-violet-200 dark:border-violet-800">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-xl bg-violet-600 dark:bg-violet-500 flex-shrink-0">
                <svg className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Comprehensive WASSCE Preparation</h3>
                <p className="text-sm text-muted-foreground">
                  All subjects aligned with NaCCA SBC curriculum. Click any subject to explore topics and practice for your WASSCE exams.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
