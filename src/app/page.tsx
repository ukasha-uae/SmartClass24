
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
import { useLocalization } from '@/hooks/useLocalization';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('there');
  const [selectedCampus, setSelectedCampus] = useState<'JHS' | 'SHS' | 'Primary'>('JHS');
  const { country } = useLocalization();

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
      icon: BookOpen,
      features: ['Age-Appropriate Content', 'Fun Learning Games', 'Basic Skills Building', 'Parent Monitoring'],
      href: '/subjects/primary',
      studentCount: '5,000+',
      classes: 'Class 1-6',
      emoji: '🎒',
      tagline: 'Start Your Learning Journey'
    },
    {
      id: 'jhs',
      name: country?.academicStructure?.juniorSecondary?.officialName || 'Junior High School',
      shortName: juniorLevel,
      description: `Ace Your ${juniorExam} Exams`,
      gradient: colors.primary,
      icon: BookOpen,
      features: ['Interactive Lessons', 'School Battles', 'Progress Tracking', `${juniorExam} Practice`],
      href: '/subjects/jhs',
      studentCount: '12,000+',
      classes: juniorClasses,
      emoji: '📚',
      tagline: country?.id === 'nigeria' ? 'Excel in Basic Education' : `Master ${juniorExam}`
    },
    {
      id: 'shs',
      name: country?.academicStructure?.seniorSecondary?.officialName || 'Senior High School',
      shortName: country?.academicStructure?.seniorSecondary?.name || 'SHS',
      description: `Conquer ${seniorExam} & Beyond`,
      gradient: colors.secondary,
      icon: GraduationCap,
      features: ['NSMQ-Style Battles', 'Virtual Labs', 'Past Questions', `${seniorExam} Prep`],
      href: '/shs',
      studentCount: '10,000+',
      classes: seniorClasses,
      emoji: '🎓',
      tagline: 'Your Path to University'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '27,000+', icon: Users },
    { label: 'Success Rate', value: '96%', icon: Trophy },
    { label: 'Education Levels', value: '3', icon: Target },
    { label: 'AI-Powered', value: 'Yes', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section with Country Pride */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br ${colors.primary} opacity-10 rounded-full blur-3xl`}></div>
          <div className={`absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr ${colors.accent} opacity-10 rounded-full blur-3xl`}></div>
        </div>

        <div className="text-center mb-12 relative z-10">
          {/* Country Flag Badge */}
          {country && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl">{country.flag}</span>
              <div className={`h-1 w-16 bg-gradient-to-r ${colors.primary} rounded-full`}></div>
            </div>
          )}

          {/* Main Title with Animation */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-violet-600 dark:text-violet-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient">
              SmartClass24
            </h1>
          </div>

          {/* Country-Specific Tagline */}
          <p className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
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
          
          {/* Compact Inline Stats with Country Theme */}
          <div className="flex flex-wrap gap-3 justify-center items-center mt-6 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r ${colors.primary} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
              <Users className="h-4 w-4" />
              <span className="text-sm font-bold">27,000+ Students</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-bold">96% Success Rate</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r ${colors.accent} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
              <Brain className="h-4 w-4" />
              <span className="text-sm font-bold">AI-Powered Learning</span>
            </div>
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
                  className="group relative hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer border-2 hover:border-violet-400 dark:hover:border-violet-600 overflow-hidden bg-white dark:bg-gray-900"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${campus.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { href: '/challenge-arena', label: 'Challenge Arena', icon: '⚔️', desc: 'Battle & Compete' },
              { href: '/study-groups', label: 'Study Groups', icon: '👥', desc: 'Learn Together' },
              { href: '/virtual-labs', label: 'Virtual Labs', icon: '🔬', desc: 'Hands-On Science' },
              { href: '/past-questions', label: 'Past Questions', icon: '📝', desc: 'Practice Tests' }
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-violet-400 dark:hover:border-violet-600 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h4 className="font-bold text-sm mb-1">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by schools and students across {country?.name || 'West Africa'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Curriculum Aligned</p>
                <p className="font-bold text-sm">{country?.examSystem?.conductor || 'WAEC'} Standard</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Updated</p>
                <p className="font-bold text-sm">Daily Content</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Support</p>
                <p className="font-bold text-sm">24/7 Available</p>
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
    </div>
  );
}
