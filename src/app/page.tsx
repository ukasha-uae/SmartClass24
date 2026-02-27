'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  GraduationCap, BookOpen, ArrowRight, Sparkles, 
  Users, Trophy, Target, Brain, Info, Building2, Globe, FlaskConical, Calculator, Palette
} from "lucide-react";
import Link from 'next/link';
import { useState, useEffect, useCallback, useContext } from 'react';
import { IntelligentWelcome } from '@/components/IntelligentWelcome';
import { useLocalization } from '@/hooks/useLocalization';
import { useTenant } from '@/hooks/useTenant';
import { useEducationLevels } from '@/hooks/useEducationLevels';
import { FEATURE_FLAGS } from '@/lib/featureFlags';
import { EarnPremiumBanner } from '@/components/EarnPremiumBanner';
import { FirebaseContext } from '@/firebase/provider';
import { SCIENCE_SIMULATIONS } from '@/lib/science-simulations/registry';
import {
  getVirtualLabTrack,
  virtualLabExperiments,
  VIRTUAL_LAB_TRACK_LABELS,
} from '@/lib/virtual-labs-data';
import { convertUsdToLocal, roundPrice } from '@/lib/pricing/currency';
import {
  defaultAdminPricingConfig,
  getEffectiveUsdBasePrice,
  loadAdminPricingConfig,
} from '@/lib/pricing/admin-pricing-config';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('there');
  const [selectedCampus, setSelectedCampus] = useState<'JHS' | 'SHS' | 'Primary'>('JHS');
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null);
  const [pricingConfig, setPricingConfig] = useState(defaultAdminPricingConfig);
  const { country, formatCurrency, getCurrencySymbol, getPrimaryExam, getSecondaryExam, getJuniorSecondaryName, getSeniorSecondaryName } = useLocalization();
  const { branding, market, hasLocalization, tenantId, academyDisplayName } = useTenant();
  const { labels: educationLabels } = useEducationLevels();
  const isGlobal = !country;
  const firebaseContext = useContext(FirebaseContext);
  const user = firebaseContext?.user ?? null;
  const addTenantParam = useCallback(
    (href: string) => {
      if (!tenantId || tenantId === 'smartclass24') return href;
      const separator = href.includes('?') ? '&' : '?';
      return `${href}${separator}tenant=${tenantId}`;
    },
    [tenantId]
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[HomePage] Tenant:', { tenantId, market, branding: { name: branding?.name, logoUrl: branding?.logoUrl, domain: branding?.domain } });
    }
  }, [tenantId, market, branding]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/exchange-rates')
      .then((res) => res.json())
      .then((data: { rates?: Record<string, number> }) => {
        if (mounted && data?.rates) setLiveRates(data.rates);
      })
      .catch(() => {
        // Keep static fallback converter if live rates fail.
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    loadAdminPricingConfig().then((cfg) => {
      if (mounted) setPricingConfig(cfg);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Force remount when tenant changes to prevent state pollution
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log('[HomePage] Tenant changed:', tenantId);
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, [tenantId]);

  useEffect(() => {
    setMounted(true);
    
    // WELCOME INTRO TEMPORARILY DISABLED
    // TODO: Fix the carousel/scene navigation issues before re-enabling
    // To test: add ?welcome=true to URL
    
    // Check if this is the user's first visit
    if (typeof window !== 'undefined') {
      // Check for force-show query parameter (for testing)
      const urlParams = new URLSearchParams(window.location.search);
      const forceWelcome = urlParams.get('welcome') === 'true';
      const resetWelcome = urlParams.get('welcome') === 'reset';
      
      // Reset flag if requested
      if (resetWelcome) {
        localStorage.removeItem('hasSeenWelcome');
        if (process.env.NODE_ENV === 'development') console.log('[HomePage] Welcome flag reset');
        // Remove the query param
        window.history.replaceState({}, '', window.location.pathname);
      }
      
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      const storedName = localStorage.getItem('userName');
      const storedLevel = localStorage.getItem('userEducationLevel') as 'JHS' | 'SHS' | 'Primary' | null;
      
      if (storedName) setUserName(storedName);
      if (storedLevel) setSelectedCampus(storedLevel);
      
      // TEMPORARILY DISABLED: Only show if explicitly requested via query param
      // Original logic: Show for first-time visitors
      // const shouldShowWelcome = forceWelcome || !hasSeenWelcome || (!storedName && user?.isAnonymous);
      const shouldShowWelcome = forceWelcome; // ONLY show when forced via ?welcome=true
      
      if (shouldShowWelcome) setShowWelcome(true);
    }
  }, [user]);

  const handleWelcomeComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenWelcome', 'true');
    }
    setShowWelcome(false);
  };

  // Get country-specific academic structure (use localization getters so global gets neutral labels)
  const juniorLevel = getJuniorSecondaryName();
  const juniorExam = getPrimaryExam();
  const seniorExam = getSecondaryExam();
  const juniorClasses = country?.academicStructure?.juniorSecondary?.levels?.join(', ') || `${educationLabels.jhs} 1-3`;
  const seniorClasses = country?.academicStructure?.seniorSecondary?.levels?.join(', ') || `${educationLabels.shs} 1-3`;
  // Neutral copy when no country selected (global view) – avoid BECE/WASSCE
  const juniorExamLabel = isGlobal ? '' : juniorExam;
  const seniorExamLabel = isGlobal ? '' : seniorExam;

  // Get country-specific colors from flag - Define BEFORE early return
  const getCountryColors = () => {
    if (country?.id === 'nigeria') {
      return {
        primary: 'from-green-600 to-green-700',
        secondary: 'from-green-700 to-emerald-800',
        accent: 'from-emerald-500 to-green-600'
      };
    } else if (country?.id === 'ghana') {
      return {
        primary: 'from-red-600 to-red-700',
        secondary: 'from-yellow-500 to-orange-500',
        accent: 'from-green-600 to-green-700'
      };
    }
    return {
      primary: 'from-blue-600 to-indigo-600',
      secondary: 'from-purple-600 to-violet-700',
      accent: 'from-violet-500 to-purple-600'
    };
  };

  const colors = getCountryColors();
  const convertWithBestRate = (usdAmount: number, currencyCode: string) => {
    const code = currencyCode.toUpperCase();
    // Use admin-configured rates first so dashboard changes show immediately.
    const adminRate = pricingConfig.usdToLocalRates[code];
    if (adminRate) {
      return roundPrice(usdAmount * adminRate);
    }
    if (liveRates?.[code]) {
      return roundPrice(usdAmount * liveRates[code]);
    }
    return roundPrice(convertUsdToLocal(usdAmount, code));
  };
  const minPremiumUsd = getEffectiveUsdBasePrice(
    pricingConfig.baseUsd.premiumStudentMonthly,
    'premiumStudent',
    pricingConfig,
    country?.id ?? null
  );
  const maxPremiumUsd = getEffectiveUsdBasePrice(
    pricingConfig.baseUsd.premiumPlusMonthly,
    'premiumPlus',
    pricingConfig,
    country?.id ?? null
  );
  const minPremiumLocal = country
    ? formatCurrency(convertWithBestRate(minPremiumUsd, country.currency.code))
    : `$${Math.round(minPremiumUsd)}`;
  const maxPremiumLocal = country
    ? formatCurrency(convertWithBestRate(maxPremiumUsd, country.currency.code))
    : `$${Math.round(maxPremiumUsd)}`;

  const campuses = [
    {
      id: 'primary',
      name: educationLabels.primary,
      shortName: educationLabels.primary,
      description: isGlobal ? 'Grades 1-6: Building Strong Foundations' : 'Class 1-6: Building Strong Foundations',
      gradient: colors.accent,
      icon: Trophy,
      features: ['Arena Challenge', 'Virtual Labs', 'Fun Learning Games', 'Competitive Play'],
      href: `/challenge-arena/global?level=Primary`,
      studentCount: '120+',
      classes: isGlobal ? 'Grades 1-6' : 'Class 1-6',
      emoji: '🎒',
      tagline: 'Start Your Learning Journey',
      v1Note: 'V1: Arena + Virtual Labs'
    },
    {
      id: 'jhs',
      name: educationLabels.jhs,
      shortName: educationLabels.jhs,
      description: market === 'middle-east' ? 'Building Critical Thinking Skills' : juniorExamLabel ? `Ace Your ${juniorExamLabel} Exams` : 'Master Your Assessments',
      gradient: colors.primary,
      icon: Trophy,
      features: ['Arena Challenge', 'Virtual Labs', 'Competitive Battles', 'Progress Tracking'],
      href: `/challenge-arena/global?level=JHS`,
      studentCount: '350+',
      classes: juniorClasses,
      emoji: '📚',
      tagline: market === 'middle-east' ? 'Discover Your Learning Style' : country?.id === 'nigeria' ? 'Excel in Basic Education' : juniorExamLabel ? `Master ${juniorExamLabel}` : 'Excel in Core Subjects',
      v1Note: 'V1: Arena + Virtual Labs'
    },
    {
      id: 'shs',
      name: educationLabels.shs,
      shortName: educationLabels.shs,
      description: market === 'middle-east' ? 'Preparing for Higher Education' : seniorExamLabel ? `Conquer ${seniorExamLabel} & Beyond` : 'Conquer Your Exams & Beyond',
      gradient: colors.secondary,
      icon: GraduationCap,
      features: market === 'middle-east' 
        ? ['Arena Challenge', 'Virtual Labs', 'Collaborative Learning', 'Mentorship']
        : seniorExamLabel ? ['Arena Challenge', 'Virtual Labs', 'Competitive Battles', `${seniorExamLabel} Prep`] : ['Arena Challenge', 'Virtual Labs', 'Competitive Battles', 'Exam Prep'],
      href: `/challenge-arena/global?level=SHS`,
      studentCount: '280+',
      classes: seniorClasses,
      emoji: '🎓',
      tagline: 'Your Path to University',
      v1Note: 'V1: Arena + Virtual Labs'
    },
    ...(FEATURE_FLAGS.V1_LAUNCH.showUniversity && (tenantId === 'smartclass24' || (tenantId === 'wisdomwarehouse' && branding && branding.name === 'Wisdom Warehouse'))
        ? [{
            id: 'university',
            name: academyDisplayName,
            shortName: 'Academy',
            description: 'Empowering Beginners to Become Tech Builders & Founders',
            gradient: 'from-green-600 to-emerald-700',
            icon: BookOpen,
            features: ['AI-Driven Learning', 'Real-World Projects', 'Automation Skills', 'Build & Launch'],
            href: '/university',
            studentCount: '50+',
            classes: 'Beginner-Expert',
            emoji: '💻',
            tagline: 'Your AI-Powered Tech Journey',
            v1Note: 'NEW: Full Learning Platform'
          }]
        : [])
  ];

  // Stats - Different for global platform vs tenants
  const stats = tenantId === 'smartclass24' ? [
    // Global SmartClass24 - Institutional focus
    { label: 'Active Students', value: '750+', icon: Users },
    { label: 'Success Rate', value: '96%', icon: Trophy },
    { label: 'Education Levels', value: '3', icon: Target },
    { label: 'Countries Served', value: '5+', icon: Brain }
  ] : [
    // Tenant-specific stats (e.g., Wisdom Warehouse)
    { label: 'Personalized Learning', value: '100%', icon: Brain },
    { label: 'Engagement Rate', value: '98%', icon: Trophy },
    { label: 'Holistic Approach', value: 'Yes', icon: Target },
    { label: 'Mentorship', value: '1:1', icon: Users }
  ];

  // Feature links for "More Ways to Excel" section
  const featureLinks = [
    { 
      href: '/challenge-arena', 
      label: 'Challenge Arena', 
      icon: '⚔️', 
      desc: 'Battle & Compete', 
      tooltip: 'Compete with classmates in timed quiz battles. Earn XP, climb leaderboards, and win achievements!',
      show: true, 
      gradient: 'from-orange-500 to-red-600' 
    },
    { href: '/study-groups', label: 'Study Groups', icon: '👥', desc: 'Learn Together', show: false, gradient: 'from-blue-500 to-indigo-600' },
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
  ];

  const scienceLabCount = virtualLabExperiments.experiments.filter(
    (lab) => getVirtualLabTrack(lab) === 'science-lab'
  ).length;
  const mathsLabCount = virtualLabExperiments.experiments.filter(
    (lab) => getVirtualLabTrack(lab) === 'maths-lab'
  ).length;
  const artLabCount = virtualLabExperiments.experiments.filter(
    (lab) => getVirtualLabTrack(lab) === 'art-lab'
  ).length;

  // Wait for client-side mount to prevent hydration issues
  if (!mounted) {
    return null;
  }

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
          {/* Country Flag Badge - Show when user has selected a country */}
          {hasLocalization && country && (
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
            {/* Premium Text Logo with Enhanced Effects - Tenant-aware */}
            <div className="relative">
              {/* Glow layer */}
              <h1 className="absolute inset-0 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-headline bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent blur-md opacity-40 animate-pulse">
                {branding?.name || 'S24'}
              </h1>
              {/* Main text */}
              <h1 className="relative text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-headline bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg animate-gradient">
                {branding?.name || 'S24'}
              </h1>
            </div>
          </div>

          {/* Tenant & Country-Specific Tagline */}
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            {tenantId === 'smartclass24' ? (
              // Global platform - institutional messaging
              <>🏫 White-Label Learning Platform for Schools & Institutions</>
            ) : market === 'middle-east' ? (
              <>Personalized Learning for Every Student</>
            ) : market === 'us' ? (
              <>🇺🇸 Your Path to Academic Excellence</>
            ) : (
              <>World-Class Learning Platform</>
            )}
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            {tenantId === 'smartclass24' ? (
              // Global platform - institutional value proposition
              <>Launch your branded learning platform with AI-powered lessons, virtual labs, and gamified challenges. Trusted by 750+ students across Africa and the Middle East. Full curriculum coverage with analytics and student progress tracking.</>
            ) : market === 'middle-east' ? (
              <>Empowering diverse learners with individualized, hands-on education. Build real-world skills, emotional resilience, and discover your unique potential through personalized mentorship and creative learning.</>
            ) : market === 'us' ? (
              <>Comprehensive learning platform with interactive lessons, virtual labs, and competitive challenges. Master every subject with AI-powered personalized education.</>
            ) : (
              <>Interactive lessons, virtual labs, and gamified learning. Master your curriculum with AI-powered personalized education and exam preparation.</>
            )}
          </p>
          
          {/* Affordability Badge - Solid text color so it's visible in all browsers (gradient clip can fail with extensions) */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 border-2 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm shadow-lg mb-4">
            <span className="text-2xl">{tenantId === 'smartclass24' ? '🏫' : '🎓'}</span>
            <span className="text-sm md:text-base font-bold text-emerald-700 dark:text-emerald-400">
              {tenantId === 'smartclass24' ? (
                '🚀 Launch Your Branded Platform in 48 Hours'
              ) : market === 'middle-east' ? (
                'Premium Learning. Exceptional Value.'
              ) : country?.id === 'ghana' ? (
                `Quality Education From ${formatCurrency(0)}/month`
              ) : hasLocalization ? (
                `Affordable Learning From ${formatCurrency(0)}/month`
              ) : (
                'Start Learning Free Today'
              )}
            </span>
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          {/* Premium Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8 mb-8">
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

          {/* Institutional Trust Badge - Only for global platform */}
          {tenantId === 'smartclass24' && (
            <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto mb-12 p-4 rounded-xl bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-violet-200/50 dark:border-violet-800/30 backdrop-blur-sm">
              <Building2 className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              <div className="text-left">
                <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">Trusted by Educational Institutions</p>
                <p className="text-xs text-violet-700 dark:text-violet-300">Serving students across Ghana, Nigeria, Sierra Leone, Liberia & UAE</p>
              </div>
            </div>
          )}

        </div>

        {/* Lab Tracks Preview */}
        <div className="mb-12 relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Lab Tracks
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Organized pathways for scalable expansion: science today, maths live, art next.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {[
              {
                key: 'science-lab',
                title: VIRTUAL_LAB_TRACK_LABELS['science-lab'],
                count: scienceLabCount,
                status: 'Live',
                icon: FlaskConical,
                gradient: 'from-indigo-500 to-blue-600',
              },
              {
                key: 'maths-lab',
                title: VIRTUAL_LAB_TRACK_LABELS['maths-lab'],
                count: mathsLabCount,
                status: 'Live',
                icon: Calculator,
                gradient: 'from-fuchsia-500 to-purple-600',
              },
              {
                key: 'art-lab',
                title: VIRTUAL_LAB_TRACK_LABELS['art-lab'],
                count: artLabCount,
                status: 'Coming Soon',
                icon: Palette,
                gradient: 'from-amber-500 to-orange-600',
              },
            ].map((track) => {
              const Icon = track.icon;
              return (
                <Card
                  key={track.key}
                  className="relative overflow-hidden border border-white/30 dark:border-white/10 bg-white/45 dark:bg-slate-900/45 backdrop-blur-2xl shadow-[0_20px_60px_-25px_rgba(0,0,0,0.45)] hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] hover:-translate-y-0.5 transition-all"
                >
                  <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${track.gradient} opacity-25 blur-2xl`} />
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(145deg,rgba(255,255,255,0.35),rgba(255,255,255,0.06))] dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                  <CardContent className="p-5 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r ${track.gradient} shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_20px_-8px_rgba(0,0,0,0.55)]`}>
                        <Icon className="h-5 w-5 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${track.status === 'Live' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                        {track.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">{track.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{track.count} labs available</p>
                    <Link href={addTenantParam('/virtual-labs')}>
                      <Button variant="outline" size="sm" className="w-full">
                        Open Tracks
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Science Simulations Strip (3D & interactive) */}
        {SCIENCE_SIMULATIONS.length > 0 && (
          <div className="mb-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-indigo-700 to-violet-700 dark:from-indigo-300 dark:to-violet-300 bg-clip-text text-transparent">
                  Science Simulations
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Hands-on science experiences, starting with our 3D Solar System. More simulations are coming here.
                </p>
              </div>
              <Link
                href={addTenantParam('/virtual-labs?subject=Science')}
                className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:underline"
              >
                View all science labs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-4">
              {/* Featured simulation */}
              {SCIENCE_SIMULATIONS.filter(sim => sim.featured).slice(0, 1).map((sim) => (
                <Link
                  key={sim.id}
                  href={addTenantParam(`/virtual-labs/${sim.slug}`)}
                  className="group"
                >
                  <Card className="h-full border-2 border-indigo-300/70 dark:border-indigo-700/70 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 text-white overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all">
                    <CardContent className="p-5 flex flex-col h-full relative">
                      <div className="absolute inset-0 pointer-events-none opacity-60">
                        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/40 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-violet-500/30 blur-3xl" />
                      </div>
                      <div className="relative flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-slate-900/70 border border-indigo-400/40 shadow-lg">
                          <Globe className="h-7 w-7 text-amber-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/30 border border-indigo-300/60 uppercase tracking-wider">
                              {sim.subject}
                            </span>
                            {sim.badge && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 border border-amber-300/60 text-amber-200 uppercase tracking-wider">
                                {sim.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg md:text-xl font-bold leading-tight">
                            {sim.title}
                          </h3>
                        </div>
                      </div>
                      <p className="relative text-sm text-slate-200/90 mb-4 flex-1">
                        {sim.description}
                      </p>
                      <div className="relative flex items-center justify-between text-xs text-slate-200/80 mt-auto">
                        <span>Click to start the simulation</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {/* Secondary simulations list (future-ready) */}
              <Card className="border-2 border-slate-200/70 dark:border-slate-700/70 bg-white/80 dark:bg-slate-950/60 backdrop-blur-xl">
                <CardContent className="p-4 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Available & Upcoming Simulations
                  </p>
                  <div className="space-y-2">
                    {SCIENCE_SIMULATIONS.map((sim) => (
                      <Link
                        key={sim.id}
                        href={addTenantParam(`/virtual-labs/${sim.slug}`)}
                        className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                              {sim.title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {sim.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                          {sim.badge || 'Interactive'}
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    ))}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    We are adding more 3D simulations soon (e.g. Moon phases, Earth seasons) and they will automatically appear here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

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
                    
                    {/* Free Access Badge with Currency Context */}
                    {campus.id !== 'university' && (
                      <div className="mb-4 py-2 px-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
                        <p className="text-xs text-center font-semibold text-green-700 dark:text-green-400">
                          {market === 'middle-east' ? (
                            '✨ Free Access • Premium Plans Available'
                          ) : hasLocalization ? (
                            `✨ Free Forever • Premium from ${minPremiumLocal}/month`
                          ) : (
                            '✨ Free Forever • Premium from $5/month'
                          )}
                        </p>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Link 
                      href={addTenantParam(campus.href)}
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
              {featureLinks.filter(item => item.show).map((item) => (
                <Tooltip key={item.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link 
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        const finalUrl = addTenantParam(item.href);
                        if (typeof window !== 'undefined') {
                          window.location.href = finalUrl;
                        }
                      }}
                    >
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

          {/* White-Label Showcase Section - Only for SmartClass24 tenant */}
          {tenantId === 'smartclass24' && (
            <div className="mt-16 border-t pt-12 dark:border-gray-800">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 mb-4">
                  <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300">For Schools & Institutions</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                  Get Your Own Branded Learning Platform
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Launch your white-label education platform in under 24 hours. Complete branding, custom domain, and curriculum flexibility.
                </p>
                
                {/* Multi-Curriculum Live Badge */}
                <div className="flex justify-center gap-3 mt-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Multi-Curriculum: West African (BECE/WASSCE), US Common Core, UK GCSE</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
                {/* Live Example Card */}
                <Card className="relative overflow-hidden border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Live Example</p>
                        <h4 className="font-bold text-gray-900 dark:text-white">Wisdom Warehouse</h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      International school in UAE launched their custom-branded platform in 3 weeks. Same technology, their identity.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-green-500"></div>
                        <span className="text-gray-700 dark:text-gray-300">100% uptime since Jan 2026</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-green-500"></div>
                        <span className="text-gray-700 dark:text-gray-300">US Common Core-aligned + alternative holistic model</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-green-500"></div>
                        <span className="text-gray-700 dark:text-gray-300">Complete brand customization</span>
                      </div>
                    </div>
                    <a 
                      href="https://www.smartclass24.com/?tenant=wisdomwarehouse" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      View Live Demo
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>

                {/* What You Get Card */}
                <Card className="relative overflow-hidden border-2 border-indigo-200/50 dark:border-indigo-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-300/20 to-blue-300/20 rounded-full blur-3xl"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">What's Included</h4>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded bg-indigo-100 dark:bg-indigo-900/30">
                          <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Your Brand Identity</p>
                          <p className="text-xs text-muted-foreground">Logo, colors, domain name</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded bg-indigo-100 dark:bg-indigo-900/30">
                          <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Custom Curriculum</p>
                          <p className="text-xs text-muted-foreground">West African (BECE/WASSCE), US Common Core, UK GCSE • One content base, any curriculum</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded bg-indigo-100 dark:bg-indigo-900/30">
                          <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Full Platform Access</p>
                          <p className="text-xs text-muted-foreground">Arena, Labs, Analytics, Support</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded bg-indigo-100 dark:bg-indigo-900/30">
                          <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Data Isolation</p>
                          <p className="text-xs text-muted-foreground">Complete privacy & security</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center space-y-4">
                <Link href="/contact?interest=whitelabel">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl">
                    <Building2 className="mr-2 h-5 w-5" />
                    Get Your Platform
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <div>
                  <Link
                    href={addTenantParam(isGlobal ? '/pricing/global' : '/pricing')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    View Detailed Pricing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Earn Premium Banner - Only for logged in users */}
          {user && !user.isAnonymous && (
          <div className="mt-12 max-w-5xl mx-auto">
            <EarnPremiumBanner variant="full" dismissible={false} showProgress={true} />
          </div>
          )}

          {/* Simple Pricing Preview - Only for SmartClass24 */}
          {tenantId === 'smartclass24' && (
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-br from-violet-50/80 via-indigo-50/80 to-purple-50/80 dark:from-violet-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-2 border-violet-200/50 dark:border-violet-800/50 backdrop-blur-sm shadow-lg max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <span className="text-sm font-bold text-violet-700 dark:text-violet-300">Flexible Pricing for Everyone</span>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-black text-2xl text-gray-900 dark:text-white">{formatCurrency(0)}</p>
                    <p className="text-xs text-muted-foreground">Free Forever</p>
                  </div>
                  <div className="h-12 w-px bg-violet-200 dark:bg-violet-800"></div>
                  <div className="text-center">
                    <p className="font-black text-2xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      {hasLocalization ? `${minPremiumLocal}-${maxPremiumLocal}` : '$5-10'}
                    </p>
                    <p className="text-xs text-muted-foreground">Premium Student</p>
                  </div>
                  <div className="h-12 w-px bg-violet-200 dark:bg-violet-800"></div>
                  <div className="text-center">
                    <p className="font-black text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {country?.id === 'ghana' ? '₵1,200+' : '$299+'}
                    </p>
                    <p className="text-xs text-muted-foreground">For Schools</p>
                  </div>
                </div>
                <Link href={addTenantParam(isGlobal ? '/pricing/global' : '/pricing')}>
                  <Button variant="outline" size="sm" className="border-violet-400 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30">
                    View All Plans & Features
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Premium Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 font-medium">
              Trusted by schools and students {market === 'middle-east' ? (
                <>in <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Dubai & UAE</span></>
              ) : market === 'us' ? (
                <>across <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">the United States</span></>
              ) : hasLocalization && country ? (
                <>across <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">{country.name}</span></>
              ) : (
                <>worldwide</>
              )}
            </p>
            
            {/* Value Proposition with Currency */}
            {(hasLocalization || market !== 'middle-east') && (
              <div className="mb-6 px-4">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-violet-200/30 dark:border-violet-800/30 backdrop-blur-sm shadow-lg">
                  <span className="text-2xl">💎</span>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Premium Features</p>
                    <p className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      {country?.id === 'ghana' ? (
                        <>Free to Start • ₵20-50/month Premium</>
                      ) : hasLocalization ? (
                        <>Free to Start • {minPremiumLocal}-{maxPremiumLocal}/month Premium</>
                      ) : (
                        <>Free to Start • $5-10/month Premium</>
                      )}
                    </p>
                  </div>
                  <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="group px-5 py-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Curriculum Aligned</p>
                <p className="font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {market === 'middle-east' ? 'Personalized Curriculum' : market === 'us' ? 'Common Core' : hasLocalization && country?.examSystem?.conductor ? `${country.examSystem.conductor} Standard` : 'International Standard'}
                </p>
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
      
      {/* Dev Mode - Welcome Reset Button (only in development) */}
      {process.env.NODE_ENV === 'development' && !showWelcome && (
        <button
          onClick={() => {
            localStorage.removeItem('hasSeenWelcome');
            setShowWelcome(true);
          }}
          className="fixed bottom-4 right-4 z-40 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          title="Feature temporarily disabled - Only shows with ?welcome=true"
        >
          <Sparkles className="h-4 w-4" />
          Show Welcome (Disabled)
        </button>
      )}
      
      {/* Floating Earn Premium Banner - Only for logged in users */}
      {user && !user.isAnonymous && <EarnPremiumBanner variant="floating" dismissible={true} />}
    </div>
  );
}
