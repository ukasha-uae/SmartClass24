'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Target, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface LabProgressData {
  totalLabs: number;
  completedLabs: number;
  totalXP: number;
  streak: number;
  badges: string[];
}

export function LabProgress() {
  const [progress, setProgress] = useState<LabProgressData>({
    totalLabs: 0,
    completedLabs: 0,
    totalXP: 0,
    streak: 0,
    badges: []
  });

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('virtual-lab-progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const completionRate = progress.totalLabs > 0 
    ? Math.round((progress.completedLabs / progress.totalLabs) * 100) 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-violet-600" />
            Your Progress
          </h3>
          <Badge variant="outline" className="bg-violet-100 dark:bg-violet-900 border-violet-300">
            Level {Math.floor(progress.totalXP / 500) + 1}
          </Badge>
        </div>

        {/* XP Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Experience Points</span>
            <span className="font-semibold text-violet-600">{progress.totalXP} XP</span>
          </div>
          <Progress value={(progress.totalXP % 500) / 5} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {500 - (progress.totalXP % 500)} XP to next level
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
            <Target className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl font-bold">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
            <Star className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
            <p className="text-xl font-bold">{progress.completedLabs}</p>
            <p className="text-xs text-muted-foreground">Labs Done</p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
            <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
            <p className="text-xl font-bold">{progress.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
