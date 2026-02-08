'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTenantLink } from '@/hooks/useTenantLink';
import { 
  Zap, Trophy, Loader2, Users, Target, X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getPlayerProfile,
  createChallenge,
  acceptChallenge,
  startChallenge,
  createOrUpdatePlayer,
  Player,
} from '@/lib/challenge';
import { useFirebase } from '@/firebase/provider';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { useToast } from '@/hooks/use-toast';
import { startPresenceHeartbeat, isUserOnline } from '@/lib/user-presence';
import { getAvailableSubjects, type EducationLevel } from '@/lib/challenge-questions-exports';
import { getSarahBot, getSarahAdaptedDifficulty, isBot } from '@/lib/ai-bot-profiles';

export default function QuickMatchPage() {
  const router = useRouter();
  const addTenantParam = useTenantLink();
  const { user, firestore } = useFirebase();
  const { playSound } = useSoundEffects();
  const { toast } = useToast();
  
  const [userSelectedLevel, setUserSelectedLevel] = useState<'Primary' | 'JHS' | 'SHS'>('JHS');
  
  // Read level from URL client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const levelParam = params.get('level') as 'Primary' | 'JHS' | 'SHS' | null;
      if (levelParam) {
        setUserSelectedLevel(levelParam);
      }
    }
  }, []);
  
  const [player, setPlayer] = useState<Player | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [matchFound, setMatchFound] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  
  // Match settings
  const [subject, setSubject] = useState('');
  const [classLevel, setClassLevel] = useState<string>(''); // Will be set based on player level
  
  // Get subjects based on player's education level - use the same function as Challenge a Friend
  const subjects = player ? getAvailableSubjects(player.level || 'JHS').filter(s => s !== 'Mixed') : [];

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

  const classLevels = player ? getClassLevels(player.level || 'JHS') : [];

  // Start presence heartbeat for current user
  useEffect(() => {
    if (!user?.uid) return;
    
    const cleanup = startPresenceHeartbeat(user.uid);
    return cleanup;
  }, [user?.uid]);

  // Fetch real online users from Firestore
  useEffect(() => {
    if (!firestore || !user) {
      setOnlinePlayers([]);
      return;
    }
    
    let unsubscribe: (() => void) | null = null;
    
    const setupListener = async () => {
      try {
        const { collection, query, limit, onSnapshot } = await import('firebase/firestore');
        const studentsRef = collection(firestore, 'students');
        
        const q = query(studentsRef, limit(100));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          const playersList: Player[] = [];
          const allUsers: Array<{userId: string, userName: string, lastSeen: any, isOnline: boolean}> = [];
          
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const userId = docSnapshot.id;
            
            // Skip current user
            if (userId === user.uid) return;
            
            if (data.studentName) {
              const lastSeen = data.lastSeen?.toDate?.() || null;
              const isOnline = isUserOnline(lastSeen);
              
              // Debug logging
              allUsers.push({
                userId,
                userName: data.studentName || 'Student',
                lastSeen: lastSeen ? lastSeen.toISOString() : 'null',
                isOnline
              });
              
              // Only include online users for quick match
              if (!isOnline) return;
              
              playersList.push({
                userId,
                userName: data.studentName || 'Student',
                school: data.schoolName || 'Unknown School',
                level: (data.studentClass?.includes('SHS') ? 'SHS' : 
                       data.studentClass?.includes('JHS') ? 'JHS' : 
                       data.studentClass?.includes('Primary') ? 'Primary' : 'JHS') as 'Primary' | 'JHS' | 'SHS',
                rating: data.rating || 1200, // Use rating from Firestore if available
                wins: data.wins || 0,
                losses: data.losses || 0,
                draws: data.draws || 0,
                totalGames: data.totalGames || 0,
                winStreak: data.winStreak || 0,
                highestStreak: data.highestStreak || 0,
                xp: data.xp || 0,
                achievements: data.achievements || [],
                coins: data.coins || 0,
              });
            }
          });
          
          console.log('[Quick Match] All users from Firestore:', allUsers);
          console.log('[Quick Match] Online players found:', playersList.length, playersList.map(p => p.userName));
          
          setOnlinePlayers(playersList);
        }, (error: any) => {
          if (error?.code === 'permission-denied') {
            console.warn('[Quick Match] Permission denied - cannot access students collection');
            setOnlinePlayers([]);
          } else {
            console.error('Error fetching online players:', error);
            setOnlinePlayers([]);
          }
        });
      } catch (error) {
        console.error('Error setting up online players listener:', error);
        setOnlinePlayers([]);
      }
    };
    
    setupListener();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [firestore, user]);

  useEffect(() => {
    // Use mock user ID for testing
    const userId = user?.uid || 'test-user-1';
    const playerProfile = getPlayerProfile(userId);
    if (playerProfile) {
      // Update player level to match selected arena level
      const updatedProfile = { ...playerProfile, level: userSelectedLevel };
      createOrUpdatePlayer(updatedProfile);
      setPlayer(updatedProfile);
      
      // Sync player name from Firestore student profile (non-blocking)
      if (firestore && user?.uid) {
        import('@/lib/challenge').then(({ syncPlayerNameFromFirestore }) => {
          syncPlayerNameFromFirestore(user.uid).then((name) => {
            if (name && playerProfile.userName !== name) {
              // Update local state with synced name
              setPlayer({ ...playerProfile, userName: name });
            }
          });
        });
      }
      
      // Set default subject based on player's level
      if (!subject) {
        const defaultSubjects = getAvailableSubjects(playerProfile.level || 'JHS').filter(s => s !== 'Mixed');
        setSubject(defaultSubjects[0] || 'Mathematics');
      }
      // Set default class level based on player's level
      if (!classLevel) {
        const defaultClassLevels = getClassLevels(playerProfile.level || 'JHS');
        setClassLevel(defaultClassLevels[0]?.id || 'JHS 1');
      }
    } else {
      // Fetch student name from Firestore first, then create player
      const createPlayer = async () => {
        let displayName = user?.displayName || 'Test Player';
        
        // Try to get real student name from Firestore
        if (firestore && user?.uid) {
          try {
            const { doc, getDoc } = await import('firebase/firestore');
            const profileRef = doc(firestore, `students/${user.uid}`);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
              const studentName = profileSnap.data()?.studentName;
              if (studentName) {
                displayName = studentName;
              }
            }
          } catch (err: any) {
            if (err?.code === 'permission-denied') {
              console.warn('[QuickMatch] Permission denied - cannot fetch student profile');
            } else {
              console.warn('[QuickMatch] Could not fetch student profile:', err);
            }
          }
        }
        
        // Create a player profile with the fetched or default name
        const newPlayer = createOrUpdatePlayer({
          userId: userId,
          userName: displayName,
          school: 'Unknown School',
          level: userSelectedLevel, // Use level from URL parameter
          rating: 1200,
        });
        setPlayer(newPlayer);
        
        // Set default class level for new player
        const defaultClassLevels = getClassLevels('JHS');
        setClassLevel(defaultClassLevels[0]?.id || 'JHS 1');
      };
      
      createPlayer();
    }
  }, [user, router, firestore]);

  useEffect(() => {
    if (!isSearching) return;

    // Simulate searching for opponent
    const searchTimer = setTimeout(() => {
      findOpponent();
    }, 2000);

    return () => clearTimeout(searchTimer);
  }, [isSearching, matchFound]);

  useEffect(() => {
    if (!opponent || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [opponent, countdown]);

  const findOpponent = () => {
    if (!player) return;

    // Use ONLY real online players from Firestore - NO mock players
    const availablePlayers = onlinePlayers.filter(p => p.userId !== user?.uid);
    
    // If no real online players available, use Sarah bot as fallback
    if (availablePlayers.length === 0) {
      const sarah = getSarahBot();
      const difficulty = getSarahAdaptedDifficulty(
        player.level || 'JHS',
        player.xp || 0,
        undefined
      );
      
      // Create Sarah as a player opponent
      const sarahOpponent: Player = {
        userId: sarah.id,
        userName: sarah.firstName,
        school: 'AI Study Partner',
        level: player.level || 'JHS', // Match player's level
        rating: player.rating, // Match player's rating for fairness
        xp: sarah.xp,
        avatar: sarah.avatar,
        wins: 0,
        losses: 0,
        draws: 0,
        totalGames: 0,
        winStreak: 0,
        highestStreak: 0,
        achievements: [],
        coins: 0,
      };
      
      setOpponent(sarahOpponent);
      setMatchFound(true);
      setCountdown(10);
      setIsSearching(false);
      playSound('matchFound');
      
      toast({
        title: '🤖 Sarah Accepted Your Challenge!',
        description: "No players online right now, but I'm here to practice with you! Let's go! 📚",
      });
      return;
    }
    
    // Enhanced SmartClassUAE-style matching algorithm with real online users
    const RATING_THRESHOLD = 200; // ±200 rating threshold (like SmartClassUAE)
    
    // 1. Try to find opponent within ±200 rating (SmartClassUAE standard)
    let matched = availablePlayers.filter(p => 
      Math.abs(p.rating - player.rating) <= RATING_THRESHOLD
    );
    
    // 2. If no match within threshold, expand to ±300
    if (matched.length === 0) {
      matched = availablePlayers.filter(p => 
        Math.abs(p.rating - player.rating) <= 300
      );
    }
    
    // 3. Prefer same school for rivalry (if available in threshold)
    const sameSchool = matched.filter(p => p.school === player.school);
    if (sameSchool.length > 0) {
      matched = sameSchool;
    }
    
    // 4. Prefer similar level (JHS vs SHS)
    const sameLevel = matched.filter(p => p.level === player.level);
    if (sameLevel.length > 0) {
      matched = sameLevel;
    }
    
    // 5. Fallback to any online opponent if still no match
    if (matched.length === 0) {
      matched = availablePlayers;
    }
    
    // Pick random opponent from matched players (all are real online users)
    if (matched.length > 0) {
      const randomOpponent = matched[Math.floor(Math.random() * matched.length)];
      setOpponent(randomOpponent);
      setMatchFound(true);
      setCountdown(10);
      // Play match found sound
      playSound('matchFound');
    } else {
      // No opponents available (should not happen but safety check)
      setIsSearching(false);
      setMatchFound(false);
      toast({
        title: 'No Opponents Available',
        description: 'No online players are available right now. Please try again later when more players are online.',
        variant: 'default',
      });
    }
  };

  const startMatch = useCallback(async () => {
    if (!player || !opponent) return;

    console.log('[Quick Match] Starting match with opponent:', opponent.userName, opponent.userId);

    // Create challenge
    const challenge = createChallenge({
      type: 'quick',
      level: player.level || 'JHS',
      subject,
      difficulty: classLevel as any, // Using classLevel as difficulty for backward compatibility
      questionCount: 10,
      timeLimit: 120,
      creatorId: player.userId,
      creatorName: player.userName,
      creatorSchool: player.school,
      opponents: [{
        userId: opponent.userId,
        userName: opponent.userName,
        school: opponent.school,
        status: 'invited',
      }],
      maxPlayers: 2,
      scheduledTime: undefined,
    });

    console.log('[Quick Match] Challenge created:', challenge.id);

    // Auto-accept for quick match
    const accepted = await acceptChallenge(challenge.id, opponent.userId);
    console.log('[Quick Match] Challenge accepted:', accepted);
    
    // Small delay to ensure state updates
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Start the challenge
    const started = startChallenge(challenge.id);
    console.log('[Quick Match] Challenge started:', started);

    // Navigate to battle page
    router.push(`/challenge-arena/play/${challenge.id}`);
  }, [player, opponent, subject, classLevel, router]);

  // Separate effect to handle navigation when countdown reaches 0 (after startMatch is defined)
  useEffect(() => {
    if (opponent && countdown === 0) {
      // Use setTimeout to defer navigation until after render
      setTimeout(() => {
        startMatch();
      }, 0);
    }
  }, [opponent, countdown, startMatch]);

  const handleStartSearch = () => {
    setIsSearching(true);
    setOpponent(null);
    setCountdown(10);
  };

  const handleCancel = () => {
    setIsSearching(false);
    setOpponent(null);
    setCountdown(10);
  };

  if (!player) return null;

  // Matchmaking state
  if (isSearching && !matchFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Cancel Button */}
        <button
          onClick={handleCancel}
          className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-sm transition-all font-semibold text-sm sm:text-base"
        >
          ← Cancel
        </button>

        <div className="text-center text-white relative z-10">
          <div className="text-6xl sm:text-7xl lg:text-8xl mb-6 sm:mb-8 animate-bounce">🎮</div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">Finding Opponent...</h1>
          <p className="text-xl sm:text-2xl opacity-90 mb-6 sm:mb-8">Searching for the perfect match</p>
          <div className="mt-6 sm:mt-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  // Match found state
  if (matchFound && opponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Leave Button */}
        <button
          onClick={handleCancel}
          className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-sm transition-all font-semibold text-sm sm:text-base"
        >
          ← Leave
        </button>

        <div className="text-center text-white relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">Match Found! 🎉</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-6xl sm:text-7xl lg:text-8xl mb-3 sm:mb-4">😊</div>
              <div className="text-xl sm:text-2xl font-bold">{player.userName}</div>
              <div className="text-base sm:text-lg opacity-90">Rating: {player.rating}</div>
            </div>
            <div className="text-4xl sm:text-5xl lg:text-6xl">⚔️</div>
            <div className="text-center">
              <div className="text-6xl sm:text-7xl lg:text-8xl mb-3 sm:mb-4">👨</div>
              <div className="text-xl sm:text-2xl font-bold">{opponent.userName}</div>
              <div className="text-base sm:text-lg opacity-90">Rating: {opponent.rating}</div>
            </div>
          </div>
          <div className="mt-8 sm:mt-12">
            <div className={`inline-block p-6 sm:p-8 rounded-3xl border-4 transition-all duration-300 ${
              countdown <= 3 
                ? 'bg-gradient-to-br from-red-500 to-orange-600 border-red-400 animate-pulse scale-110' 
                : countdown <= 6
                ? 'bg-gradient-to-br from-orange-500 to-yellow-600 border-orange-400 scale-105'
                : 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400'
            } shadow-2xl`}>
              <div className="text-center">
                <p className="text-sm sm:text-base opacity-90 mb-2">Starting in</p>
                <div className={`text-6xl sm:text-7xl lg:text-8xl font-bold transition-all duration-300 ${
                  countdown <= 3 ? 'animate-bounce' : ''
                }`}>
                  {countdown > 0 ? countdown : 'GO!'}
                </div>
                {countdown === 0 && (
                  <div className="mt-4 text-2xl sm:text-3xl animate-pulse">🚀</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-300/20 via-red-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/20 via-purple-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto p-3 sm:p-6 pb-20 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Premium Header */}
          <div className="mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push(addTenantParam('/challenge-arena'))}
              className="mb-4 hover:bg-white/80 backdrop-blur-sm"
            >
              ← Back to Arena
            </Button>
            <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
              <div className="text-5xl sm:text-6xl animate-pulse">⚡</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Quick Match
              </h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 text-center sm:text-left">
              Get matched with an opponent instantly
            </p>
          </div>

        {/* Premium Match Settings Card */}
        {!isSearching && !opponent && (
          <Card className="mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-orange-200/30 dark:border-orange-800/30 shadow-2xl">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  Match Settings
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Configure your match preferences</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="h-12 bg-white dark:bg-gray-800 border-2">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Class Level</label>
                  <div className={`grid gap-3 ${classLevels.length === 3 ? 'grid-cols-3' : classLevels.length === 6 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {classLevels.map((level) => {
                      const isSelected = classLevel === level.id;
                      const colorClass = level.color.includes('green') 
                        ? 'from-green-500 to-emerald-600' 
                        : level.color.includes('yellow') 
                        ? 'from-yellow-500 to-orange-600' 
                        : 'from-red-500 to-rose-600';
                      
                      return (
                        <Button
                          key={level.id}
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => setClassLevel(level.id)}
                          className={`h-14 font-bold text-base transition-all ${
                            isSelected 
                              ? `bg-gradient-to-r ${colorClass} text-white shadow-lg hover:shadow-xl scale-105` 
                              : 'hover:scale-105'
                          }`}
                        >
                          {level.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">❓</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">Questions</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">⏱️</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">Time</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2 min</div>
                    </div>
                  </div>
                </div>

                {/* Start Match Button */}
                <Button
                  onClick={handleStartSearch}
                  disabled={!subject}
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Find Match
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium Profile Card */}
        {!isSearching && !opponent && (
          <Card className="mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-blue-200/30 dark:border-blue-800/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-blue-500 shadow-lg">
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {player.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{player.userName}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{player.school}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="default" className="gap-1 bg-gradient-to-r from-amber-500 to-orange-600">
                      <Trophy className="h-3 w-3" />
                      {player.rating}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/80 dark:bg-gray-800/80">
                      {player.wins}W - {player.losses}L
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Opponent Found */}
        {opponent && (
          <>
            <Card className="mb-6 border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Opponent Found!
                    </h2>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <p className="text-muted-foreground">
                    Match starting in <span className="text-3xl font-bold text-primary">{countdown}</span> seconds
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-border">
                    <AvatarFallback className="text-xl font-bold">
                      {opponent.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{opponent.userName}</h3>
                    <p className="text-sm text-muted-foreground">{opponent.school}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="default" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        {opponent.rating}
                      </Badge>
                      <Badge variant="secondary">
                        {opponent.wins}W - {opponent.losses}L
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <p className="text-muted-foreground">Subject</p>
                      <p className="font-semibold">{subject}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Class Level</p>
                      <p className="font-semibold">{classLevel}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Questions</p>
                      <p className="font-semibold">10</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={startMatch}
                className="flex-1 h-14 text-lg"
              >
                Start Now
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-14"
                size="icon"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
