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
  Player,
} from '@/lib/challenge';
import { useFirebase } from '@/firebase/provider';

export default function QuickMatchPage() {
  const router = useRouter();
  const { user } = useFirebase();
  
  const [player, setPlayer] = useState<Player | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [countdown, setCountdown] = useState(10);
  
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
    if (!user) return;
    const playerProfile = getPlayerProfile(user.uid);
    if (playerProfile) {
      setPlayer(playerProfile);
      // Set default subject based on player's level
      if (!subject) {
        const defaultSubjects = getSubjectsForLevel(playerProfile.level || 'JHS');
        setSubject(defaultSubjects[0] || 'Mathematics');
      }
    } else {
      // If profile doesn't exist, redirect to setup or arena main page
      router.push('/challenge-arena');
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
    if (!player || !user) return;

    const allPlayers = getAllPlayers().filter(p => p.userId !== user.uid);
    
    // Smart matching algorithm
    // 1. Try to find opponent within ±100 rating
    let matched = allPlayers.filter(p => 
      Math.abs(p.rating - player.rating) <= 100
    );
    
    // 2. Prefer same school for rivalry
    const sameSchool = matched.filter(p => p.school === player.school);
    if (sameSchool.length > 0) {
      matched = sameSchool;
    }
    
    // 3. Fallback to any opponent
    if (matched.length === 0) {
      matched = allPlayers;
    }
    
    // Pick random opponent from matched players
    if (matched.length > 0) {
      const randomOpponent = matched[Math.floor(Math.random() * matched.length)];
      setOpponent(randomOpponent);
      setCountdown(10);
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

  return (
    <div className="container mx-auto p-3 sm:p-6 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/challenge-arena')}
            className="mb-4"
          >
            ← Back to Arena
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl font-bold">Quick Match</h1>
          </div>
          <p className="text-muted-foreground">
            Get matched with an opponent instantly
          </p>
        </div>

        {/* Match Settings */}
        {!isSearching && !opponent && (
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Match Settings</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={difficulty === 'easy' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('easy')}
                  >
                    Easy
                  </Button>
                  <Button
                    variant={difficulty === 'medium' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('medium')}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={difficulty === 'hard' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('hard')}
                  >
                    Hard
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-semibold">10</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time per question</span>
                  <span className="font-semibold">2 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Profile */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-primary">
                <AvatarFallback className="text-xl font-bold">
                  {player.userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{player.userName}</h3>
                <p className="text-sm text-muted-foreground">{player.school}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default" className="gap-1">
                    <Trophy className="h-3 w-3" />
                    {player.rating}
                  </Badge>
                  <Badge variant="secondary">
                    {player.wins}W - {player.losses}L
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Start Search Button */}
        {!isSearching && !opponent && (
          <Button
            onClick={handleStartSearch}
            className="w-full h-14 text-lg"
            size="lg"
          >
            <Zap className="h-5 w-5 mr-2" />
            Find Match
          </Button>
        )}
      </div>
    </div>
  );
}
