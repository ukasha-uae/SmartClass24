'use client';

/**
 * Score Overlay – team scores and streaks
 * Large-screen friendly; white-label via colors.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { ArenaState } from '@/lib/arena/core/types';

interface ScoreOverlayProps {
  state: ArenaState;
  leftColor?: string;
  rightColor?: string;
  className?: string;
}

export function ScoreOverlay({
  state,
  leftColor = 'text-amber-600 dark:text-amber-400',
  rightColor = 'text-blue-600 dark:text-blue-400',
  className,
}: ScoreOverlayProps) {
  const left = state.teams.left;
  const right = state.teams.right;

  const TeamScore = ({ team, color }: { team: { score: number; advantage: number; streak: number }; color: string }) => (
    <div className={cn('flex flex-col items-center gap-1', color)}>
      <span className="text-3xl md:text-4xl font-bold">{team.score}</span>
      <span className="text-sm font-medium opacity-80">Power: {team.advantage}%</span>
      {team.streak >= 2 && (
        <span className="text-xs font-semibold text-green-600 dark:text-green-400">🔥 {team.streak} streak</span>
      )}
    </div>
  );

  return (
    <div className={cn('flex justify-between items-center gap-4 p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg', className)}>
      <TeamScore team={left} color={leftColor} />
      <span className="text-2xl font-bold text-muted-foreground">—</span>
      <TeamScore team={right} color={rightColor} />
    </div>
  );
}
