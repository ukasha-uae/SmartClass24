'use client';

/**
 * Rocket Race renderer – two rockets, fuel 0–100%
 * Correct answers = fuel up; wrong = burn. First to 100% wins.
 */

import React from 'react';
import { Rocket } from 'lucide-react';

export interface RocketRendererProps {
  fuelLeft: number;
  fuelRight: number;
  leftColor?: string;
  rightColor?: string;
  showPowerFlicker?: boolean;
  className?: string;
}

export function RocketRenderer({
  fuelLeft,
  fuelRight,
  leftColor = '#f59e0b',
  rightColor = '#3b82f6',
  showPowerFlicker = false,
  className,
}: RocketRendererProps) {
  const FuelGauge = ({ fuel, color, side }: { fuel: number; color: string; side: 'left' | 'right' }) => (
    <div className="flex flex-col items-center gap-2 w-full max-w-[140px]">
      <div
        className="relative w-full h-48 rounded-lg border-2 border-slate-300 dark:border-slate-600 overflow-hidden bg-slate-100 dark:bg-slate-800"
        style={{ borderColor: color }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out rounded-b-md"
          style={{
            height: `${Math.max(0, Math.min(100, fuel))}%`,
            backgroundColor: color,
            opacity: 0.9,
            boxShadow: showPowerFlicker ? `0 0 20px ${color}` : undefined,
          }}
        />
        <span className="absolute bottom-1 left-1 right-1 text-center text-xs font-bold text-white drop-shadow-md">
          {Math.round(fuel)}%
        </span>
      </div>
      <Rocket
        className="transition-transform duration-300"
        size={40}
        style={{
          color,
          transform: fuel >= 100 ? 'scale(1.1)' : 'scale(1)',
          filter: fuel >= 100 ? `drop-shadow(0 0 8px ${color})` : undefined,
        }}
      />
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
        {side === 'left' ? 'Team Left' : 'Team Right'}
      </span>
    </div>
  );

  return (
    <div
      className={className ?? 'w-full min-h-[280px] flex items-end justify-center gap-8 md:gap-16 p-6 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg'}
      style={{ background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
    >
      <FuelGauge fuel={fuelLeft} color={leftColor} side="left" />
      <div className="flex flex-col items-center gap-1 self-center pb-8">
        <span className="text-xs text-slate-400 font-medium">First to 100%</span>
        <span className="text-2xl">🚀</span>
      </div>
      <FuelGauge fuel={fuelRight} color={rightColor} side="right" />
    </div>
  );
}
