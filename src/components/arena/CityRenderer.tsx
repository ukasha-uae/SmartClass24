'use client';

/**
 * City Renderer – 2D visualization for Light Your City
 * Receives powerLeft and powerRight (0–100); lights buildings accordingly.
 * Swappable renderer – no arena logic, only visual.
 */

import React from 'react';
import { cn } from '@/lib/utils';

const BUILDING_COLS = 5;
const BUILDING_ROWS = 3;

interface CityRendererProps {
  powerLeft: number;
  powerRight: number;
  leftColor?: string;
  rightColor?: string;
  showPowerFlicker?: boolean;
  className?: string;
}

export function CityRenderer({
  powerLeft,
  powerRight,
  leftColor = 'from-amber-400 to-orange-500',
  rightColor = 'from-blue-400 to-indigo-500',
  showPowerFlicker = false,
  className,
}: CityRendererProps) {
  const litCountLeft = Math.round((powerLeft / 100) * (BUILDING_COLS * BUILDING_ROWS));
  const litCountRight = Math.round((powerRight / 100) * (BUILDING_COLS * BUILDING_ROWS));

  const BuildingGrid = ({
    litCount,
    gradient,
    label,
  }: {
    litCount: number;
    gradient: string;
    label: string;
  }) => {
    const total = BUILDING_COLS * BUILDING_ROWS;
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div
          className={cn(
            'grid gap-2 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50',
            `grid-cols-${BUILDING_COLS}`
          )}
          style={{ gridTemplateColumns: `repeat(${BUILDING_COLS}, 1fr)` }}
        >
          {Array.from({ length: total }).map((_, i) => {
            const isLit = i < litCount;
            return (
              <div
                key={i}
                className={cn(
                  'aspect-square rounded-lg transition-all duration-300',
                  isLit
                    ? `bg-gradient-to-br ${gradient} shadow-lg`
                    : 'bg-slate-300 dark:bg-slate-700',
                  showPowerFlicker && isLit && 'animate-pulse'
                )}
                style={{
                  boxShadow: isLit ? `0 0 12px rgba(251,191,36,0.5)` : undefined,
                }}
              />
            );
          })}
        </div>
        <span className="text-lg font-bold">{Math.round((litCount / total) * 100)}% powered</span>
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col md:flex-row gap-6 md:gap-12 justify-center items-stretch', className)}>
      <BuildingGrid litCount={litCountLeft} gradient={leftColor} label="Team Left" />
      <div className="flex items-center justify-center text-2xl text-muted-foreground font-bold">VS</div>
      <BuildingGrid litCount={litCountRight} gradient={rightColor} label="Team Right" />
    </div>
  );
}
