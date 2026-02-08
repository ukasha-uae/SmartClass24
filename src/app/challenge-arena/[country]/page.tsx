'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Zap, Calendar, Users, Target, TrendingUp, 
  Clock, Award, Play, Plus, Eye, Swords, School, Bell,
  BrainCircuit, ChevronRight, ChevronDown, ChevronUp, BookOpen, Calculator, FlaskConical, Globe, Languages, Palette, Computer, Music
} from 'lucide-react';
import Link from 'next/link';
import { useTenantLink } from '@/hooks/useTenantLink';
import {
  getPlayerProfile,
  createOrUpdatePlayer,
  getMyChallenges,
  getChallengeNotifications,
  getSchoolRankings,
  getMatchHistory,
  initializeChallengeData,
  getAllPlayers,
  Player,
  Challenge,
  SchoolRanking,
} from '@/lib/challenge';
import { GamificationProfile } from '@/components/GamificationProfile';
import { getLevel } from '@/lib/gamification';
import { useFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import CampusSelector from '@/components/CampusSelector';
import { useLocalization } from '@/hooks/useLocalization';
import { useParams, notFound, useRouter, useSearchParams } from 'next/navigation';
import { COUNTRIES } from '@/lib/localization/countries/index';
import { FEATURE_FLAGS } from '@/lib/featureFlags';
import { getAvailableSubjects } from '@/lib/challenge-questions-exports';
import CoinStore from '@/components/premium/CoinStore';
import TransactionHistory from '@/components/premium/TransactionHistory';
import SubscriptionManagement from '@/components/premium/SubscriptionManagement';
import { isPremiumUser, hasPremiumFeature, getQuestionBankLimit } from '@/lib/monetization';
import { Coins } from 'lucide-react';

export default function LocalizedChallengeArenaPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addTenantParam = useTenantLink();
  const countryParam = params.country as string;
  
  // Validate country parameter
  const isValidCountry = Object.keys(COUNTRIES).includes(countryParam?.toLowerCase());
  if (!isValidCountry) {
    notFound();
  }

  const { country, setCountry } = useLocalization();
  const [player, setPlayer] = useState<Player | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [schoolRankings, setSchoolRankings] = useState<SchoolRanking[]>([]);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('play');
  const [educationLevel, setEducationLevel] = useState<'Primary' | 'JHS' | 'SHS'>('JHS');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showCoinStore, setShowCoinStore] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showSubscriptionManagement, setShowSubscriptionManagement] = useState(false);
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());

  const { firestore, user } = useFirebase();
  
  // Check premium status
  const userId = user?.uid || `anon-${Date.now()}`;
  const isPremium = isPremiumUser(userId);
  const profileRef = useMemo(() => (user && firestore) ? doc(firestore, `students/${user.uid}`) : null, [user, firestore]);
  const { data: userProfile } = useDoc(profileRef);

  // Determine initial education level based on priority:
  // 1. URL parameter (if coming from home page)
  // 2. User profile educationLevel (if logged in)
  // 3. localStorage (if previously selected)
  // 4. Default to 'Primary'
  // Extract stable values for dependency array
  const levelParam = searchParams?.get('level') || null;
  const profileEducationLevel = userProfile?.educationLevel || null;
  
  useEffect(() => {
    let initialLevel: 'Primary' | 'JHS' | 'SHS' = 'JHS';
    
    // Priority 1: Check URL parameter
    if (levelParam) {
      const normalizedLevel = levelParam.toUpperCase();
      if (normalizedLevel === 'SHS' || normalizedLevel === 'JHS' || normalizedLevel === 'PRIMARY') {
        initialLevel = normalizedLevel === 'PRIMARY' ? 'Primary' : normalizedLevel as 'Primary' | 'JHS' | 'SHS';
      }
    } else {
      // Priority 2: Check user profile
      if (profileEducationLevel) {
        const profileLevel = profileEducationLevel.toUpperCase();
        if (profileLevel === 'SHS' || profileLevel === 'JHS' || profileLevel === 'PRIMARY') {
          initialLevel = profileLevel === 'PRIMARY' ? 'Primary' : profileLevel as 'Primary' | 'JHS' | 'SHS';
        }
      } else {
        // Priority 3: Check localStorage
        if (typeof window !== 'undefined') {
          const savedLevel = localStorage.getItem('userEducationLevel') as 'Primary' | 'JHS' | 'SHS' | null;
          if (savedLevel && (savedLevel === 'Primary' || savedLevel === 'JHS' || savedLevel === 'SHS')) {
            initialLevel = savedLevel;
          }
        }
      }
    }
    
    // Only update if level actually changed to prevent unnecessary re-renders
    setEducationLevel(prevLevel => {
      if (prevLevel !== initialLevel) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userEducationLevel', initialLevel);
        }
        return initialLevel;
      }
      return prevLevel;
    });
  }, [levelParam, profileEducationLevel]);

  // Set country from URL parameter (only on initial load)
  useEffect(() => {
    const matchedCountry = COUNTRIES[countryParam];
    if (matchedCountry && (!country || country.id !== countryParam)) {
      setCountry(countryParam);
    }
  }, [countryParam, setCountry]);

  // Handle country changes from CountrySelector - navigate to new URL
  useEffect(() => {
    if (country && country.id !== countryParam) {
      router.push(`/challenge-arena/${country.id}`);
    }
  }, [country, countryParam, router]);

  // Country-specific color theming
  const getCountryColors = () => {
    if (country?.id === 'nigeria') {
      return {
        primary: 'from-green-600 to-green-700',
        secondary: 'from-green-700 to-emerald-800',
        accent: 'from-emerald-500 to-green-600',
        cardBg: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
        badgeIcon: '🏆',
        tagline: 'Challenge Arena'
      };
    } else if (country?.id === 'ghana') {
      return {
        primary: 'from-red-600 to-red-700',
        secondary: 'from-yellow-500 to-orange-500',
        accent: 'from-green-600 to-green-700',
        cardBg: 'from-red-50 to-yellow-50 dark:from-red-950/30 dark:to-yellow-950/30',
        badgeIcon: '🏆',
        tagline: 'Challenge Arena'
      };
    } else if (country?.id === 'sierra-leone') {
      return {
        primary: 'from-green-600 to-green-700',
        secondary: 'from-blue-600 to-blue-700',
        accent: 'from-blue-500 to-green-600',
        cardBg: 'from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30',
        badgeIcon: '🏆',
        tagline: 'Challenge Arena'
      };
    } else if (country?.id === 'liberia') {
      return {
        primary: 'from-red-600 to-blue-700',
        secondary: 'from-blue-700 to-red-800',
        accent: 'from-blue-500 to-red-600',
        cardBg: 'from-red-50 to-blue-50 dark:from-red-950/30 dark:to-blue-950/30',
        badgeIcon: '🏆',
        tagline: 'Challenge Arena'
      };
    } else if (country?.id === 'gambia') {
      return {
        primary: 'from-red-600 to-blue-700',
        secondary: 'from-blue-700 to-green-800',
        accent: 'from-green-500 to-blue-600',
        cardBg: 'from-red-50 to-green-50 dark:from-red-950/30 dark:to-green-950/30',
        badgeIcon: '🏆',
        tagline: 'Challenge Arena'
      };
    }
    return {
      primary: 'from-blue-600 to-indigo-600',
      secondary: 'from-indigo-600 to-purple-600',
      accent: 'from-violet-500 to-purple-600',
      cardBg: 'from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30',
      badgeIcon: '🏆',
      tagline: 'Challenge Arena'
    };
  };

  const colors = getCountryColors();

  // Mock user for development/testing
  const mockUserId = user?.uid || `anon-${Date.now()}`;
  const mockUserProfile = userProfile || {
    studentName: user?.displayName || 'Guest Student',
    educationLevel: 'SHS' as const,
  };

  const loadData = useCallback(async () => {
    const uid = mockUserId;
    const profile = mockUserProfile;
    
    let existingPlayer = getPlayerProfile(uid);
    
    if (!existingPlayer) {
      existingPlayer = createOrUpdatePlayer({
        userId: uid,
        userName: profile?.studentName || 'Student',
        avatar: profile?.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
        school: profile?.schoolName || 'Test School',
        rating: 1200,
        winStreak: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        totalGames: 0,
        level: 'JHS',
      });
    }

    setPlayer(existingPlayer);
    setChallenges(getMyChallenges(uid));
    setNotifications(getChallengeNotifications(uid));
    setSchoolRankings(getSchoolRankings(country?.id));
    setTopPlayers(getAllPlayers().sort((a, b) => b.rating - a.rating).slice(0, 10));
    setMatchHistory(getMatchHistory(uid));
  }, [mockUserId, mockUserProfile, country]);

  useEffect(() => {
    if (hasInitialized) return;
    
    loadData();
    setHasInitialized(true);
  }, [hasInitialized, loadData]);

  const handleLevelChange = useCallback((newLevel: 'Primary' | 'JHS' | 'SHS') => {
    setEducationLevel(newLevel);
    if (player) {
      const updatedPlayer = createOrUpdatePlayer({
        ...player,
        level: newLevel
      });
      setPlayer(updatedPlayer);
    }
  }, [player]);

  // Get subjects for the selected level
  const availableSubjects = getAvailableSubjects(educationLevel);

  // Group SHS subjects by program
  const groupSubjectsByProgram = (subjects: string[]) => {
    if (educationLevel !== 'SHS') {
      return { 'All Subjects': { subjects, icon: BookOpen, color: 'from-blue-500 to-indigo-600', description: 'All available subjects' } };
    }

    type IconComponent = typeof BookOpen;
    const programs: Record<string, { subjects: string[]; icon: IconComponent; color: string; description: string }> = {
      'Core Subjects': {
        subjects: [],
        icon: BookOpen,
        color: 'from-blue-500 to-indigo-600',
        description: 'Required for all SHS programs'
      },
      'General Science': {
        subjects: [],
        icon: FlaskConical,
        color: 'from-green-500 to-emerald-600',
        description: 'Physics, Chemistry, Biology & Elective Mathematics'
      },
      'General Arts': {
        subjects: [],
        icon: Globe,
        color: 'from-purple-500 to-pink-600',
        description: 'Literature, History, Geography & Social Sciences'
      },
      'Business': {
        subjects: [],
        icon: Calculator,
        color: 'from-orange-500 to-red-600',
        description: 'Accounting, Business Management & Cost Accounting'
      },
      'Visual Arts': {
        subjects: [],
        icon: Palette,
        color: 'from-pink-500 to-rose-600',
        description: 'Art, Textiles & Graphic Design'
      },
      'Home Economics': {
        subjects: [],
        icon: BookOpen,
        color: 'from-amber-500 to-yellow-600',
        description: 'Food & Nutrition, Management & Clothing'
      },
      'Agricultural Science': {
        subjects: [],
        icon: FlaskConical,
        color: 'from-green-600 to-teal-600',
        description: 'Agriculture, Crop & Animal Husbandry'
      },
      'Technical': {
        subjects: [],
        icon: Computer,
        color: 'from-slate-500 to-gray-600',
        description: 'Technical Drawing, Construction & Engineering'
      }
    };

    subjects.forEach(subject => {
      if (subject === 'Mixed') {
        programs['Core Subjects'].subjects.push(subject);
      } else if (['Core Mathematics', 'English Language', 'Integrated Science', 'Social Studies'].includes(subject)) {
        programs['Core Subjects'].subjects.push(subject);
      } else if (['Physics', 'Chemistry', 'Biology', 'Elective Mathematics'].includes(subject)) {
        programs['General Science'].subjects.push(subject);
      } else if (['Literature in English', 'History', 'Geography', 'Economics', 'Government', 'Christian Religious Studies', 'Islamic Religious Studies'].includes(subject)) {
        programs['General Arts'].subjects.push(subject);
      } else if (['Accounting', 'Business Management', 'Cost Accounting'].includes(subject)) {
        programs['Business'].subjects.push(subject);
      } else if (['General Knowledge in Art', 'Textiles', 'Graphic Design'].includes(subject)) {
        programs['Visual Arts'].subjects.push(subject);
      } else if (['Food and Nutrition', 'Management in Living', 'Clothing and Textiles'].includes(subject)) {
        programs['Home Economics'].subjects.push(subject);
      } else if (['Agricultural Science', 'Crop Husbandry', 'Animal Husbandry'].includes(subject)) {
        programs['Agricultural Science'].subjects.push(subject);
      } else if (['Technical Drawing', 'Building Construction', 'Woodwork', 'Metalwork', 'Electronics', 'Auto Mechanics'].includes(subject)) {
        programs['Technical'].subjects.push(subject);
      }
    });

    // Remove empty programs
    Object.keys(programs).forEach(key => {
      if (programs[key].subjects.length === 0) {
        delete programs[key];
      }
    });

    return programs;
  };

  const subjectGroups = groupSubjectsByProgram(availableSubjects);

  // Subject icons mapping
  const getSubjectIcon = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('math')) return Calculator;
    if (subjectLower.includes('english') || subjectLower.includes('language')) return BookOpen;
    if (subjectLower.includes('science') || subjectLower.includes('integrated')) return FlaskConical;
    if (subjectLower.includes('social')) return Globe;
    if (subjectLower.includes('ict') || subjectLower.includes('computing')) return Computer;
    if (subjectLower.includes('creative') || subjectLower.includes('arts')) return Palette;
    if (subjectLower.includes('french')) return Languages;
    if (subjectLower.includes('arabic')) return Languages;
    if (subjectLower.includes('music')) return Music;
    if (subjectLower.includes('physics')) return FlaskConical;
    if (subjectLower.includes('chemistry')) return FlaskConical;
    if (subjectLower.includes('biology')) return FlaskConical;
    if (subjectLower.includes('history')) return Globe;
    if (subjectLower.includes('geography')) return Globe;
    if (subjectLower.includes('economics')) return Calculator;
    if (subjectLower.includes('government')) return Globe;
    if (subjectLower.includes('literature')) return BookOpen;
    if (subjectLower.includes('accounting')) return Calculator;
    if (subjectLower.includes('business')) return Calculator;
    if (subjectLower.includes('art') || subjectLower.includes('textiles') || subjectLower.includes('graphic')) return Palette;
    if (subjectLower.includes('food') || subjectLower.includes('nutrition') || subjectLower.includes('management') || subjectLower.includes('clothing')) return BookOpen;
    if (subjectLower.includes('agricultural') || subjectLower.includes('crop') || subjectLower.includes('animal')) return FlaskConical;
    if (subjectLower.includes('technical') || subjectLower.includes('drawing') || subjectLower.includes('construction') || subjectLower.includes('woodwork') || subjectLower.includes('metalwork') || subjectLower.includes('electronics') || subjectLower.includes('auto') || subjectLower.includes('mechanics')) return Computer;
    return BookOpen;
  };

  // Subject colors mapping
  const getSubjectColor = (subject: string, index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-purple-500 to-pink-500',
      'from-yellow-500 to-amber-500',
      'from-indigo-500 to-blue-500',
      'from-teal-500 to-green-500',
      'from-rose-500 to-pink-500',
    ];
    return colors[index % colors.length];
  };

  const pendingChallenges = challenges.filter(c => 
    c.status === 'pending' && 
    c.opponents.some(o => o.userId === (user?.uid || 'user-1') && o.status === 'invited')
  );

  const activeChallenges = challenges.filter(c => 
    c.status === 'accepted' || c.status === 'in-progress'
  );

  // Show expired/declined challenges separately so users know what happened
  const expiredChallenges = challenges.filter(c => c.status === 'expired');

  const completedChallenges = challenges.filter(c => c.status === 'completed');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-muted-foreground';
  };

  // Remove the sign-in requirement block - allow access without auth

  if (!player) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Challenge Arena...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Premium Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Large gradient orbs with blur */}
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${colors.primary} opacity-20 rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '8s' }} />
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr ${colors.accent} opacity-20 rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${colors.secondary} opacity-10 rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '12s', animationDelay: '2s' }} />
        {/* Additional floating orbs */}
        <div className={`absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-amber-300/20 via-orange-300/20 to-red-300/20 rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '6s' }} />
        <div className={`absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-blue-300/20 via-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '7s', animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
        {/* Premium Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-full border border-amber-200/50 dark:border-amber-800/50">
                <span className="text-amber-700 dark:text-amber-400 font-semibold text-sm flex items-center gap-2">
                  <span className="text-xl">{colors.badgeIcon}</span>
                  <span>{colors.tagline}</span>
                </span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                <div className="text-5xl sm:text-6xl lg:text-7xl animate-pulse">🎮</div>
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                  Challenge Arena
                </h1>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-6">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
                  Compete with classmates and schools across your region
                </p>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <CampusSelector onLevelChange={handleLevelChange} defaultLevel={educationLevel} />
            </div>
          </div>
        </div>

        {/* Welcome & Multi-Country Info Banner */}
        <Card className={`mb-6 bg-gradient-to-r ${colors.cardBg} border-2`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-br ${colors.primary}`}>
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">Welcome to Regional Challenges!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You're now part of a broader learning community. Challenge students from other schools and regions.
                </p>
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Use the country selector above to switch between countries and see different school rankings. School battles are filtered by your selected country!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Player Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6">
          <div className="group relative bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-blue-200/30 dark:border-blue-800/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 group-hover:scale-110 transition-transform inline-block">⭐</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{player.rating}</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Rating</div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-amber-500/10 to-orange-600/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-amber-200/30 dark:border-amber-800/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all inline-block">🏆</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{player.wins}</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Wins</div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-emerald-500/10 to-teal-600/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-emerald-200/30 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 group-hover:scale-110 transition-transform inline-block">🔥</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{player.winStreak}</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Win Streak</div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-purple-200/30 dark:border-purple-800/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 group-hover:scale-110 transition-transform inline-block">🎯</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{player.totalGames}</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Total Games</div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-yellow-500/10 to-amber-600/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-yellow-200/30 dark:border-yellow-800/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-amber-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all inline-block">💰</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{player.coins || 0}</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Coins</div>
              <div className="mt-2 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCoinStore(true)}
                  className="w-full text-xs h-6 px-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30 border border-yellow-300/30"
                >
                  <Coins className="h-3 w-3 mr-1" />
                  Buy
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTransactionHistory(true)}
                    className="flex-1 text-[10px] h-5 px-1"
                    title="Transaction History"
                  >
                    History
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSubscriptionManagement(true)}
                    className="flex-1 text-[10px] h-5 px-1"
                    title={isPremium ? 'Manage Subscription' : 'Subscribe'}
                  >
                    {isPremium ? 'Manage' : 'Sub'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Player Profile Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-primary shadow-lg">
                {player.avatar ? (
                  <AvatarImage src={player.avatar} alt={player.userName} />
                ) : (
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                    {player.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{player.userName}</h2>
                <p className="text-sm text-muted-foreground">{player.school}</p>
                <Badge variant="outline" className="mt-1">{player.level || 'JHS'}</Badge>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-primary">Level {Math.floor((player.xp || 0) / 100) + 1}</div>
                <div className="text-xs text-muted-foreground">{player.xp || 0} XP</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.slice(0, 3).map((notif, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-gray-900 rounded-lg flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                  </div>
                  {notif.actionUrl && (
                    <Link href={notif.actionUrl}>
                      <Button size="sm">View</Button>
                    </Link>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4">
            <TabsTrigger value="play">Play</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="leaderboard">Rankings</TabsTrigger>
            <TabsTrigger value="history" className="hidden sm:block">History</TabsTrigger>
          </TabsList>

          {/* Play Tab */}
          <TabsContent value="play" className="space-y-4">
            {/* Premium Leaderboard Preview */}
            <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 backdrop-blur-xl border-2 border-amber-200/30 dark:border-amber-800/30 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        Top Players
                      </CardTitle>
                      <CardDescription className="text-xs">See where you rank among the best</CardDescription>
                    </div>
                  </div>
                  <Link href={`#leaderboard`} onClick={(e) => { e.preventDefault(); setActiveTab('leaderboard'); }}>
                    <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topPlayers.slice(0, 5).map((p, idx) => {
                    const isCurrentUser = p.userId === player.userId;
                    return (
                      <div
                        key={p.userId}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isCurrentUser
                            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/50'
                            : 'bg-white/50 dark:bg-gray-900/50 hover:bg-white/70 dark:hover:bg-gray-900/70'
                        }`}
                      >
                        <div className={`text-2xl font-bold w-8 text-center ${getRankColor(idx + 1)}`}>
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </div>
                        <Avatar className="h-10 w-10 border-2 border-amber-200 dark:border-amber-800">
                          {p.avatar ? (
                            <AvatarImage src={p.avatar} alt={p.userName} />
                          ) : (
                            <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                              {p.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-amber-700 dark:text-amber-400' : ''}`}>
                              {p.userName}
                            </p>
                            {isCurrentUser && (
                              <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{p.school}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            {p.rating}
                          </div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                      </div>
                    );
                  })}
                  {topPlayers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No players yet. Be the first!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href={addTenantParam('/challenge-arena/practice')}>
                <Card className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 sm:p-8 rounded-2xl shadow-xl text-white overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🧠</div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">Practice Mode</h3>
                    <p className="text-base sm:text-lg mb-3 sm:mb-4 opacity-90">
                      Sharpen your skills without affecting your rating
                    </p>
                    <div className="space-y-2 mb-4 sm:mb-6">
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">👤</span>
                        <span className="text-sm sm:text-base">Solo Practice</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">⏱️</span>
                        <span className="text-sm sm:text-base">No time limit</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">🛡️</span>
                        <span className="text-sm sm:text-base">No rating change</span>
                      </div>
                    </div>
                    <div className="w-full bg-white text-green-600 text-center py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-gray-100 transition-colors">
                      Start Practice
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href={`/challenge-arena/quick-match?level=${educationLevel}`}>
                <Card className="relative bg-gradient-to-br from-orange-500 to-red-600 p-6 sm:p-8 rounded-2xl shadow-xl text-white overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">⚡</div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">Quick Match</h3>
                    <p className="text-base sm:text-lg mb-3 sm:mb-4 opacity-90">
                      Instant matchmaking with students at your level
                    </p>
                    <div className="space-y-2 mb-4 sm:mb-6">
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">👥</span>
                        <span className="text-sm sm:text-base">2 Players</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">⏱️</span>
                        <span className="text-sm sm:text-base">2 minutes</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">❓</span>
                        <span className="text-sm sm:text-base">10 questions</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">💎</span>
                        <span className="text-sm sm:text-base">100 pts/question</span>
                      </div>
                    </div>
                    <div className="w-full bg-white text-orange-600 text-center py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-gray-100 transition-colors">
                      Find Match
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href={`/challenge-arena/create?type=friend&level=${educationLevel}`}>
                <Card className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-6 sm:p-8 rounded-2xl shadow-xl text-white overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">👥</div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">Challenge Friend</h3>
                    <p className="text-base sm:text-lg mb-3 sm:mb-4 opacity-90">
                      Challenge a specific friend or classmate directly
                    </p>
                    <div className="space-y-2 mb-4 sm:mb-6">
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">👤</span>
                        <span className="text-sm sm:text-base">Choose opponent</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">⚡</span>
                        <span className="text-sm sm:text-base">Instant notification</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">🎯</span>
                        <span className="text-sm sm:text-base">Custom settings</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">🏆</span>
                        <span className="text-sm sm:text-base">Real-time battle</span>
                      </div>
                    </div>
                    <div className="w-full bg-white text-purple-600 text-center py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-gray-100 transition-colors">
                      Challenge Friend
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Premium Game Modes */}
              {FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaBoss && (
                <Link href={addTenantParam('/challenge-arena/boss-battle')}>
                  <Card className="relative bg-gradient-to-br from-red-500 to-orange-600 p-6 sm:p-8 rounded-2xl shadow-xl text-white overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-0">
                      <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🤖</div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                        Boss Battle
                      </h3>
                      <p className="text-base sm:text-lg mb-3 sm:mb-4 opacity-90">
                        Challenge the top-ranked players in {country?.name}
                      </p>
                      <div className="space-y-2 mb-4 sm:mb-6">
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">⚔️</span>
                          <span className="text-sm sm:text-base">Hard mode</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">💎</span>
                          <span className="text-sm sm:text-base">High rewards</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">🏆</span>
                          <span className="text-sm sm:text-base">AI Bosses</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">📝</span>
                          <span className="text-sm sm:text-base">
                            {!isPremium ? (
                              <span>Limited question bank <span className="text-yellow-300">(10 questions per subject)</span></span>
                            ) : (
                              <span>Full question bank <span className="text-green-300">(All questions available)</span></span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-white text-red-600 text-center py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-gray-100 transition-colors">
                        Start Battle
                      </div>
                    </div>
                  </Card>
                </Link>
              )}

              {FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaTournament && (
                <Link href={addTenantParam('/challenge-arena/tournaments')}>
                  <Card className="relative bg-gradient-to-br from-yellow-500 to-amber-600 p-6 sm:p-8 rounded-2xl shadow-xl text-white overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-0">
                      <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🏆</div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                        Tournaments
                      </h3>
                      <p className="text-base sm:text-lg mb-3 sm:mb-4 opacity-90">
                        Join competitive tournaments and win prizes
                      </p>
                      <div className="space-y-2 mb-4 sm:mb-6">
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">📊</span>
                          <span className="text-sm sm:text-base">Brackets</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">🎁</span>
                          <span className="text-sm sm:text-base">Win prizes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">📅</span>
                          <span className="text-sm sm:text-base">Weekly</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">📝</span>
                          <span className="text-sm sm:text-base">
                            {!isPremium ? (
                              <span>Limited question bank <span className="text-yellow-300">(10 questions per subject)</span></span>
                            ) : (
                              <span>Full question bank <span className="text-green-300">(All questions available)</span></span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-white text-yellow-600 text-center py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-gray-100 transition-colors">
                        Join Tournament
                      </div>
                    </div>
                  </Card>
                </Link>
              )}

              {FEATURE_FLAGS.V1_LAUNCH.showChallengeArenaSchool && (
                <Link href={addTenantParam('/challenge-arena/school-battle')}>
                  <Card className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-6 sm:p-8 rounded-2xl shadow-xl text-white overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-0">
                      <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🏫</div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
                        School vs School
                        <Badge className="text-xs bg-green-500/30 text-white border border-green-400/50">5 Countries</Badge>
                      </h3>
                      <p className="text-base sm:text-lg mb-3 sm:mb-4 opacity-90">
                        Represent your school in inter-school battles across regions
                      </p>
                      <div className="space-y-2 mb-4 sm:mb-6">
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">👥</span>
                          <span className="text-sm sm:text-base">Team battle</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">🏅</span>
                          <span className="text-sm sm:text-base">School pride</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">🏆</span>
                          <span className="text-sm sm:text-base">Multi-region</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/80 mr-2">📝</span>
                          <span className="text-sm sm:text-base">
                            {!isPremium ? (
                              <span>Limited question bank <span className="text-yellow-300">(10 questions per subject)</span></span>
                            ) : (
                              <span>Full question bank <span className="text-green-300">(All questions available)</span></span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-white text-purple-600 text-center py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-gray-100 transition-colors">
                        Start Battle
                      </div>
                    </div>
                  </Card>
                </Link>
              )}
            </div>
          </TabsContent>

          {/* Active Challenges Tab */}
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
                <CardDescription>Challenges in progress or awaiting response</CardDescription>
              </CardHeader>
              {activeChallenges.length === 0 && pendingChallenges.length === 0 ? (
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Swords className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No active challenges</p>
                  <Link href={`/challenge-arena/${countryParam}/quick-match`}>
                    <Button className="mt-4">Start Playing</Button>
                  </Link>
                </CardContent>
              ) : (
                <CardContent className="space-y-4">
                  {pendingChallenges.map(challenge => (
                    <Card key={challenge.id} className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">Challenge Invitation</h3>
                              <Badge variant="secondary">Pending</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {challenge.creatorName} from {challenge.creatorSchool} has challenged you!
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="outline">{challenge.subject}</Badge>
                              <Badge variant="outline">{challenge.difficulty}</Badge>
                              <Badge variant="outline">{challenge.questionCount} questions</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/challenge-arena/${countryParam}/play/${challenge.id}`}>
                            <Button size="sm">Accept Challenge</Button>
                          </Link>
                          <Button size="sm" variant="outline">Decline</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {activeChallenges.map(challenge => (
                    <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                vs {challenge.opponents.map(o => o.userName).join(', ')}
                              </h3>
                              <Badge variant={challenge.status === 'in-progress' ? 'default' : 'secondary'}>
                                {challenge.status}
                              </Badge>
                            </div>
                            <div className="flex gap-2 mb-2">
                              <Badge variant="outline">{challenge.subject}</Badge>
                              <Badge variant="outline">{challenge.difficulty}</Badge>
                              <Badge variant="outline">{challenge.questionCount} questions</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Created {formatDate(challenge.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Link href={`/challenge-arena/${countryParam}/play/${challenge.id}`}>
                          <Button size="sm" className="w-full sm:w-auto">
                            <Play className="h-4 w-4 mr-2" />
                            Continue Playing
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Top Players - {country?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {topPlayers.map((p, idx) => (
                    <div key={p.userId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`text-2xl font-bold ${getRankColor(idx + 1)}`}>
                        #{idx + 1}
                      </div>
                      <Avatar>
                        <AvatarFallback>{p.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{p.userName}</p>
                        <p className="text-xs text-muted-foreground">{p.school}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{p.rating}</p>
                        <p className="text-xs text-muted-foreground">{p.wins}W</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5 text-purple-500" />
                    School Rankings - {country?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {schoolRankings.slice(0, 10).map((school, idx) => (
                    <div key={school.school} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`text-2xl font-bold ${getRankColor(idx + 1)}`}>
                        #{idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{school.school}</p>
                        <p className="text-xs text-muted-foreground">
                          {school.totalStudents} players • Avg: {school.averageRating}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{school.totalWins}W</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Match History</CardTitle>
                <CardDescription>Your recent challenges and results</CardDescription>
              </CardHeader>
              {matchHistory.length === 0 ? (
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No match history yet</p>
                  <Link href={`/challenge-arena/${countryParam}/quick-match`}>
                    <Button className="mt-4">Start Your First Match</Button>
                  </Link>
                </CardContent>
              ) : (
                <CardContent className="space-y-3">
                  {matchHistory.map((match, idx) => (
                    <div key={idx} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            match.result === 'win' ? 'default' : 
                            match.result === 'draw' ? 'secondary' : 
                            'destructive'
                          }>
                            {match.result.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{match.subject}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(match.date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          vs {match.opponents.join(', ')}
                        </span>
                        <div className="flex items-center gap-3">
                          <span>Score: {match.myScore}</span>
                          <span className={match.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {match.ratingChange >= 0 ? '+' : ''}{match.ratingChange}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Coin Store Modal */}
      <CoinStore
        open={showCoinStore}
        onClose={() => setShowCoinStore(false)}
        userId={userId}
        onPurchaseComplete={() => {
          // Reload player data to update coins
          const updatedPlayer = getPlayerProfile(userId);
          if (updatedPlayer) {
            setPlayer(updatedPlayer);
          }
        }}
      />
      <TransactionHistory
        open={showTransactionHistory}
        onClose={() => setShowTransactionHistory(false)}
        userId={userId}
      />
      <SubscriptionManagement
        open={showSubscriptionManagement}
        onClose={() => setShowSubscriptionManagement(false)}
        userId={userId}
        onRenew={() => {
          setShowSubscriptionManagement(false);
          setShowCoinStore(true);
        }}
      />
    </div>
  );
}
