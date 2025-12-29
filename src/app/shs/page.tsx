"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { coreSubjects, shsProgrammes } from '@/lib/shs-data';
import { 
  GraduationCap, ArrowRight, BookOpen, Users, Trophy, 
  Beaker, Microscope, Calculator, Globe 
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';

export default function SHSHubPage() {
  const [mounted, setMounted] = useState(false);
  const { country } = useLocalization();

  useEffect(() => {
    setMounted(true);
    // Store education level
    if (typeof window !== 'undefined') {
      localStorage.setItem('userEducationLevel', 'SHS');
    }
  }, []);

  if (!mounted) return null;

  // Get country-specific naming and colors
  const shsName = country?.academicStructure.seniorSecondary.name || 'SHS';
  const shsOfficialName = country?.academicStructure.seniorSecondary.officialName || 'Senior High School';
  
  const getCountryColors = () => {
    if (country?.id === 'nigeria') {
      return {
        primary: 'from-green-600 to-green-700',
        accent: 'from-emerald-500 to-green-600',
        badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        flag: '🇳🇬'
      };
    } else if (country?.id === 'ghana') {
      return {
        primary: 'from-red-600 to-red-700',
        accent: 'from-yellow-500 to-red-600',
        badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        flag: '🇬🇭'
      };
    }
    return {
      primary: 'from-violet-600 to-purple-600',
      accent: 'from-blue-500 to-cyan-500',
      badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
      flag: '🌍'
    };
  };
  
  const colors = getCountryColors();

  const subjectIcons: Record<string, any> = {
    'mathematics': Calculator,
    'english-language': BookOpen,
    'integrated-science': Beaker,
    'social-studies': Globe,
  };

  const programmeGradients: Record<string, string> = {
    'general-science': 'from-blue-500 to-cyan-500',
    'general-arts': 'from-purple-500 to-pink-500',
    'business': 'from-green-500 to-emerald-500',
    'agricultural-science': 'from-yellow-500 to-orange-500',
    'visual-arts': 'from-rose-500 to-red-500',
    'home-economics': 'from-pink-500 to-rose-500',
    'technical-studies': 'from-gray-600 to-gray-800',
    'ict-computing': 'from-indigo-500 to-blue-500',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
          <GraduationCap className={`h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br ${colors.primary} bg-clip-text text-transparent`} />
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
            {shsName} Campus
          </h1>
          <span className="text-2xl sm:text-3xl">{colors.flag}</span>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Master your core subjects and explore programme-specific electives for {country?.examSystem?.secondary || 'WASSCE'} excellence
        </p>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          <Badge className={colors.badge}>
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 inline" />
            <span className="text-xs sm:text-sm">4 Core Subjects</span>
          </Badge>
          <Badge className={colors.badge}>
            <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 inline" />
            <span className="text-xs sm:text-sm">8 Programmes</span>
          </Badge>
          <Badge className={colors.badge}>
            <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 inline" />
            <span className="text-xs sm:text-sm">{country?.examSystem?.secondary || 'WASSCE'} Prep</span>
          </Badge>
          <Badge className="inline-block px-2.5 sm:px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm">
            {country?.name || 'International'} Curriculum
          </Badge>
        </div>
      </div>

      {/* Core Subjects Section */}
      <section className="mb-16">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-10 w-1 bg-gradient-to-b ${colors.primary} rounded-full`}></div>
            <h2 className="text-3xl font-bold">Core Subjects</h2>
            <Badge className={colors.badge}>Required for All</Badge>
          </div>
          <p className="text-muted-foreground ml-7">
            Essential subjects for every {shsName} student across all programmes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreSubjects.map((subject) => {
            const IconComponent = subjectIcons[subject.slug] || BookOpen;
            const topicCount = subject.topics?.length || 0;
            const isComingSoon = subject.slug === 'english-language' || subject.slug === 'social-studies';

            return (
              <Card 
                key={subject.id} 
                className={`h-full group transition-all duration-300 border-2 ${
                  isComingSoon 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:shadow-2xl hover:scale-105 cursor-pointer hover:border-primary/50'
                } relative`}
              >
                {/* Coming Soon Badge */}
                {isComingSoon && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-amber-500 text-white font-semibold shadow-lg">
                      Coming Soon
                    </Badge>
                  </div>
                )}

                {isComingSoon ? (
                  <>
                    <CardHeader>
                      <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${colors.primary} mb-3 w-fit opacity-60`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {topicCount} Topics
                        </span>
                        <span className="text-xs text-amber-600 font-semibold">Coming Soon</span>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <Link href={`/subjects/shs/${subject.slug}`} className="block">
                    <CardHeader>
                      <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${colors.primary} mb-3 w-fit group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {topicCount} Topics
                        </span>
                        <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="relative mb-16">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm text-muted-foreground">
            Choose Your Academic Path
          </span>
        </div>
      </div>

      {/* Programmes Section */}
      <section className="mb-16">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-10 w-1 bg-gradient-to-b ${colors.accent} rounded-full`}></div>
            <h2 className="text-3xl font-bold">Academic Programmes</h2>
            <Badge className={colors.badge}>Choose Your Path</Badge>
          </div>
          <p className="text-muted-foreground ml-7">
            Select your programme to access specialized elective subjects aligned with your career goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {shsProgrammes.slice(0, 6).map((programme) => {
            const gradient = programmeGradients[programme.slug] || 'from-violet-500 to-purple-500';
            const electiveCount = programme.electiveSubjects.length;

            return (
              <Card 
                key={programme.id} 
                className="h-full group transition-all duration-300 border-2 opacity-75 relative"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-amber-500 text-white font-semibold shadow-lg">
                    Coming Soon
                  </Badge>
                </div>

                <CardHeader>
                  <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${gradient} mb-3 w-fit opacity-60`}>
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{programme.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {programme.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Elective subjects preview */}
                    <div className="flex flex-wrap gap-1.5">
                      {programme.electiveSubjects.slice(0, 3).map((subject) => (
                        <Badge key={subject.id} variant="outline" className="text-xs opacity-60">
                          {subject.name}
                        </Badge>
                      ))}
                      {electiveCount > 3 && (
                        <Badge variant="outline" className="text-xs opacity-60">
                          +{electiveCount - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        {electiveCount} Electives
                      </span>
                      <span className="text-xs text-amber-600 font-semibold">Coming Soon</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Programmes Button */}
        {shsProgrammes.length > 6 && (
          <div className="text-center">
            <Link href="/shs-programmes">
              <Button size="lg" className={`bg-gradient-to-r ${colors.accent}`}>
                View All {shsProgrammes.length} Programmes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Quick Links Section */}
      <section className="mt-12">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">{shsName} Resources & Features</h2>
          <p className="text-muted-foreground">
            Additional tools to enhance your {country?.examSystem?.secondary || 'WASSCE'} preparation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/challenge-arena">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Trophy className="h-10 w-10 mx-auto mb-3 text-yellow-600" />
                <h3 className="font-semibold mb-1">NSMQ Battles</h3>
                <p className="text-sm text-muted-foreground">Compete with peers</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/virtual-labs">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Microscope className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-1">Virtual Labs</h3>
                <p className="text-sm text-muted-foreground">Interactive experiments</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/past-questions">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-10 w-10 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-1">Past Questions</h3>
                <p className="text-sm text-muted-foreground">WASSCE practice</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/study-groups">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-1">Study Groups</h3>
                <p className="text-sm text-muted-foreground">Collaborate & learn</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
