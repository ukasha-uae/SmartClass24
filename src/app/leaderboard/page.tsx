'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Crown, Flame, TrendingUp, Loader2 } from 'lucide-react';
import { getLeaderboard, getUserProgress } from '@/lib/user-progress';
import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';

export default function LeaderboardPage() {
  const { firestore, user } = useFirebase();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        const board = await getLeaderboard(firestore, user?.uid);
        setLeaderboard(board);
        setUserProgress(getUserProgress());
      } catch (error) {
        console.error('[Leaderboard] Error loading:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLeaderboard();
  }, [firestore, user]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />;
    return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Trophy className="h-10 w-10 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">See how you rank among top students worldwide</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* User's Current Stats */}
          {userProgress && (
            <Card className="mb-6 border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold">{userProgress.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                  <p className="text-2xl font-bold">{userProgress.totalXP}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold flex items-center gap-1">
                    {userProgress.currentStreak}
                    <Flame className="h-5 w-5 text-orange-500" />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="text-2xl font-bold">{userProgress.lessonsCompleted}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Students</CardTitle>
              <CardDescription>
                Rankings based on XP earned • 🤖 = AI Competitor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.userId || index}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      user.isCurrentUser
                        ? 'bg-primary/10 border-2 border-primary'
                        : user.isBot
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 flex justify-center">
                        {getRankIcon(user.rank)}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={getRankColor(user.rank)}>
                          {user.isBot ? '🤖' : user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className={`font-semibold ${user.isCurrentUser ? 'text-primary' : user.isBot ? 'text-purple-600 dark:text-purple-400' : ''}`}>
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Level {user.level} {user.school && `• ${user.school}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">XP</p>
                        <p className="font-bold">{user.xp.toLocaleString()}</p>
                      </div>
                      {user.streak > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {user.streak}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-gradient-to-r from-primary/10 to-background">
            <CardHeader>
              <CardTitle>💡 Climb the Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge variant="outline">+10 XP</Badge>
                  <span>Complete a lesson</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">+Score XP</Badge>
                  <span>Finish a quiz (XP = your score %)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">Bonus XP</Badge>
                  <span>Unlock achievements</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">2x XP</Badge>
                  <span>Maintain study streaks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900">🤖 Challenge</Badge>
                  <span>Beat Sarah the Robot to prove your mastery!</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
