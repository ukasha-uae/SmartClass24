
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  GraduationCap, BookOpen, ArrowRight, Sparkles, 
  Users, Trophy, Target, Brain, Info
} from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IntelligentWelcome } from '@/components/IntelligentWelcome';
import { useLocalization } from '@/hooks/useLocalization';
import { FEATURE_FLAGS } from '@/lib/featureFlags';
import { EarnPremiumBanner } from '@/components/EarnPremiumBanner';
import { useFirebase } from '@/firebase/provider';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('there');
  const [selectedCampus, setSelectedCampus] = useState<'JHS' | 'SHS' | 'Primary'>('JHS');
  const { country } = useLocalization();
  const { user } = useFirebase();

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

  // Get country-specific academic structure
  const juniorLevel = country?.academicStructure?.juniorSecondary?.name || 'JHS';
  const juniorExam = country?.examSystem?.primary || 'BECE';
  const seniorExam = country?.examSystem?.secondary || 'WASSCE';
  const juniorClasses = country?.academicStructure?.juniorSecondary?.levels?.join(', ') || 'JHS 1-3';
  const seniorClasses = country?.academicStructure?.seniorSecondary?.levels?.join(', ') || 'SHS 1-3';

  // Get country-specific colors from flag
  const getCountryColors = () => {
    if (country?.id === 'nigeria') {
      return {
        primary: 'from-green-600 to-green-700', // Nigerian green
        secondary: 'from-green-700 to-emerald-800', // Darker green for SSS
        accent: 'from-emerald-500 to-green-600'
      };
    } else if (country?.id === 'ghana') {
      return {
        primary: 'from-red-600 to-red-700',
        secondary: 'from-yellow-500 to-orange-500',
        accent: 'from-green-600 to-green-700'
      };
    }
    // Default colors
    return {
      primary: 'from-blue-600 to-indigo-600',
      secondary: 'from-purple-600 to-violet-700',
      accent: 'from-violet-500 to-purple-600'
    };
  };

  const colors = getCountryColors();

  const campuses = [
    {
      id: 'primary',
      name: 'Primary School',
      shortName: 'Primary',
      description: 'Class 1-6: Building Strong Foundations',
      gradient: colors.accent,
      icon: Trophy,
      features: ['Arena Challenge', 'Virtual Labs', 'Fun Learning Games', 'Competitive Play'],
      href: `/challenge-arena/${country?.id || 'ghana'}?level=Primary`,
      studentCount: '120+',
      classes: 'Class 1-6',
      emoji: '🎒',
      tagline: 'Start Your Learning Journey',
      v1Note: 'V1: Arena + Virtual Labs'
    },
    {
      id: 'jhs',
      name: country?.academicStructure?.juniorSecondary?.officialName || 'Junior High School',
      shortName: juniorLevel,
      description: `Ace Your ${juniorExam} Exams`,
      gradient: colors.primary,
      icon: Trophy,
      features: ['Arena Challenge', 'Virtual Labs', 'Competitive Battles', 'Progress Tracking'],
      href: `/challenge-arena/${country?.id || 'ghana'}?level=JHS`,
      studentCount: '350+',
      classes: juniorClasses,
      emoji: '📚',
      tagline: country?.id === 'nigeria' ? 'Excel in Basic Education' : `Master ${juniorExam}`,
      v1Note: 'V1: Arena + Virtual Labs'
    },
    {
      id: 'shs',
      name: country?.academicStructure?.seniorSecondary?.officialName || 'Senior High School',
      shortName: country?.academicStructure?.seniorSecondary?.name || 'SHS',
      description: `Conquer ${seniorExam} & Beyond`,
      gradient: colors.secondary,
      icon: GraduationCap,
      features: ['Arena Challenge', 'Virtual Labs', 'Competitive Battles', `${seniorExam} Prep`],
      href: `/challenge-arena/${country?.id || 'ghana'}?level=SHS`,
      studentCount: '280+',
      classes: seniorClasses,
      emoji: '🎓',
      tagline: 'Your Path to University',
      v1Note: 'V1: Arena + Virtual Labs'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '750+', icon: Users },
    { label: 'Success Rate', value: '96%', icon: Trophy },
    { label: 'Education Levels', value: '3', icon: Target },
    { label: 'AI-Powered', value: 'Yes', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-violet-950/30 dark:to-indigo-950/30 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${colors.primary} opacity-20 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr ${colors.accent} opacity-20 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-300/10 via-indigo-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-amber-300/10 via-orange-300/10 to-yellow-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Hero Section with Country Pride */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10">

        <div className="text-center mb-12 relative z-10">
          {/* Country Flag Badge */}
          {country && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl">{country.flag}</span>
              <div className={`h-1 w-16 bg-gradient-to-r ${colors.primary} rounded-full`}></div>
            </div>
          )}

          {/* Main Title with Premium Animation */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
            {/* Premium Icon with Multi-layer Glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative p-2 sm:p-3 bg-gradient-to-br from-violet-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border-2 border-violet-300/30 dark:border-violet-700/30">
                <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-violet-600 dark:text-violet-400 animate-pulse drop-shadow-lg" />
              </div>
            </div>
            {/* Premium Text Logo with Enhanced Effects */}
            <div className="relative">
              {/* Glow layer */}
              <h1 className="absolute inset-0 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-headline bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent blur-md opacity-40 animate-pulse">
                S24
              </h1>
              {/* Main text */}
              <h1 className="relative text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-headline bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg animate-gradient">
                S24
              </h1>
            </div>
          </div>

          {/* Country-Specific Tagline */}
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            {country?.id === 'nigeria' ? (
              <>🇳🇬 Nigeria's Premier Learning Platform</>
            ) : country?.id === 'ghana' ? (
              <>🇬🇭 Ghana's #1 Education Platform</>
            ) : (
              <>{country?.flag || '🌍'} {country?.name || 'West Africa'}'s Premier Learning Platform</>
            )}
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            {country?.id === 'nigeria' ? (
              <>Master every subject from Primary to SSS. Prepare for BECE, WAEC, NECO, and beyond with Nigeria's most comprehensive e-learning platform.</>
            ) : country?.id === 'ghana' ? (
              <>Your complete journey from Primary through SHS. Excel in BECE, WASSCE with Ghana's trusted learning companion.</>
            ) : (
              <>Your complete educational journey with AI-powered lessons and exam preparation.</>
            )}
          </p>
          
          {/* Premium Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const statColors = [
                { bg: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-200/30 dark:border-blue-800/30', icon: 'text-blue-600 dark:text-blue-400', text: 'from-blue-600 to-indigo-600' },
                { bg: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-200/30 dark:border-amber-800/30', icon: 'text-amber-600 dark:text-amber-400', text: 'from-amber-600 to-orange-600' },
                { bg: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-200/30 dark:border-purple-800/30', icon: 'text-purple-600 dark:text-purple-400', text: 'from-purple-600 to-pink-600' },
                { bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-200/30 dark:border-emerald-800/30', icon: 'text-emerald-600 dark:text-emerald-400', text: 'from-emerald-600 to-teal-600' }
              ];
              const color = statColors[index % statColors.length];
              
              return (
                <div key={stat.label} className={`group relative p-4 sm:p-5 bg-gradient-to-br ${color.bg} backdrop-blur-sm rounded-2xl border-2 ${color.border} shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color.bg.replace('/10', '/20')} rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
                  <div className="relative text-center">
                    <Icon className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 ${color.icon} group-hover:scale-110 transition-transform`} />
                    <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${color.text} bg-clip-text text-transparent mb-1`}>{stat.value}</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campus Selection - Main Focus */}
        <div className="mb-12 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Choose Your Education Level
            </h2>
            <p className="text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              Select your campus to access tailored content, interactive lessons, and exam preparation resources
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {campuses.map((campus, index) => {
              const Icon = campus.icon;
              return (
                <Card 
                  key={campus.id}
                  className="group relative hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-violet-400 dark:hover:border-violet-600 overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Premium Gradient Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${campus.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-300/20 to-indigo-300/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                  
                  <CardContent className="p-6 md:p-8 relative z-10">
                    {/* Icon and Emoji Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${campus.gradient} shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                          <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                        </div>
                        <span className="absolute -top-2 -right-2 text-3xl">{campus.emoji}</span>
                      </div>
                      <span className={`text-xs px-4 py-1.5 rounded-full bg-gradient-to-r ${campus.gradient} text-white font-bold shadow-lg uppercase tracking-wider`}>
                        {campus.shortName}
                      </span>
                    </div>
                    
                    {/* Title and Description */}
                    <div className="mb-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                        {campus.name}
                      </h3>
                      <p className={`text-xs md:text-sm font-bold mb-3 bg-gradient-to-r ${campus.gradient} bg-clip-text text-transparent`}>
                        {campus.classes} • {campus.tagline}
                      </p>
                      <p className="text-sm md:text-base text-muted-foreground font-medium">
                        {campus.description}
                      </p>
                    </div>

                    {/* V1 Note Badge */}
                    {campus.v1Note && (
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
                          {campus.v1Note}
                        </span>
                      </div>
                    )}

                    {/* Features with Icons */}
                    <div className="space-y-2 mb-6">
                      {campus.features.slice(0, 4).map((feature, idx) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${campus.gradient}`}></div>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link 
                      href={campus.href}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const levelMap: Record<string, string> = {
                            'primary': 'Primary',
                            'jhs': country?.academicStructure?.juniorSecondary?.name || 'JHS',
                            'shs': country?.academicStructure?.seniorSecondary?.name || 'SHS'
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
                        size="lg"
                        className={`w-full bg-gradient-to-r ${campus.gradient} hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-bold text-base group-hover:scale-105`}
                      >
                        Enter {campus.shortName} Campus
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    
                    {/* Student Count with Animation */}
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{campus.studentCount}</span>
                      <span>active learners</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Resources - Modern Cards */}
        <div className="mt-16 border-t pt-12 dark:border-gray-800 relative z-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
              More Ways to Excel
            </h3>
            <p className="text-muted-foreground">
              Discover additional features to supercharge your learning
            </p>
          </div>
          
          <TooltipProvider>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { 
                  href: '/challenge-arena/ghana', 
                  label: 'Challenge Arena', 
                  icon: '⚔️', 
                  desc: 'Battle & Compete', 
                  tooltip: 'Compete with classmates in timed quiz battles. Earn XP, climb leaderboards, and win achievements!',
                  show: true, 
                  gradient: 'from-orange-500 to-red-600' 
                },
                { href: '/study-groups', label: 'Study Groups', icon: '👥', desc: 'Learn Together', show: false, gradient: 'from-blue-500 to-indigo-600' }, // Hidden for V1
                { 
                  href: '/virtual-labs', 
                  label: 'Virtual Labs', 
                  icon: '🔬', 
                  desc: 'Hands-On Science', 
                  tooltip: 'Interactive science experiments you can do online. Test acids & bases, explore circuits, and more!',
                  show: FEATURE_FLAGS.V1_LAUNCH.shsHasVirtualLabs, 
                  gradient: 'from-purple-500 to-pink-600' 
                },
                { href: '/past-questions', label: 'Past Questions', icon: '📝', desc: 'Practice Tests', show: true, gradient: 'from-green-500 to-emerald-600' }
              ].filter(item => item.show).map((item) => (
                <Tooltip key={item.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Card className="group relative hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-violet-400 dark:hover:border-violet-600 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-all`}></div>
                        <CardContent className="p-6 text-center relative z-10">
                          <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                          <h4 className="font-bold text-sm sm:text-base mb-1 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                            {item.label}
                            {item.tooltip && <Info className="inline-block ml-1 h-3 w-3 opacity-50" />}
                          </h4>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </TooltipTrigger>
                  {item.tooltip && (
                    <TooltipContent side="bottom" className="max-w-[250px] text-center">
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          {/* Earn Premium Banner - Only for logged in users */}
          {user && !user.isAnonymous && (
          <div className="mt-12 max-w-5xl mx-auto">
            <EarnPremiumBanner variant="full" dismissible={false} showProgress={true} />
          </div>
          )}

          {/* Premium Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 font-medium">
              Trusted by schools and students across <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">{country?.name || 'West Africa'}</span>
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="group px-5 py-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Curriculum Aligned</p>
                <p className="font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{country?.examSystem?.conductor || 'WAEC'} Standard</p>
              </div>
              <div className="group px-5 py-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200/30 dark:border-amber-800/30 backdrop-blur-sm hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Updated</p>
                <p className="font-bold text-sm bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">Daily Content</p>
              </div>
              <div className="group px-5 py-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200/30 dark:border-green-800/30 backdrop-blur-sm hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Support</p>
                <p className="font-bold text-sm bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">24/7 Available</p>
              </div>
            </div>
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
      
      {/* Floating Earn Premium Banner - Only for logged in users */}
      {user && !user.isAnonymous && <EarnPremiumBanner variant="floating" dismissible={true} />}
    </div>
  );
}
