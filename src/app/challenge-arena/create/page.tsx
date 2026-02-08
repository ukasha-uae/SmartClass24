'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTenantLink } from '@/hooks/useTenantLink';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Globe, 
  Swords, 
  Users, 
  Zap,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Computer,
  Palette,
  Languages,
  Music
} from 'lucide-react';
import { createChallenge, getAllPlayers, Player, getPlayerProfile, acceptChallenge, startChallenge } from '@/lib/challenge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';
import { getAvailableSubjects, type EducationLevel } from '@/lib/challenge-questions-exports';
import { updateUserPresence, startPresenceHeartbeat, isUserOnline } from '@/lib/user-presence';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';
import { ShareChallengeDialog } from '@/components/challenge/ShareChallengeDialog';
import { getSarahBot } from '@/lib/ai-bot-profiles';

// Create challenge page is now enabled for friend challenges
export default function CreateChallengePage() {
  const router = useRouter();
  const addTenantParam = useTenantLink();
  const { toast } = useToast();
  const { user, firestore } = useFirebase();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLastSeenMap, setUserLastSeenMap] = useState<Record<string, Date | null>>({});
  const [createdChallengeId, setCreatedChallengeId] = useState<string | null>(null);
  const [createdChallengeData, setCreatedChallengeData] = useState<{creatorName: string, creatorSchool: string, subject: string, opponentName?: string} | null>(null);
  
  // Get user's education level - use state to avoid hydration mismatch
  const [userLevel, setUserLevel] = useState<EducationLevel>('JHS');
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Priority 1: Check URL parameter (from challenge arena page)
    const params = new URLSearchParams(window.location.search);
    const levelParam = params.get('level') as 'Primary' | 'JHS' | 'SHS' | null;
    
    if (levelParam && (levelParam === 'Primary' || levelParam === 'JHS' || levelParam === 'SHS')) {
      setUserLevel(levelParam);
      return;
    }
    
    // Priority 2: Check player profile
    const userId = user?.uid || `anon-${Date.now()}`;
    const player = getPlayerProfile(userId);
    if (player?.level) {
      setUserLevel(player.level);
      return;
    }
    
    // Priority 3: Check localStorage
    const savedLevel = localStorage.getItem('userEducationLevel');
    const level = (savedLevel || 'JHS') as EducationLevel;
    setUserLevel(level);
  }, [user]);
  
  // Get available subjects for user's level
  const availableSubjects = useMemo(() => {
    return getAvailableSubjects(userLevel).filter(s => s !== 'Mixed');
  }, [userLevel]);
  
  // Map subjects to UI format with icons
  const getSubjectIcon = (subject: string) => {
    const lower = subject.toLowerCase();
    if (lower.includes('math')) return Calculator;
    if (lower.includes('english') || lower.includes('language')) return BookOpen;
    if (lower.includes('science') || lower.includes('physics') || lower.includes('chemistry') || lower.includes('biology') || lower.includes('integrated')) return FlaskConical;
    if (lower.includes('social')) return Globe;
    if (lower.includes('ict') || lower.includes('computing')) return Computer;
    if (lower.includes('creative') || lower.includes('arts')) return Palette;
    if (lower.includes('french') || lower.includes('arabic')) return Languages;
    if (lower.includes('music')) return Music;
    return BookOpen;
  };
  
  const getSubjectColor = (subject: string, index: number) => {
    const colors = ['text-blue-500', 'text-green-500', 'text-orange-500', 'text-purple-500', 'text-red-500', 'text-yellow-500', 'text-pink-500', 'text-indigo-500'];
    return colors[index % colors.length];
  };
  
  const getSubjectBg = (subject: string, index: number) => {
    const bgs = ['bg-blue-500/10', 'bg-green-500/10', 'bg-orange-500/10', 'bg-purple-500/10', 'bg-red-500/10', 'bg-yellow-500/10', 'bg-pink-500/10', 'bg-indigo-500/10'];
    return bgs[index % bgs.length];
  };
  
  const SUBJECTS = useMemo(() => {
    return availableSubjects.map((subject, index) => ({
      id: subject.toLowerCase().replace(/\s+/g, '-'),
      name: subject,
      icon: getSubjectIcon(subject),
      color: getSubjectColor(subject, index),
      bg: getSubjectBg(subject, index),
    }));
  }, [availableSubjects]);
  
  // Get class levels based on education level
  const getClassLevels = (level: 'Primary' | 'JHS' | 'SHS') => {
    if (level === 'Primary') {
      return [
        { id: 'Primary 1', name: 'Primary 1', color: 'text-green-500' },
        { id: 'Primary 2', name: 'Primary 2', color: 'text-green-500' },
        { id: 'Primary 3', name: 'Primary 3', color: 'text-yellow-500' },
        { id: 'Primary 4', name: 'Primary 4', color: 'text-yellow-500' },
        { id: 'Primary 5', name: 'Primary 5', color: 'text-red-500' },
        { id: 'Primary 6', name: 'Primary 6', color: 'text-red-500' },
      ];
    } else if (level === 'JHS') {
      return [
        { id: 'JHS 1', name: 'JHS 1', color: 'text-green-500' },
        { id: 'JHS 2', name: 'JHS 2', color: 'text-yellow-500' },
        { id: 'JHS 3', name: 'JHS 3', color: 'text-red-500' },
      ];
    } else {
      return [
        { id: 'SHS 1', name: 'SHS 1', color: 'text-green-500' },
        { id: 'SHS 2', name: 'SHS 2', color: 'text-yellow-500' },
        { id: 'SHS 3', name: 'SHS 3', color: 'text-red-500' },
      ];
    }
  };

  const classLevels = getClassLevels(userLevel);

  // Initialize formData with type from URL parameter
  const [formData, setFormData] = useState(() => {
    if (typeof window === 'undefined') {
      return { subject: '', classLevel: '', type: 'quick' as const, opponentId: '' };
    }
    const params = new URLSearchParams(window.location.search);
    const typeFromUrl = params.get('type') === 'friend' ? 'friend' : 'quick';
    return {
      subject: '',
      classLevel: '',
      type: typeFromUrl,
      opponentId: '',
    };
  });
  
  // Update formData.type when URL parameter changes (if user navigates with different type param)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');
      if (typeParam === 'friend' && formData.type !== 'friend') {
        setFormData(prev => ({ ...prev, type: 'friend' }));
      }
    }
  }, [formData.type]);

  // Start presence heartbeat for current user
  useEffect(() => {
    if (!user?.uid) return;
    
    const cleanup = startPresenceHeartbeat(user.uid);
    return cleanup;
  }, [user?.uid]);

  // Query Firestore for real users with online status
  useEffect(() => {
    if (!firestore || !user) return;
    
    let unsubscribe: (() => void) | null = null;
    
    const setupListener = async () => {
      try {
        const { collection, query, limit, onSnapshot } = await import('firebase/firestore');
        const studentsRef = collection(firestore, 'students');
        
        // Use limit without orderBy to avoid index requirements
        const q = query(studentsRef, limit(50));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          const usersList: Player[] = [];
          const lastSeenMap: Record<string, Date | null> = {};
          
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const userId = docSnapshot.id;
            
            // Skip current user
            if (userId === user.uid) return;
            
            if (data.studentName) {
              const lastSeen = data.lastSeen?.toDate?.() || null;
              lastSeenMap[userId] = lastSeen;
              
              usersList.push({
                userId,
                userName: data.studentName || 'Student',
                school: data.schoolName || 'Unknown School',
                level: (data.studentClass?.includes('SHS') ? 'SHS' : 
                       data.studentClass?.includes('JHS') ? 'JHS' : 
                       data.studentClass?.includes('Primary') ? 'Primary' : 'JHS') as 'Primary' | 'JHS' | 'SHS',
                rating: 1200,
                wins: 0,
                losses: 0,
                draws: 0,
                totalGames: 0,
                winStreak: 0,
                highestStreak: 0,
                xp: 0,
                achievements: [],
                coins: 0,
              });
            }
          });
          
          // Sort by online status first, then by name
          usersList.sort((a, b) => {
            const aOnline = isUserOnline(lastSeenMap[a.userId]);
            const bOnline = isUserOnline(lastSeenMap[b.userId]);
            if (aOnline !== bOnline) {
              return aOnline ? -1 : 1;
            }
            return a.userName.localeCompare(b.userName);
          });
          
          setUserLastSeenMap(lastSeenMap);
          
          // Convert Sarah bot to Player format
          const sarahBot = getSarahBot();
          const sarahPlayer: Player = {
            userId: sarahBot.id,
            userName: sarahBot.displayName,
            school: 'AI Study Partner',
            level: 'JHS' as const, // Will adapt to user's level
            rating: 1200,
            wins: 0,
            losses: 0,
            draws: 0,
            totalGames: 0,
            winStreak: 0,
            highestStreak: 0,
            xp: sarahBot.xp,
            achievements: [],
            coins: 0,
          };
          
          // If no real users found, fall back to mock players with Sarah
          if (usersList.length === 0) {
            const allPlayers = getAllPlayers();
            setFriends([sarahPlayer, ...allPlayers.filter(p => p.userId !== user.uid)]);
          } else {
            // Add Sarah at the beginning (she's always online)
            setFriends([sarahPlayer, ...usersList]);
          }
        }, (error: any) => {
          if (error?.code === 'permission-denied') {
            console.warn('[Create Challenge] Permission denied - cannot access students collection');
          } else {
            console.error('Error fetching users:', error);
          }
          // Fall back to Sarah only for anonymous users
          const sarahBot = getSarahBot();
          const sarahPlayer: Player = {
            userId: sarahBot.id,
            userName: sarahBot.displayName,
            school: 'AI Study Partner',
            level: 'JHS' as const,
            rating: 1200,
            wins: 0,
            losses: 0,
            draws: 0,
            totalGames: 0,
            winStreak: 0,
            highestStreak: 0,
            xp: sarahBot.xp,
            achievements: [],
            coins: 0,
          };
          const allPlayers = getAllPlayers();
          setFriends([sarahPlayer, ...allPlayers.filter(p => user?.uid && p.userId !== user.uid)]);
        });
      } catch (error) {
        console.error('Error setting up users listener:', error);
        // Fall back to Sarah for anonymous users
        const sarahBot = getSarahBot();
        const sarahPlayer: Player = {
          userId: sarahBot.id,
          userName: sarahBot.displayName,
          school: 'AI Study Partner',
          level: 'JHS' as const,
          rating: 1200,
          wins: 0,
          losses: 0,
          draws: 0,
          totalGames: 0,
          winStreak: 0,
          highestStreak: 0,
          xp: sarahBot.xp,
          achievements: [],
          coins: 0,
        };
        const allPlayers = getAllPlayers();
        setFriends([sarahPlayer, ...allPlayers.filter(p => user?.uid && p.userId !== user.uid)]);
      }
    };
    
    setupListener();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [firestore, user]);

  // Filter friends by search query only
  // Online users are already sorted to the top in the friends list
  const filteredFriends = friends.filter(friend => {
    return friend.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.school.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedFriend = friends.find(f => f.userId === formData.opponentId);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const userId = user?.uid || `anon-${Date.now()}`;
      
      // Get creator's real profile from Firestore
      let creatorName = user?.displayName || user?.email?.split('@')[0] || 'Player';
      let creatorSchool = 'Unknown School';
      
      if (firestore && user) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const profileRef = doc(firestore, 'students', user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const profileData = profileSnap.data();
            creatorName = profileData.studentName || creatorName;
            creatorSchool = profileData.schoolName || creatorSchool;
          }
        } catch (err: any) {
          if (err?.code === 'permission-denied') {
            console.warn('[Create Challenge] Permission denied - cannot fetch creator profile');
          } else {
            console.error('Failed to fetch creator profile:', err);
          }
        }
      }
      
      const currentUser = { id: userId, name: creatorName, school: creatorSchool };
      const questionCount = 10; // Standard 10 questions
      const timeLimit = 45; // Standard 45 seconds per question
      
      let opponents: any[] = [];
      if (formData.type === 'friend' && formData.opponentId) {
        const friend = friends.find(f => f.userId === formData.opponentId);
        if (friend) {
          opponents = [{ userId: friend.userId, userName: friend.userName, school: friend.school, status: 'invited' as const }];
        }
      }

      // Map subject ID back to full subject name
      const subjectName = SUBJECTS.find(s => s.id === formData.subject)?.name || formData.subject;
      
      // Map 'friend' type to 'quick' since Challenge interface doesn't support 'friend'
      const challengeType = formData.type === 'friend' ? 'quick' : formData.type;
      
      const challenge = createChallenge({
        type: challengeType as any,
        level: userLevel,
        subject: subjectName,
        difficulty: formData.classLevel as any, // Use classLevel as difficulty
        questionCount,
        timeLimit,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
        creatorSchool: currentUser.school,
        opponents,
        maxPlayers: 2,
      });

      // Store challenge data for sharing
      const opponentName = formData.type === 'friend' && formData.opponentId 
        ? friends.find(f => f.userId === formData.opponentId)?.userName 
        : undefined;
      
      setCreatedChallengeId(challenge.id);
      setCreatedChallengeData({
        creatorName: currentUser.name,
        creatorSchool: currentUser.school,
        subject: subjectName,
        opponentName,
      });

      // If opponent is Sarah (bot), auto-accept the challenge
      if (formData.opponentId && formData.opponentId.startsWith('bot-')) {
        console.log('[Challenge Create] Auto-accepting Sarah challenge:', challenge.id);
        const accepted = await acceptChallenge(challenge.id, formData.opponentId);
        console.log('[Challenge Create] Sarah accepted:', accepted);
        
        if (accepted) {
          // Small delay to ensure localStorage/Firestore updates complete
          await new Promise(resolve => setTimeout(resolve, 100));
          const started = startChallenge(challenge.id);
          console.log('[Challenge Create] Challenge started:', started);
          toast({ title: '🤖 Sarah Accepted!', description: 'Sarah is ready to challenge you!' });
        } else {
          console.error('[Challenge Create] Failed to accept Sarah challenge');
          toast({ title: 'Error', description: 'Failed to start challenge with Sarah', variant: 'destructive' });
        }
      } else {
        toast({ title: 'Challenge Created!', description: 'You can share with your opponent!' });
      }
      
      router.push(`/challenge-arena/play/${challenge.id}`);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create challenge', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!formData.subject;
    if (step === 2) return !!formData.classLevel; // classLevel must be selected
    if (step === 3) return formData.type === 'quick' || (formData.type === 'friend' && formData.opponentId);
    if (step === 4) return true; // confirmation step
    return true;
  };

  const nextStep = () => {
    // Skip step 3 (friend selection) if quick match is selected
    if (step === 2 && formData.type === 'quick') {
      setStep(4); // Go directly to confirmation
    } else if (step < 4) {
      setStep(step + 1);
    } else {
      handleCreate();
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      {/* Header with Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Swords className="h-6 w-6 text-primary" />
            Challenge Arena
          </h1>
          <span className="text-sm text-muted-foreground">Step {step} of 4</span>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Step 1: Subject */}
        {step === 1 && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Choose Subject</CardTitle>
              <CardDescription>What do you want to battle in?</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 gap-3">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.id}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all overflow-hidden ${
                      formData.subject === subject.id 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setFormData({ ...formData, subject: subject.id })}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${subject.bg}`}>
                      <subject.icon className={`h-5 w-5 ${subject.color}`} />
                    </div>
                    <span className="font-medium text-sm truncate flex-1 text-left">{subject.name}</span>
                    {formData.subject === subject.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 2: Class Level & Type */}
        {step === 2 && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Battle Settings</CardTitle>
              <CardDescription>Choose your class level and opponent type</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              {/* Class Level - Compact */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Class Level</Label>
                <div className="flex gap-2">
                  {classLevels.map((level) => (
                    <button
                      key={level.id}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-center transition-all ${
                        formData.classLevel === level.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-transparent bg-muted/50 hover:bg-muted'
                      }`}
                      onClick={() => setFormData({ ...formData, classLevel: level.id })}
                    >
                      <div className={`font-semibold text-sm ${level.color}`}>{level.name}</div>
                      <div className="text-xs text-muted-foreground">10 Qs</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Challenge Type - Compact */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Opponent</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.type === 'quick' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setFormData({ ...formData, type: 'quick', opponentId: '' })}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-sm">Quick Match</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Random opponent</p>
                  </button>
                  <button
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.type === 'friend' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setFormData({ ...formData, type: 'friend' })}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold text-sm">Challenge Friend</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Pick a friend</p>
                  </button>
                </div>
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 3: Friend Selection (only for friend type) */}
        {step === 3 && formData.type === 'friend' && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Friend</CardTitle>
              <CardDescription>Choose who you want to challenge</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or school..." 
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Online users appear first with a green indicator
              </p>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredFriends.map((friend) => {
                  const isBot = friend.userId.startsWith('bot-');
                  const isOnline = isBot || isUserOnline(userLastSeenMap[friend.userId]);
                  return (
                    <button
                      key={friend.userId}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        formData.opponentId === friend.userId 
                          ? 'border-primary bg-primary/5' 
                          : 'border-transparent bg-muted/50 hover:bg-muted'
                      }`}
                      onClick={() => setFormData({ ...formData, opponentId: friend.userId })}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm">{friend.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {isOnline && (
                          <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-green-500 text-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{friend.userName}</p>
                          {isBot ? (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600 dark:text-green-400">
                              Always Online
                            </Badge>
                          ) : isOnline ? (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600 dark:text-green-400">
                              Online
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{friend.school}</p>
                      </div>
                      {formData.opponentId === friend.userId && (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
                {filteredFriends.length === 0 && (
                  <p className="text-center py-6 text-sm text-muted-foreground">No friends found</p>
                )}
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 4: Confirmation & Summary */}
        {step === 4 && (
          <div className="animate-in fade-in duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Challenge Summary</CardTitle>
              <CardDescription>Review your challenge settings</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              {/* Challenge Summary Card */}
              <div className="bg-primary/5 rounded-xl p-4 space-y-4 border-2 border-primary/20">
                {/* Opponent Preview */}
                {formData.type === 'friend' && selectedFriend ? (
                  <div className="flex items-center gap-3 pb-3 border-b border-primary/20">
                    <Avatar className="h-12 w-12 border-2 border-primary/30">
                      <AvatarFallback className="text-base font-bold">{selectedFriend.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-base">VS {selectedFriend.userName}</p>
                      <p className="text-xs text-muted-foreground">{selectedFriend.school}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pb-3 border-b border-primary/20">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base">Quick Match</p>
                      <p className="text-xs text-muted-foreground">Random opponent</p>
                    </div>
                  </div>
                )}
                
                {/* Settings Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs block mb-1">Subject</span>
                    <p className="font-medium flex items-center gap-1">
                      {(() => {
                        const subject = SUBJECTS.find(s => s.id === formData.subject);
                        const Icon = subject?.icon || BookOpen;
                        return (
                          <>
                            <Icon className="h-4 w-4" />
                            {subject?.name || formData.subject}
                          </>
                        );
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block mb-1">Class Level</span>
                    <p className="font-medium">{formData.classLevel}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block mb-1">Questions</span>
                    <p className="font-medium">10</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block mb-1">Time Limit</span>
                    <p className="font-medium">45s per Q</p>
                  </div>
                </div>
                
                {/* Share Challenge Button - Only show for friend challenges */}
                {formData.type === 'friend' && selectedFriend && createdChallengeId && createdChallengeData && (
                  <div className="pt-4 border-t border-primary/20">
                    <ShareChallengeDialog
                      challengeId={createdChallengeId}
                      creatorName={createdChallengeData.creatorName}
                      creatorSchool={createdChallengeData.creatorSchool}
                      subject={createdChallengeData.subject}
                      opponentName={createdChallengeData.opponentName}
                      opponentUserId={formData.opponentId}
                      onEmailSent={() => {
                        toast({ title: 'Email sent!', description: 'Your opponent will be notified.' });
                      }}
                      onWhatsAppSent={() => {
                        toast({ title: 'WhatsApp opened!', description: 'Send the message to notify your opponent.' });
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="border-t px-4 py-3 flex items-center justify-between bg-muted/30">
          {step === 1 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(addTenantParam('/challenge-arena'))}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // If on step 4 and quick match, go back to step 2 (skip step 3)
                if (step === 4 && formData.type === 'quick') {
                  setStep(2);
                } else {
                  setStep(step - 1);
                }
              }}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          
          <Button
            size="sm"
            onClick={nextStep}
            disabled={!canProceed() || loading}
            className="gap-1"
          >
            {loading ? 'Creating...' : step === 4 ? 'Start Challenge' : 'Next'}
            {!loading && step < 4 && <ArrowRight className="h-4 w-4" />}
            {!loading && step === 4 && <Swords className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      {/* Summary Preview (always visible) */}
      {formData.subject && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="bg-muted px-2 py-1 rounded-full">{SUBJECTS.find(s => s.id === formData.subject)?.name}</span>
          {formData.classLevel && <span className="bg-muted px-2 py-1 rounded-full">{formData.classLevel}</span>}
          <span className="bg-muted px-2 py-1 rounded-full">{formData.type === 'quick' ? 'Quick Match' : selectedFriend?.userName || 'Select friend'}</span>
        </div>
      )}
    </div>
  );
}
