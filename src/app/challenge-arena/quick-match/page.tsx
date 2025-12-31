'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  getAllPlayers,
  createChallenge,
  acceptChallenge,
  startChallenge,
  createOrUpdatePlayer,
  Player,
} from '@/lib/challenge';
import { useFirebase } from '@/firebase/provider';
import { useSoundEffects } from '@/hooks/use-sound-effects';

export default function QuickMatchPage() {
  const router = useRouter();
  const { user } = useFirebase();
  const { playSound } = useSoundEffects();
  
  const [player, setPlayer] = useState<Player | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [matchFound, setMatchFound] = useState(false);
  
  // Match settings
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Get subjects based on player's education level
  const getSubjectsForLevel = (level: 'Primary' | 'JHS' | 'SHS') => {
    if (level === 'Primary') {
      return [
        'English Language',
        'Mathematics',
        'Science',
        'Social Studies',
        'Computing',
        'Creative Arts'
      ];
    } else if (level === 'SHS') {
      return [
        'Core Mathematics',
        'English Language',
        'Integrated Science',
        'Social Studies',
      ];
    } else {
      return [
        'Mathematics',
        'English Language',
        'Integrated Science',
        'Social Studies',
        'Religious & Moral Education',
        'Creative Arts',
        'French',
        'Local Language',
        'ICT',
        'Career Technology'
      ];
    }
  };
  
  const subjects = player ? getSubjectsForLevel(player.level || 'JHS') : [];

  useEffect(() => {
    // Use mock user ID for testing
    const userId = user?.uid || 'test-user-1';
    const playerProfile = getPlayerProfile(userId);
    if (playerProfile) {
      setPlayer(playerProfile);
      // Set default subject based on player's level
      if (!subject) {
        const defaultSubjects = getSubjectsForLevel(playerProfile.level || 'JHS');
        setSubject(defaultSubjects[0] || 'Mathematics');
      }
    } else {
      // Create a test player profile
      const newPlayer = createOrUpdatePlayer({
        userId: userId,
        userName: user?.displayName || 'Test Player',
        school: 'Test School',
        level: 'JHS',
        rating: 1200,
      });
      setPlayer(newPlayer);
    }
  }, [user, router]);

  useEffect(() => {
    if (!isSearching) return;

    // Simulate searching for opponent
    const searchTimer = setTimeout(() => {
      findOpponent();
    }, 2000);

    return () => clearTimeout(searchTimer);
  }, [isSearching]);

  useEffect(() => {
    if (!opponent || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          startMatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [opponent, countdown]);

  const findOpponent = () => {
    if (!player) return;

    // Use mock user ID for testing
    const userId = user?.uid || 'test-user-1';
    const allPlayers = getAllPlayers().filter(p => p.userId !== userId);
    
    // Enhanced SmartClassUAE-style matching algorithm
    const RATING_THRESHOLD = 200; // ±200 rating threshold (like SmartClassUAE)
    
    // 1. Try to find opponent within ±200 rating (SmartClassUAE standard)
    let matched = allPlayers.filter(p => 
      Math.abs(p.rating - player.rating) <= RATING_THRESHOLD
    );
    
    // 2. If no match within threshold, expand to ±300
    if (matched.length === 0) {
      matched = allPlayers.filter(p => 
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
    
    // 5. Fallback to any opponent if still no match
    if (matched.length === 0) {
      matched = allPlayers;
    }
    
    // Pick random opponent from matched players
    if (matched.length > 0) {
      const randomOpponent = matched[Math.floor(Math.random() * matched.length)];
      setOpponent(randomOpponent);
      setMatchFound(true);
      setCountdown(10);
      // Play match found sound
      playSound('matchFound');
    } else {
      // No opponents available
      setIsSearching(false);
      alert('No opponents available right now. Please try again later.');
    }
  };

  const startMatch = () => {
    if (!player || !opponent) return;

    // Create challenge
    const challenge = createChallenge({
      type: 'quick',
      level: player.level || 'JHS',
      subject,
      difficulty,
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

    // Auto-accept for quick match
    acceptChallenge(challenge.id, opponent.userId);
    
    // Start the challenge
    startChallenge(challenge.id);

    // Navigate to battle page
    router.push(`/challenge-arena/play/${challenge.id}`);
  };

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
          <div className="text-3xl sm:text-4xl font-bold animate-pulse">
            Starting in {countdown}... {countdown > 0 ? countdown : 'GO!'}
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
              onClick={() => router.push('/challenge-arena')}
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
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Difficulty</label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={difficulty === 'easy' ? 'default' : 'outline'}
                      onClick={() => setDifficulty('easy')}
                      className={`h-14 font-bold text-base transition-all ${
                        difficulty === 'easy' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl scale-105' 
                          : 'hover:scale-105'
                      }`}
                    >
                      Easy
                    </Button>
                    <Button
                      variant={difficulty === 'medium' ? 'default' : 'outline'}
                      onClick={() => setDifficulty('medium')}
                      className={`h-14 font-bold text-base transition-all ${
                        difficulty === 'medium' 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-xl scale-105' 
                          : 'hover:scale-105'
                      }`}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={difficulty === 'hard' ? 'default' : 'outline'}
                      onClick={() => setDifficulty('hard')}
                      className={`h-14 font-bold text-base transition-all ${
                        difficulty === 'hard' 
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl scale-105' 
                          : 'hover:scale-105'
                      }`}
                    >
                      Hard
                    </Button>
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

        {/* Searching Animation */}
        {isSearching && !opponent && (
          <Card className="mb-6 border-2 border-primary">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Searching for opponent...</h2>
              <p className="text-muted-foreground mb-6">
                Finding someone near your skill level
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="outline">Rating: {player.rating} ±100</Badge>
                <Badge variant="outline">{subject}</Badge>
                <Badge variant="outline">{difficulty}</Badge>
              </div>
              <Button variant="outline" onClick={handleCancel}>
                Cancel Search
              </Button>
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
                      <p className="text-muted-foreground">Difficulty</p>
                      <p className="font-semibold capitalize">{difficulty}</p>
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
