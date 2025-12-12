
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, BookOpen, ArrowRight, Sparkles, 
  Users, Trophy, Target, Brain
} from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IntelligentWelcome } from '@/components/IntelligentWelcome';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('there');
  const [selectedCampus, setSelectedCampus] = useState<'JHS' | 'SHS' | 'Primary'>('JHS');

  useEffect(() => {
    setMounted(true);
    
    // Check if this is the user's first visit
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      const storedName = localStorage.getItem('userName');
      const storedLevel = localStorage.getItem('userEducationLevel') as 'JHS' | 'SHS' | 'Primary' | null;
      
      if (storedName) setUserName(storedName);
      if (storedLevel) setSelectedCampus(storedLevel);
      
      // Show welcome for first-time visitors
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, []);

  const handleWelcomeComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenWelcome', 'true');
    }
    setShowWelcome(false);
  };

  if (!mounted) return null;

  const campuses = [
    {
      id: 'primary',
      name: 'Primary School',
      shortName: 'Primary',
      description: 'Class 1-6: Building Strong Foundations',
      gradient: 'from-green-500 to-emerald-500',
      icon: BookOpen,
      features: ['Age-Appropriate Content', 'Fun Learning Games', 'Basic Skills Building', 'Parent Monitoring'],
      href: '/subjects/primary',
      studentCount: '5,000+',
      classes: 'Class 1-6'
    },
    {
      id: 'jhs',
      name: 'Junior High School',
      shortName: 'JHS',
      description: 'Basic Education Certificate Examination (BECE) Preparation',
      gradient: 'from-blue-500 to-cyan-500',
      icon: BookOpen,
      features: ['Interactive Lessons', 'School Battles', 'Progress Tracking', 'BECE Practice'],
      href: '/subjects/jhs',
      studentCount: '12,000+',
      classes: 'JHS 1-3'
    },
    {
      id: 'shs',
      name: 'Senior High School',
      shortName: 'SHS',
      description: 'West African Senior School Certificate Examination (WASSCE) Preparation',
      gradient: 'from-violet-500 to-purple-500',
      icon: GraduationCap,
      features: ['NSMQ-Style Battles', 'Virtual Labs', 'Past Questions', 'WASSCE Prep'],
      href: '/subjects/shs',
      studentCount: '10,000+',
      classes: 'SHS 1-3'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '27,000+', icon: Users },
    { label: 'Success Rate', value: '96%', icon: Trophy },
    { label: 'Education Levels', value: '3', icon: Target },
    { label: 'AI-Powered', value: 'Yes', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section with Compact Stats */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-violet-600 dark:text-violet-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              SmartC24
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Ghana's Premier Learning Platform
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Your complete educational journey from Primary School through SHS with AI-powered lessons and exam preparation.
          </p>
          
          {/* Compact Inline Stats */}
          <div className="flex flex-wrap gap-4 justify-center items-center mt-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30">
              <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">27,000+ Students</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30">
              <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">96% Success Rate</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Campus Selection - Main Focus */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Choose Your Education Level</h2>
          <p className="text-center text-muted-foreground mb-6 text-sm md:text-base">Select your campus to access tailored content and features</p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {campuses.map((campus) => {
              const Icon = campus.icon;
              return (
                <Card 
                  key={campus.id}
                  className="group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-violet-500 overflow-hidden"
                >
                  <CardContent className="p-6">
                    {/* Icon and Badge Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${campus.gradient} shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${campus.gradient} text-white font-semibold`}>
                        {campus.shortName}
                      </span>
                    </div>
                    
                    {/* Title and Description */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold mb-1">{campus.name}</h3>
                      <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-2">{campus.classes}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{campus.description}</p>
                    </div>

                    {/* Compact Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {campus.features.slice(0, 3).map((feature) => (
                        <span key={feature} className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link 
                      href={campus.href}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const levelMap: Record<string, string> = {
                            'primary': 'Primary',
                            'jhs': 'JHS',
                            'shs': 'SHS'
                          };
                          const campusLevel = levelMap[campus.id] as 'JHS' | 'SHS' | 'Primary';
                          localStorage.setItem('userEducationLevel', campusLevel);
                          setSelectedCampus(campusLevel);
                          
                          // Show welcome for first-time campus selection
                          const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
                          if (!hasSeenWelcome) {
                            setShowWelcome(true);
                          }
                        }
                      }}
                      className="block"
                    >
                      <Button 
                        size="default"
                        className={`w-full bg-gradient-to-r ${campus.gradient} hover:opacity-90 transition-opacity`}
                      >
                        Enter Campus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    
                    {/* Student Count */}
                    <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" />
                      {campus.studentCount} active students
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Resources - Compact */}
        <div className="text-center mt-8 border-t pt-8 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Explore More Features</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/challenge-arena">
              <Button variant="outline" size="sm" className="hover:border-violet-500">
                Challenge Arena
              </Button>
            </Link>
            <Link href="/study-groups">
              <Button variant="outline" size="sm" className="hover:border-violet-500">
                Study Groups
              </Button>
            </Link>
            <Link href="/virtual-labs">
              <Button variant="outline" size="sm" className="hover:border-violet-500">
                Virtual Labs
              </Button>
            </Link>
            <Link href="/past-questions">
              <Button variant="outline" size="sm" className="hover:border-violet-500">
                Past Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Experience Overlay */}
      {showWelcome && (
        <IntelligentWelcome
          studentName={userName}
          campus={selectedCampus}
          onComplete={handleWelcomeComplete}
        />
      )}
    </div>
  );
}
