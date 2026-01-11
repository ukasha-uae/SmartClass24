"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCheck, Target, Award, Star, Users, Copy, Check, UserPlus, Bookmark, Gift } from "lucide-react";
import Link from "next/link";
import { getUserProgress, getAchievements } from "@/lib/user-progress";
import { useFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useHasMounted } from '@/hooks/use-has-mounted';
import { useToast } from '@/hooks/use-toast';
import StudentProfileSetup from '@/components/StudentProfileSetup';
import CampusSelector from '@/components/CampusSelector';
import { SubscriptionStatusBadge } from '@/components/SubscriptionStatusBadge';
import { EarnPremiumBanner } from '@/components/EarnPremiumBanner';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

export default function ProfilePage() {
  const hasMounted = useHasMounted();
  const [progress, setProgress] = useState(() => ({ lessonsCompleted: 0, quizzesTaken: 0, averageQuizScore: 0, points: 0 }));
  const [achievements, setAchievements] = useState(() => [] as any[]);
  const [linkingCode, setLinkingCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [educationLevel, setEducationLevel] = useState<'Primary' | 'JHS' | 'SHS'>('Primary');
  const { firestore, user, auth } = useFirebase();
  const { toast } = useToast();
  
  const profileRef = useMemo(() => (user && firestore) ? doc(firestore, `students/${user.uid}`) : null, [user, firestore]);
  const { data: profile } = useDoc<any>(profileRef as any);

  useEffect(() => {
    // Only load client-only progress/achievements after we mount to avoid SSR/CSR mismatch
    if (!hasMounted) return;
    setProgress(getUserProgress() as any);
    setAchievements(getAchievements());
  }, [hasMounted]);

  useEffect(() => {
    // Generate a unique 6-digit linking code for this student
    if (user && !linkingCode) {
      // Check if code already exists for this user
      const linkingCodes = JSON.parse(localStorage.getItem('studentLinkingCodes') || '{}');
      
      // Find existing code for this user
      let existingCode = Object.keys(linkingCodes).find(code => linkingCodes[code] === user.uid);
      
      if (existingCode) {
        setLinkingCode(existingCode);
      } else {
        // Generate new code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        linkingCodes[code] = user.uid;
        localStorage.setItem('studentLinkingCodes', JSON.stringify(linkingCodes));
        setLinkingCode(code);
      }
    }
  }, [user, linkingCode]);

  const copyLinkingCode = () => {
    navigator.clipboard.writeText(linkingCode);
    setCopied(true);
    toast({
      title: "Code Copied!",
      description: "Share this code with your parent/guardian",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const sendLinkInvite = () => {
    if (!parentEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your parent's email address",
        variant: "destructive"
      });
      return;
    }
    
    // TODO: Send email with linking code
    toast({
      title: "Invite Sent!",
      description: `An invitation was sent to ${parentEmail}`,
    });
    setParentEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-violet-950/30 dark:to-indigo-950/30 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-300/20 via-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/20 via-cyan-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto p-4 md:p-6 lg:p-8 pb-20 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <CampusSelector onLevelChange={setEducationLevel} defaultLevel={educationLevel} />
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link href="/settings" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="w-full sm:w-auto hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-indigo-500/10 border-2">
                <svg className="h-4 w-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Button>
            </Link>
            <Link href="/redeem-codes" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="w-full sm:w-auto hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 border-2">
                <Gift className="h-4 w-4 sm:mr-2" />
                Earn Premium
              </Button>
            </Link>
            <Button variant="default" size="sm" onClick={() => setEditMode((v) => !v)} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              {editMode ? 'Close Edit' : 'Edit Profile'}
            </Button>
          </div>
        </div>
        {editMode && <StudentProfileSetup onSave={() => setEditMode(false)} />}
        
        {/* Premium Profile Header */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-violet-200/30 dark:border-violet-800/30 shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-violet-500 shadow-xl relative">
                  <AvatarImage src={profile?.profilePictureUrl || "https://placehold.co/100x100.png"} alt={profile?.studentName || "Student Name"} />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-violet-500 to-indigo-600 text-white">{profile?.studentName?.charAt(0)?.toUpperCase() || 'SN'}</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                  {profile?.studentName || 'Student Name'}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium mb-3">{profile?.studentClass || 'JHS student'}</p>
                <SubscriptionStatusBadge variant="detailed" showUpgrade={true} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earn Premium Banner - Only for authenticated users */}
        {user && !user.isAnonymous && (
        <div className="mb-6">
          <EarnPremiumBanner variant="compact" dismissible={true} showProgress={true} />
        </div>
        )}

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border-2 border-amber-200/30 dark:border-amber-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Level</span>
                <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">{(progress as any).level || 1}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{(progress as any).totalXP || 0} XP</p>
            </div>
          </div>
          <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl border-2 border-blue-200/30 dark:border-blue-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lessons</span>
                <BookCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">{progress.lessonsCompleted}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">+10 XP each</p>
            </div>
          </div>
          <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl border-2 border-green-200/30 dark:border-green-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quiz Score</span>
                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">{progress.averageQuizScore}%</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{progress.quizzesTaken} quizzes</p>
            </div>
          </div>
          <div className="group relative p-5 sm:p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl border-2 border-orange-200/30 dark:border-orange-800/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Streak</span>
                <div className="text-2xl">🔥</div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">{(progress as any).currentStreak || 0}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Best: {(progress as any).longestStreak || 0} days</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {FEATURE_FLAGS.V1_LAUNCH.showAchievements && (
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-violet-200/30 dark:border-violet-800/30 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="text-2xl">🏆</div>
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Achievements</span>
                </CardTitle>
                <Badge variant="secondary" className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 border-2 border-violet-200 dark:border-violet-800">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </Badge>
              </div>
              <CardDescription className="text-slate-600 dark:text-slate-400">Unlock badges by completing challenges</CardDescription>
            </CardHeader>
          <CardContent>
            {(FEATURE_FLAGS.V1_LAUNCH.showBookmarks || FEATURE_FLAGS.V1_LAUNCH.showSchedule) && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {FEATURE_FLAGS.V1_LAUNCH.showBookmarks && (
              <Button asChild variant="outline" size="sm">
                <Link href="/bookmarks">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmarks
                </Link>
              </Button>
              )}
              {FEATURE_FLAGS.V1_LAUNCH.showSchedule && (
              <Button asChild variant="outline" size="sm">
                <Link href="/study-schedule">
                  <Target className="h-4 w-4 mr-2" />
                  Schedule
                </Link>
              </Button>
              )}
            </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <Card 
                  key={ach.id} 
                  className={`p-3 ${ach.unlocked ? 'border-2 border-primary bg-primary/5' : 'opacity-50'}`}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`p-2 rounded-full ${ach.unlocked ? 'bg-primary/20' : 'bg-muted'}`}>
                      <ach.icon className={`h-6 w-6 ${ach.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${!ach.unlocked && 'text-muted-foreground'}`}>
                        {ach.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{ach.description}</p>
                      {ach.unlocked && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          +{ach.xpReward} XP
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
          )}

          {FEATURE_FLAGS.V1_LAUNCH.showParent && (
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-violet-200/30 dark:border-violet-800/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">👨‍👩‍👧‍👦</div>
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Link to Parent/Guardian</span>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Allow your parents to monitor your progress
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block text-slate-700 dark:text-slate-300">Your Linking Code</label>
              <div className="flex gap-2">
                <div className="flex-1 p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl font-mono text-2xl font-bold text-center tracking-wider border-2 border-violet-200/50 dark:border-violet-800/50">
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">{linkingCode}</span>
                </div>
                <Button onClick={copyLinkingCode} size="icon" variant="outline" className="h-12 w-12 border-2 hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-indigo-500/10 hover:border-violet-500 transition-all hover:scale-105">
                  {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Share this code with your parent/guardian to link accounts
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block text-slate-700 dark:text-slate-300">Invite via Email</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="h-12 border-2 border-violet-200 dark:border-violet-800 focus:border-violet-500 dark:focus:border-violet-400"
                />
                <Button onClick={sendLinkInvite} className="h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong className="font-bold">Privacy:</strong> Parents can only see your study progress, quiz scores, and lesson completion. Your personal messages and profile details remain private.
              </p>
            </div>

            {profile?.linkedParents && profile.linkedParents.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Linked Parents</h4>
                <div className="space-y-2">
                  {profile.linkedParents.map((parentId: string) => (
                    <div key={parentId} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Parent Account</span>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        )}
        </div>
      </div>
    </div>
  );
}
