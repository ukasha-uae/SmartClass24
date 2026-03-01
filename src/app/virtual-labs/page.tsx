"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  virtualLabExperiments,
  FREE_VIRTUAL_LAB_SLUGS,
  getVirtualLabTrack,
  VIRTUAL_LAB_TRACK_LABELS,
  getVirtualLabAudience,
  VIRTUAL_LAB_AUDIENCE_LABELS,
  type VirtualLabTrack,
  type VirtualLabAudience,
} from '@/lib/virtual-labs-data';
import { FlaskConical, Dna, Zap, Globe, CheckCircle2, Trophy, Clock, Star, Crown, Calculator, Palette } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLabProgress } from '@/stores/lab-progress-store';
import { Progress } from "@/components/ui/progress";
import { V1RouteGuard, useV1FeatureAccess } from '@/components/V1RouteGuard';
import { useFirebase } from '@/firebase/provider';
import PremiumUnlockModal from '@/components/premium/PremiumUnlockModal';
import { ShareVirtualLabDialog } from '@/components/virtual-labs/ShareVirtualLabDialog';
import { LabAudioToggle } from '@/components/virtual-labs/LabAudioToggle';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useTenant } from '@/hooks/useTenant';
import { useEntitlements } from '@/hooks/useEntitlements';

type LabSubject = 'Biology' | 'Chemistry' | 'Physics' | 'Science' | 'Mathematics' | 'Art';

export default function VirtualLabsPage() {
  // V1 Route Guard: Check if user has access to virtual labs
  const { hasAccess, campus, mounted: accessMounted } = useV1FeatureAccess('virtualLabs');
  const { user, isUserLoading } = useFirebase();
  const [trackFilter, setTrackFilter] = useState<'All' | VirtualLabTrack>('All');
  const [audienceFilter, setAudienceFilter] = useState<'All' | VirtualLabAudience>('All');
  const [subjectFilter, setSubjectFilter] = useState<'All' | LabSubject>('All');
  const { completedLabs, totalXP, streak, isLabCompleted } = useLabProgress();
  const [mounted, setMounted] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const addTenantParam = useTenantLink();
  const { features } = useTenant();
  const entitlements = useEntitlements();
  
  const userId = user?.uid || 'guest';
  const hasVirtualLab = entitlements.canAccess.virtualLabsPremium;

  useEffect(() => {
    setMounted(true);
  }, []);

  const allSubjectOptions: LabSubject[] = ['Biology', 'Chemistry', 'Physics', 'Science', 'Mathematics', 'Art'];
  const trackSubjectOptions: LabSubject[] = trackFilter === 'science-lab'
    ? ['Biology', 'Chemistry', 'Physics', 'Science']
    : trackFilter === 'maths-lab'
      ? ['Mathematics']
      : trackFilter === 'art-lab'
        ? ['Art']
        : allSubjectOptions;

  useEffect(() => {
    if (subjectFilter !== 'All' && !trackSubjectOptions.includes(subjectFilter)) {
      setSubjectFilter('All');
    }
  }, [subjectFilter, trackSubjectOptions]);
  
  // CRITICAL: Wait for access check, auth, and entitlements to complete
  // This prevents showing locked labs while auth is still loading
  if (!accessMounted || isUserLoading || !entitlements.isResolved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-indigo-950/30 relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading virtual labs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  console.log('[Virtual Labs Page] userId:', userId, 'hasVirtualLab:', hasVirtualLab, 'isUserLoading:', isUserLoading);

  const subjectIcons = {
    Biology: Dna,
    Chemistry: FlaskConical,
    Physics: Zap,
    Science: Globe,
    Mathematics: Calculator,
    Art: Palette,
  };

  const subjectColors = {
    Biology: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
    Chemistry: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
    Physics: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
    Science: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30',
    Mathematics: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/30',
    Art: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
  };

  // Assign difficulty levels to labs (you can customize this)
  const labDifficulty: Record<string, 'Easy' | 'Medium' | 'Hard'> = {
    'solar-system': 'Easy',
    'food-tests': 'Easy',
    'litmus-test': 'Easy',
    'simple-circuits': 'Easy',
    'osmosis': 'Medium',
    'photosynthesis-oxygen-production': 'Medium',
    'hookes-law': 'Medium',
    'ohms-law': 'Hard',
    'projectile-motion': 'Hard',
    'cell-division-simulator': 'Hard',
  };

  const getDifficulty = (slug: string): 'Easy' | 'Medium' | 'Hard' => {
    return labDifficulty[slug] || 'Medium';
  };

  // Get labs based on server-backed premium entitlements
  const allLabs = hasVirtualLab
    ? virtualLabExperiments.experiments
    : virtualLabExperiments.experiments.filter((lab) =>
        FREE_VIRTUAL_LAB_SLUGS.includes(lab.slug as typeof FREE_VIRTUAL_LAB_SLUGS[number])
      );
  const allLabsTotal = virtualLabExperiments.experiments.length; // Total labs available
  // Get all labs (including locked ones) for display
  const allLabsIncludingLocked = virtualLabExperiments.experiments
    .filter(exp => trackFilter === 'All' || getVirtualLabTrack(exp) === trackFilter)
    .filter(exp => audienceFilter === 'All' || getVirtualLabAudience(exp) === audienceFilter)
    .filter(exp => subjectFilter === 'All' || exp.subject === subjectFilter);

  const completionRate = allLabs.length > 0
    ? Math.round((Object.keys(completedLabs).length / allLabs.length) * 100)
    : 0;

  const currentLevel = Math.floor(totalXP / 500) + 1;

  // V1 Route Guard: Wrap content to check access
  return (
    <V1RouteGuard campus={campus} feature="virtualLabs">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-indigo-950/30 relative overflow-hidden">
        {/* Premium Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/20 via-violet-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-300/20 via-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-300/10 via-purple-300/10 to-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Premium Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-6xl sm:text-7xl animate-pulse">🔬</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Virtual Labs
              </h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
              Master science and mathematics through hands-on simulations.{' '}
              {!hasVirtualLab ? (
                <>
                  <span className="font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{allLabs.length}</span> labs free,{' '}
                  <span className="font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{allLabsTotal - allLabs.length}</span> more with Virtual Lab Premium!
                </>
              ) : (
                <>
                  <span className="font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{allLabsTotal}</span> interactive labs unlocked!
                </>
              )}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tracks: {VIRTUAL_LAB_TRACK_LABELS['science-lab']} • {VIRTUAL_LAB_TRACK_LABELS['maths-lab']} • {VIRTUAL_LAB_TRACK_LABELS['art-lab']} (Under Construction)
            </p>
            <div className="mt-4 flex justify-center">
              <LabAudioToggle />
            </div>
            {userId !== 'guest' && features.enableReferrals && (
              <div className="flex justify-center">
                <ShareVirtualLabDialog
                  labTitle="Virtual Labs"
                  labSlug=""
                  subject="Science"
                  userId={userId}
                />
              </div>
            )}
          </div>

          {/* Premium Progress Section */}
          {mounted && (
            <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full blur-3xl"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {/* Title and Level */}
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🏆</div>
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">Your Progress</h3>
                      <Badge className="mt-1 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border-2 border-purple-300 dark:border-purple-700 text-xs font-bold">
                        Level {currentLevel}
                      </Badge>
                    </div>
                  </div>

                  {/* Premium Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="group p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border-2 border-green-200/30 dark:border-green-800/30 hover:scale-105 transition-all">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mb-1" />
                      <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{completionRate}%</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Complete</p>
                    </div>
                    <div className="group p-3 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl border-2 border-yellow-200/30 dark:border-yellow-800/30 hover:scale-105 transition-all">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mb-1" />
                      <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{Object.keys(completedLabs).length}/{allLabs.length}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Labs</p>
                    </div>
                    <div className="group p-3 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border-2 border-orange-200/30 dark:border-orange-800/30 hover:scale-105 transition-all">
                      <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400 mb-1" />
                      <p className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{streak}d</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Streak</p>
                    </div>
                    <div className="group p-3 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl border-2 border-purple-200/30 dark:border-purple-800/30 hover:scale-105 transition-all">
                      <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400 mb-1" />
                      <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{totalXP}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">XP</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Premium Filter Tabs */}
          <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-xl">
            <CardContent className="p-6">
              <div className="mb-6">
                <p className="text-sm font-bold mb-3 bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">Track</p>
                <div className="flex flex-wrap gap-2">
                  {([
                    ['All', 'All Tracks'],
                    ['science-lab', VIRTUAL_LAB_TRACK_LABELS['science-lab']],
                    ['maths-lab', VIRTUAL_LAB_TRACK_LABELS['maths-lab']],
                    ['art-lab', `${VIRTUAL_LAB_TRACK_LABELS['art-lab']} (Under Construction)`],
                  ] as const).map(([trackValue, label]) => (
                    <button
                      key={trackValue}
                      onClick={() => setTrackFilter(trackValue)}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 ${
                        trackFilter === trackValue
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold mb-3 bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">Subject</p>
                <div className="flex flex-wrap gap-2">
                  {(['All', ...trackSubjectOptions] as const).map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSubjectFilter(subject)}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 ${
                        subjectFilter === subject
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {subject === 'All' ? 'All Subjects' : subject}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold mb-3 bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">Level Band</p>
                <div className="flex flex-wrap gap-2">
                  {([
                    ['All', 'All Levels'],
                    ['primary-school', VIRTUAL_LAB_AUDIENCE_LABELS['primary-school']],
                    ['middle-school', VIRTUAL_LAB_AUDIENCE_LABELS['middle-school']],
                    ['high-school', VIRTUAL_LAB_AUDIENCE_LABELS['high-school']],
                  ] as const).map(([audienceValue, label]) => (
                    <button
                      key={audienceValue}
                      onClick={() => setAudienceFilter(audienceValue)}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 ${
                        audienceFilter === audienceValue
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold">{allLabsIncludingLocked.length}</span> labs
              </p>
              
            </CardContent>
          </Card>

          {/* Premium Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {Object.entries(subjectIcons).map(([subject, Icon]) => {
              const availableCount = allLabs.filter(exp => exp.subject === subject).length;
              const totalCount = virtualLabExperiments.experiments.filter(exp => exp.subject === subject).length;
              const colors = {
                Biology: { bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-200/30 dark:border-green-800/30', icon: 'text-green-600 dark:text-green-400', text: 'from-green-600 to-emerald-600' },
                Chemistry: { bg: 'from-orange-500/10 to-amber-500/10', border: 'border-orange-200/30 dark:border-orange-800/30', icon: 'text-orange-600 dark:text-orange-400', text: 'from-orange-600 to-amber-600' },
                Physics: { bg: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-200/30 dark:border-blue-800/30', icon: 'text-blue-600 dark:text-blue-400', text: 'from-blue-600 to-indigo-600' },
                Science: { bg: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-200/30 dark:border-violet-800/30', icon: 'text-violet-600 dark:text-violet-400', text: 'from-violet-600 to-purple-600' },
                Mathematics: { bg: 'from-fuchsia-500/10 to-pink-500/10', border: 'border-fuchsia-200/30 dark:border-fuchsia-800/30', icon: 'text-fuchsia-600 dark:text-fuchsia-400', text: 'from-fuchsia-600 to-pink-600' },
                Art: { bg: 'from-rose-500/10 to-pink-500/10', border: 'border-rose-200/30 dark:border-rose-800/30', icon: 'text-rose-600 dark:text-rose-400', text: 'from-rose-600 to-pink-600' },
              };
              const color = colors[subject as keyof typeof colors];
              return (
                <div key={subject} className={`group relative p-5 bg-gradient-to-br ${color.bg} backdrop-blur-sm rounded-2xl border-2 ${color.border} shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color.bg.replace('/10', '/20')} rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
                  <div className="relative flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/60 dark:bg-black/20 border border-white/30 dark:border-white/10 shadow-inner">
                      <Icon className={`h-8 w-8 ${color.icon} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div>
                      <p className={`text-3xl font-bold bg-gradient-to-r ${color.text} bg-clip-text text-transparent`}>
                        {hasVirtualLab ? totalCount : `${availableCount}/${totalCount}`}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{subject}</p>
                      {!hasVirtualLab && availableCount < totalCount && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mt-1">
                          Upgrade for {totalCount - availableCount} more
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium Info Banner for Free Users */}
          {!hasVirtualLab && allLabs.length < allLabsTotal && (
            <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-2 border-yellow-200/50 dark:border-yellow-800/50">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="font-bold text-yellow-900 dark:text-yellow-100">
                      Unlock All {allLabsTotal} Labs with Virtual Lab Premium!
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      You're currently viewing {allLabs.length} free labs. Upgrade to access all {allLabsTotal} interactive experiments.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowUnlockModal(true)}
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                >
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Premium Experiments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allLabsIncludingLocked.map((experiment) => {
              const isLocked = !allLabs.some(lab => lab.slug === experiment.slug);
              const Icon = subjectIcons[experiment.subject as keyof typeof subjectIcons] ?? Globe;
              const colorClass = subjectColors[experiment.subject as keyof typeof subjectColors] ?? subjectColors.Science;
              const trackLabel = VIRTUAL_LAB_TRACK_LABELS[getVirtualLabTrack(experiment)];
              const isArtUnderConstruction = getVirtualLabTrack(experiment) === 'art-lab';
              const audienceLabel = VIRTUAL_LAB_AUDIENCE_LABELS[getVirtualLabAudience(experiment)];
              const isCompleted = mounted && isLabCompleted(experiment.id);
              const difficulty = getDifficulty(experiment.id);
              const estimatedXP = difficulty === 'Easy' ? 50 : difficulty === 'Medium' ? 75 : 100;
              
              const difficultyColors = {
                Easy: { bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-200/30 dark:border-green-800/30', text: 'from-green-600 to-emerald-600' },
                Medium: { bg: 'from-yellow-500/10 to-amber-500/10', border: 'border-yellow-200/30 dark:border-yellow-800/30', text: 'from-yellow-600 to-amber-600' },
                Hard: { bg: 'from-red-500/10 to-orange-500/10', border: 'border-red-200/30 dark:border-red-800/30', text: 'from-red-600 to-orange-600' },
              };
              const diffColor = difficultyColors[difficulty];
              
              return (
                <div key={experiment.id} className="relative">
                  {isLocked && (
                    <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <div className="text-center p-4">
                        <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-white font-bold mb-2">Premium Only</p>
                        <Button 
                          size="sm"
                          onClick={() => setShowUnlockModal(true)}
                          className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                        >
                          Unlock
                        </Button>
                      </div>
                    </div>
                  )}
                  <Link href={isLocked ? '#' : addTenantParam(`/virtual-labs/${experiment.slug}`)} onClick={(e) => isLocked && (e.preventDefault(), setShowUnlockModal(true))}>
                    <Card className={`group h-full hover:shadow-2xl transition-all duration-300 ${isLocked ? 'cursor-not-allowed opacity-60' : 'hover:scale-[1.02] cursor-pointer'} border-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden ${
                      isCompleted 
                        ? 'border-green-400/50 dark:border-green-600/50 bg-green-50/50 dark:bg-green-950/20' 
                        : isLocked
                        ? 'border-gray-300/50 dark:border-gray-700/50'
                        : 'border-purple-200/50 dark:border-purple-800/50 hover:border-purple-400 dark:hover:border-purple-600'
                    }`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="relative">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass.split(' ')[0] ?? 'from-purple-500/10'} border-2 ${colorClass.split(' ')[2] ?? 'border-purple-500/30'}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          {isCompleted && (
                            <div className="absolute -top-1 -right-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-1 shadow-lg">
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge className={`${colorClass} border-2 font-semibold`}>
                            {experiment.subject}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-dashed">
                            {trackLabel}
                          </Badge>
                          {isArtUnderConstruction && (
                            <Badge variant="secondary" className="text-[10px]">
                              Under Construction
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {audienceLabel}
                          </Badge>
                          {isLocked ? (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0 font-semibold">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          ) : (
                            <Badge 
                              variant="outline" 
                              className={`text-xs border-2 bg-gradient-to-br ${diffColor.bg} ${diffColor.border} font-semibold`}
                            >
                              <span className={`bg-gradient-to-r ${diffColor.text} bg-clip-text text-transparent`}>{difficulty}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-violet-600 dark:group-hover:from-purple-400 dark:group-hover:to-violet-400 transition-all">{experiment.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-slate-600 dark:text-slate-400">
                        {experiment.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      {/* Premium Learning Objective */}
                      <div className="mb-4 p-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
                        <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1">
                          <span>🎯</span> You'll Learn:
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {(experiment as any).learningObjective || 'Master key scientific concepts through hands-on experimentation'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-3">
                          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="h-4 w-4" />
                            10-15 min
                          </span>
                          <span className="font-bold flex items-center gap-1 bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
                            <Star className="h-4 w-4" />
                            +{estimatedXP} XP
                          </span>
                        </div>
                        {isCompleted && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                            ✓ Done
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                </div>
              );
            })}
          </div>

          {allLabsIncludingLocked.length === 0 && (
            <Card className="text-center py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-xl">
              <CardContent>
                <div className="text-6xl mb-4 opacity-50">🔬</div>
                <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
                  No labs found for this track/filter combination.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Premium Unlock Modal */}
      <PremiumUnlockModal
        open={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        feature="virtual-labs"
        onSuccess={() => {
          setShowUnlockModal(false);
          window.location.reload();
        }}
      />
    </V1RouteGuard>
  );
}
