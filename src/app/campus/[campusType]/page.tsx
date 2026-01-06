"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCampusConfig } from '@/lib/campus-config';
import { BookOpen, FlaskConical, Trophy, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';

export default function CampusHomePage({ params }: { params: { campusType: string } }) {
  const [mounted, setMounted] = useState(false);
  const { country } = useLocalization();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const campus = getCampusConfig(params.campusType);
  
  if (!campus) {
    notFound();
  }

  const Icon = campus.icon;

  // Helper function to get color classes
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, any> = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', gradient: 'from-blue-500 to-cyan-500' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', gradient: 'from-orange-500 to-red-500' },
      violet: { bg: 'bg-violet-500', text: 'text-violet-600', gradient: 'from-violet-500 to-purple-500' },
      green: { bg: 'bg-green-500', text: 'text-green-600', gradient: 'from-green-500 to-emerald-500' },
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(campus.color);
  const examType = campus.id === 'shs' ? 'WASSCE' : 'BECE';
  
  // Map campus.id to education level for arena links
  const getEducationLevel = (campusId: string): 'Primary' | 'JHS' | 'SHS' => {
    if (campusId === 'shs') return 'SHS';
    if (campusId === 'jhs') return 'JHS';
    return 'Primary';
  };
  
  const educationLevel = getEducationLevel(campus.id);

  // Feature cards based on campus type
  const features = campus.id === 'shs' ? [
    {
      icon: BookOpen,
      title: 'Core Subjects',
      description: 'Master English, Mathematics, Science, and Social Studies',
      href: '/shs-subjects',
      color: 'violet',
      badge: '4 Subjects'
    },
    {
      icon: FlaskConical,
      title: 'Virtual Labs',
      description: '35 interactive science experiments for hands-on learning',
      href: '/virtual-labs',
      color: 'orange',
      badge: '35 Labs'
    },
    {
      icon: Trophy,
      title: 'WASSCE Questions',
      description: 'Step-by-step solutions to past WASSCE exam questions',
      href: '/wassce-questions',
      color: 'amber',
      badge: 'Past Papers'
    },
    {
      icon: GraduationCap,
      title: 'Practice Games',
      description: 'Interactive quizzes and challenge games',
      href: `/campus/${campus.id}/game`,
      color: 'indigo',
      badge: 'Coming Soon'
    }
  ] : [
    {
      icon: BookOpen,
      title: 'Subject Library',
      description: 'Comprehensive lessons across all JHS subjects',
      href: '/subjects',
      color: 'blue',
      badge: '9 Subjects'
    },
    {
      icon: Trophy,
      title: 'BECE Questions',
      description: 'Practice with real BECE past questions',
      href: '/past-questions',
      color: 'green',
      badge: 'Past Papers'
    },
    {
      icon: GraduationCap,
      title: 'Challenge Arena',
      description: 'Compete with other students in quiz battles',
      href: `/challenge-arena/${country?.id || 'ghana'}?level=${educationLevel}`,
      color: 'purple',
      badge: 'Live'
    },
    {
      icon: FlaskConical,
      title: 'Practice Games',
      description: 'Interactive learning games and activities',
      href: `/campus/${campus.id}/game`,
      color: 'orange',
      badge: 'New'
    }
  ];

  const colorClasses = {
    violet: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30',
    orange: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
    blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
    green: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Campus Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`p-4 rounded-xl ${colors.bg} bg-opacity-10`}>
            <Icon className={`h-12 w-12 ${colors.text}`} />
          </div>
        </div>
        <h1 className={`text-5xl font-bold mb-3 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
          {campus.displayName}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {campus.description}
        </p>
        <Badge className="mt-4" variant="secondary">
          {examType} Preparation
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
        {[
          { emoji: '📚', label: 'Comprehensive Lessons' },
          { emoji: '🎯', label: 'Practice Quizzes' },
          { emoji: '🏆', label: 'Past Questions' },
          { emoji: '👥', label: 'Study Together' }
        ].map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <p className="text-sm font-medium">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
        {features.map((feature) => {
          const FeatureIcon = feature.icon;
          const colorClass = colorClasses[feature.color as keyof typeof colorClasses];
          
          return (
            <Link key={feature.title} href={feature.href}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
                      <FeatureIcon className="h-8 w-8" />
                    </div>
                    <Badge className={colorClass}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Registration CTA */}
      <div className="max-w-3xl mx-auto">
        <Card className={`bg-gradient-to-r ${colors.gradient} bg-opacity-10 border-2`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Ready to Start Learning?</h3>
                <p className="text-muted-foreground">
                  Register your profile to track progress, save scores, and unlock achievements!
                </p>
              </div>
              <Link href={`/campus/${campus.id}/register`}>
                <Button size="lg" className={`bg-gradient-to-r ${colors.gradient}`}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
