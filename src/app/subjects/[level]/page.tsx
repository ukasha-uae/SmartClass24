
'use client';

import Link from 'next/link';
import { useTenantLink } from '@/hooks/useTenantLink';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Trophy, Zap, Gamepad2, Users } from 'lucide-react';
import { useCollection, useFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Subject } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams, notFound } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import { useLocalizedSubjects } from '@/hooks/useLocalizedSubjects';
import { V1RouteGuard, useV1FeatureAccess } from '@/components/V1RouteGuard';

import { subjects as localSubjects } from '@/lib/jhs-data';
import { primarySubjects } from '@/lib/primary-data';
import { coreSubjects as shsSubjects } from '@/lib/shs-data';

type EducationLevel = 'primary' | 'jhs' | 'shs';
type PrimaryClass = 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 'All';

export default function LevelSubjectsPage() {
    const addTenantParam = useTenantLink();
  const params = useParams();
  const levelParam = params.level as string;
  const { firestore } = useFirebase();
  const [selectedClass, setSelectedClass] = useState<PrimaryClass>('All');
  
  // Validate level parameter - default to jhs if invalid
  const isValidLevel = ['primary', 'jhs', 'shs'].includes(levelParam?.toLowerCase());
  const educationLevel = (isValidLevel ? levelParam.toLowerCase() : 'jhs') as EducationLevel;
  
  // V1 Route Guard: Check if this campus has access to lessons
  // Use URL parameter directly (more reliable than localStorage)
  const campus = educationLevel === 'primary' ? 'primary' :
                 educationLevel === 'jhs' ? 'jhs' : 'shs';
  
  // Localization hooks
  const { country } = useLocalization();
  const localizedJSSSubjects = useLocalizedSubjects('jss');
  
  // Country-specific color theming
  const getCountryColors = () => {
    if (country?.id === 'nigeria') {
      return {
        primary: 'from-green-600 to-green-700',
        secondary: 'from-green-700 to-emerald-800',
        accent: 'from-emerald-500 to-green-600',
        flag: '🇳🇬',
        tagline: "Nigeria's Curriculum Standard"
      };
    } else if (country?.id === 'ghana') {
      return {
        primary: 'from-red-600 to-red-700',
        secondary: 'from-yellow-500 to-orange-500',
        accent: 'from-green-600 to-green-700',
        flag: '🇬🇭',
        tagline: "Ghana's Academic Excellence"
      };
    }
    return {
      primary: 'from-blue-600 to-indigo-600',
      secondary: 'from-indigo-600 to-purple-600',
      accent: 'from-violet-500 to-purple-600',
      flag: '🌍',
      tagline: 'World-Class Education'
    };
  };

  const colors = getCountryColors();

  // Store education level in localStorage for consistent experience
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const capitalizedLevel = educationLevel.charAt(0).toUpperCase() + educationLevel.slice(1);
      localStorage.setItem('userEducationLevel', capitalizedLevel === 'Primary' ? 'Primary' : capitalizedLevel.toUpperCase());
    }
  }, [educationLevel]);

  const subjectsQuery = useMemo(
    () => (firestore && educationLevel === 'jhs' ? collection(firestore, 'subjects') : null),
    [firestore, educationLevel]
  );

  const { data: subjects, isLoading } = useCollection<Subject>(subjectsQuery);

  // Determine which subjects to display based on education level
  const getDisplaySubjects = () => {
    if (educationLevel === 'primary') {
      // For Primary, filter subjects by selected class
      if (selectedClass === 'All') {
        return primarySubjects;
      }
      // Filter topics by class level
      return primarySubjects.map((subject: any) => ({
        ...subject,
        topics: subject.topics.filter((topic: any) => topic.gradeLevel === selectedClass)
      })).filter((subject: any) => subject.topics.length > 0);
    }
    if (educationLevel === 'shs') {
      // For SHS, use SHS subjects
      return shsSubjects;
    }
    // For JHS/JSS, use country-specific localized subjects
    if (localizedJSSSubjects && localizedJSSSubjects.length > 0) {
      return localizedJSSSubjects.map(subject => {
        const localSubject = localSubjects.find(ls => ls.slug === subject.slug);
        if (!localSubject) return null;
        return {
          ...localSubject,
          name: subject.name || localSubject.name,
          description: subject.description || localSubject.description,
        };
      }).filter(Boolean);
    }
    // Fallback to local subjects
    return (subjects && subjects.length > 0) ? subjects : localSubjects;
  };

  const displaySubjects = getDisplaySubjects();

  const primaryClasses: PrimaryClass[] = ['All', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'];

  // Get level display name (country-specific)
  const getLevelName = () => {
    switch (educationLevel) {
      case 'primary': return 'Primary School';
      case 'jhs': 
        return country?.academicStructure.juniorSecondary.name || 'JHS';
      case 'shs': 
        return country?.academicStructure.seniorSecondary.name || 'SHS';
    }
  };

  // V1 Route Guard: Wrap content to check access
  return (
    <V1RouteGuard campus={campus} feature="lessons">
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-violet-950/30 dark:to-indigo-950/30">
      {/* Premium Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-br ${colors.primary} opacity-20 rounded-full blur-3xl animate-pulse`} />
        <div className={`absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-gradient-to-tr ${colors.accent} opacity-20 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${colors.secondary} opacity-10 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }} />
        <div className={`absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br ${colors.accent} opacity-15 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Enhanced Header Section */}
        <div className="mb-12 text-center animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4">
            <span className="text-2xl">{colors.flag}</span>
            <span className="text-sm font-semibold text-primary">{colors.tagline}</span>
          </div>
          
          <h1 className={`text-5xl md:text-6xl font-bold font-headline mb-4 bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
            {getLevelName()} Subjects
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-6">
            {educationLevel === 'primary' 
              ? `Explore ${selectedClass === 'All' ? 'all Primary School' : selectedClass} subjects and topics`
              : 'Choose a subject to start your learning adventure'}
          </p>

          {/* Stats Badge */}
          <div className="inline-flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.accent} animate-pulse`} />
              <span className="font-semibold">{displaySubjects?.length || 0} Subjects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.primary}`} />
              <span>Curriculum Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.accent}`} />
              <span>{country?.examSystem?.conductor || 'WAEC'} Standard</span>
            </div>
          </div>
        </div>

        {/* Class Selector for Primary */}
        {educationLevel === 'primary' && (
          <div className="mb-8">
            <p className="text-center text-sm text-muted-foreground mb-3">Select Class Level</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {primaryClasses.map((cls) => (
                <Button
                  key={cls}
                  variant={selectedClass === cls ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedClass(cls)}
                  className={selectedClass === cls ? `bg-gradient-to-r ${colors.primary} text-white hover:opacity-90` : ''}
                >
                  {cls}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Premium Subject Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading && (!displaySubjects || displaySubjects.length === 0) && (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          )}
          {displaySubjects && displaySubjects.map((subject, index) => (
            <Link key={subject.id} href={`/subjects/${educationLevel}/${subject.slug}`} passHref>
              <Card 
                className="h-full flex flex-col hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group relative overflow-hidden border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-violet-400 dark:hover:border-violet-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Premium Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-300/20 to-indigo-300/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                
                <CardHeader className="flex-grow relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${colors.primary} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      <BookOpen className="h-6 w-6 text-white relative z-10" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="font-headline text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent group-hover:from-violet-600 group-hover:to-indigo-600 dark:group-hover:from-violet-400 dark:group-hover:to-indigo-400 transition-all">
                        {subject.name}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    {subject.description}
                  </CardDescription>
                </CardHeader>
                
                <div className="p-6 pt-0 mt-auto relative z-10">
                  <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r ${colors.accent} text-white font-bold shadow-lg hover:shadow-xl group-hover:gap-4 transition-all duration-300 hover:scale-105`}>
                    <span>View Topics</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Challenge Arena Section */}
        <div className="mt-12 max-w-4xl mx-auto">
        <Link href={addTenantParam('/challenge-arena')}>
          <Card className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group border-2 ${
            educationLevel === 'primary' 
              ? 'bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 border-green-300 dark:border-green-700'
              : educationLevel === 'jhs'
              ? 'bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10 border-blue-300 dark:border-blue-700'
              : 'bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-violet-500/10 border-violet-300 dark:border-violet-700'
          }`}>
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-0 ${
              educationLevel === 'primary'
                ? 'bg-gradient-to-br from-green-400/20 to-emerald-400/20'
                : educationLevel === 'jhs'
                ? 'bg-gradient-to-br from-blue-400/20 to-cyan-400/20'
                : 'bg-gradient-to-br from-violet-400/20 to-purple-400/20'
            }`} />
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform ${
                      educationLevel === 'primary'
                        ? 'bg-green-500 dark:bg-green-600'
                        : educationLevel === 'jhs'
                        ? 'bg-blue-500 dark:bg-blue-600'
                        : 'bg-violet-500 dark:bg-violet-600'
                    }`}>
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                        educationLevel === 'primary'
                          ? 'from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400'
                          : educationLevel === 'jhs'
                          ? 'from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400'
                          : 'from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400'
                      }`}>
                        {getLevelName()} Challenge Arena
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {educationLevel === 'primary'
                          ? 'Fun learning games and friendly competitions!'
                          : 'Battle, compete, and climb the leaderboard!'}
                      </p>
                    </div>
                  </div>
                  <CardDescription className="text-base mb-4">
                    {educationLevel === 'primary'
                      ? 'Have fun while learning! Play educational games, earn badges, and compete with classmates in a safe, friendly environment.'
                      : `Test your knowledge in exciting multiplayer quiz battles. Challenge your friends, compete with other schools, and prove you're the best in ${country?.name || 'your country'}!`}
                  </CardDescription>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {educationLevel === 'primary' ? (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Gamepad2 className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Fun Games</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">Earn Badges</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Class Challenges</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">Practice Mode</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">Quick Match</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-green-500" />
                          <span className="font-medium">School Battles</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">Leaderboards</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Gamepad2 className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Practice Mode</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 font-bold text-lg pt-4 ${
                educationLevel === 'primary'
                  ? 'text-green-600 dark:text-green-400'
                  : educationLevel === 'jhs'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-violet-600 dark:text-violet-400'
              }`}>
                <span>Enter Challenge Arena</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </CardHeader>
          </Card>
        </Link>
        </div>
      </div>
    </div>
    </V1RouteGuard>
  );
}
